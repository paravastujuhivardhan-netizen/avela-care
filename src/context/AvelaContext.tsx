import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import type { PatientProfile, ChatMessage, ClinicianRequest, TimelineEvent, ActivityMetricEvent, CoverageSettings, Language, CitationReference, HandoffSummary, CareInstruction, PatientRecord } from '../types'
import { processPatientQuery } from '../engine/routing'
import { generateHandoffSummary } from '../engine/handoffGenerator'
import { createInitialSession, loadSession, restoreSession, persistSession, STORAGE_KEY, isPatientId, demoTime as clockTime, demoDate as clockDate, isQuietTime, requestDelivery, upsertRequest } from '../engine/session'
import type { DemoSession, PatientId, PatientTab } from '../engine/session'
import { TRANSLATIONS } from '../data/translations'
import { useSpokenReplies } from '../hooks/useSpokenReplies'

interface AvelaContextType {
  voiceEnabled: boolean
  setVoiceEnabled: (enabled: boolean) => void
  speechSynthesisSupported: boolean
  isSpeaking: boolean
  isPaused: boolean
  activeSpeechMessageId: string | null
  autoplayBlocked: boolean
  speakMessage: (id: string, text: string, force?: boolean) => void
  pauseSpeech: () => void
  resumeSpeech: () => void
  stopSpeech: () => void
  groqConnectionStatus: 'idle' | 'connected' | 'fallback'
  groqIssue: string
  openChat: (patientId?: PatientProfile['id'], query?: string) => void
  sendDirectMessage: (text: string) => string | null
  demoControlsOpen: boolean
  setDemoControlsOpen: (open: boolean) => void
  persistenceNotice: string
  // Navigation & perspective
  perspective: 'landing' | 'patient' | 'clinician'
  setPerspective: (p: 'landing' | 'patient' | 'clinician') => void
  patientTab: 'home' | 'chat' | 'careplan' | 'records' | 'careteam' | 'timeline'
  setPatientTab: (tab: 'home' | 'chat' | 'careplan' | 'records' | 'careteam' | 'timeline') => void
  
  // Patient state
  selectedPatientId: 'patient-priya' | 'patient-marcus'
  setSelectedPatientId: (id: 'patient-priya' | 'patient-marcus') => void
  patients: Record<'patient-priya' | 'patient-marcus', PatientProfile>
  currentPatient: PatientProfile
  
  // Chat & Engine
  messages: ChatMessage[]
  isTyping: boolean
  sendMessage: (text: string, patientId?: PatientProfile["id"]) => Promise<void>
  clearChatHistory: () => void
  
  // Handoff & Requests
  activeHandoffModal: HandoffSummary | null
  setActiveHandoffModal: (h: HandoffSummary | null) => void
  submitHandoffRequest: (handoff: HandoffSummary, userNotes?: string) => string | null
  requests: ClinicianRequest[]
  acknowledgeRequest: (requestId: string, clinicianName?: string) => void
  replyToRequest: (requestId: string, replyText: string, clinicianName?: string) => void
  closeRequest: (requestId: string) => void
  
  // Evidence drawer & Citations
  activeCitation: CitationReference | null
  setActiveCitation: (c: CitationReference | null) => void
  highlightedPassage: string | null
  setHighlightedPassage: (p: string | null) => void
  
  // Clinician Instruction Editor
  activeInstructionToEdit: CareInstruction | null
  setActiveInstructionToEdit: (inst: CareInstruction | null) => void
  publishInstructionVersion: (instructionId: string, newTitle: string, newContent: string, newPassage: string) => void
  
  // Modals & Panels
  isMorningDigestOpen: boolean
  setIsMorningDigestOpen: (open: boolean) => void
  isCoverageModalOpen: boolean
  setIsCoverageModalOpen: (open: boolean) => void
  isOnboardingOpen: boolean
  setIsOnboardingOpen: (open: boolean) => void
  
  // Timeline & Activity
  timelineEvents: TimelineEvent[]
  activityEvents: ActivityMetricEvent[]
  
  // Clock & Coverage
  demoTime: string // e.g. "22:00"
  demoDate: string // e.g. "1 Nov 2026"
  isQuietHours: boolean
  coverageSettings: CoverageSettings
  updateCoverageSettings: (settings: Partial<CoverageSettings>) => void
  advanceDemoTime: (hours: number) => void
  
  // Accessibility & i18n
  language: Language
  setLanguage: (lang: Language) => void
  t: typeof TRANSLATIONS['en']
  largeTextMode: boolean
  setLargeTextMode: (val: boolean) => void
  
  // Guided tour
  tourActive: boolean
  tourStep: number
  startTour: () => void
  nextTourStep: () => void
  endTour: () => void
  
  // Record import & check-in
  importRecord: (record: PatientRecord) => void
  completePendingCheckIn: (notes: string) => void
  resetDemo: () => void
}

const AvelaContext = createContext<AvelaContextType | null>(null)
type Perspective = AvelaContextType['perspective']
const newId = (prefix: string) => prefix + '-' + crypto.randomUUID()
function route() {
  const parts = window.location.pathname.split('/').filter(Boolean)
  const perspective: Perspective = parts[0] === 'patient' ? 'patient' : parts[0] === 'clinician' ? 'clinician' : 'landing'
  const tab = (['home', 'chat', 'careplan', 'records', 'careteam', 'timeline'].includes(parts[1]) ? parts[1] : null) as PatientTab | null
  return { perspective, tab }
}
export const AvelaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const voice = useSpokenReplies()
  const [groqConnectionStatus, setGroqConnectionStatus] = useState<'idle' | 'connected' | 'fallback'>('idle')
  const [groqIssue, setGroqIssue] = useState('')
  const [session, setSession] = useState<DemoSession>(() => {
    let initial: DemoSession
    try { initial = loadSession(window.localStorage) } catch { initial = createInitialSession() }
    return { ...initial, patientTab: route().tab || initial.patientTab }
  })
  const sessionRef = useRef(session)
  const [perspective, setPerspectiveState] = useState<Perspective>(() => route().perspective)
  const perspectiveRef = useRef(perspective)
  const [typingPatient, setTypingPatient] = useState<string | null>(null)
  const generation = useRef(0)
  const pendingReplies = useRef(0)
  const [persistenceNotice, setNotice] = useState('')
  const [activeCitation, setActiveCitation] = useState<CitationReference | null>(null)
  const [highlightedPassage, setHighlightedPassage] = useState<string | null>(null)
  const [activeHandoffModal, setActiveHandoffModal] = useState<HandoffSummary | null>(null)
  const [activeInstructionToEdit, setActiveInstructionToEdit] = useState<CareInstruction | null>(null)
  const [isMorningDigestOpen, setIsMorningDigestOpen] = useState(false)
  const [isCoverageModalOpen, setIsCoverageModalOpen] = useState(false)
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false)
  const [demoControlsOpen, setDemoControlsOpen] = useState(false)
  const [tourActive, setTourActive] = useState(false)
  const [tourStep, setTourStep] = useState(1)

  // Every local mutation is committed atomically and saved, including conversations.
  const commit = useCallback((transform: (current: DemoSession) => DemoSession) => {
    const current = sessionRef.current
    const changed = transform(current)
    if (changed === current) return
    const next = { ...changed, updatedAt: Math.max(Date.now(), current.updatedAt + 1) }
    sessionRef.current = next
    setSession(next)
    try {
      if (!persistSession(window.localStorage, next)) setNotice('This browser could not save demo changes. Keep the page open; changes may be lost on reload.')
    } catch { setNotice('Demo changes cannot be saved in this browser.') }
  }, [])

  const navigate = (view: Perspective, tab = sessionRef.current.patientTab) => {
    perspectiveRef.current = view
    setPerspectiveState(view)
    const path = view === 'landing' ? '/' : view === 'clinician' ? '/clinician' : '/patient/' + tab
    if (window.location.pathname !== path) window.history.pushState(null, '', path)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }
  const setPerspective = (view: Perspective) => navigate(view)
  const setPatientTab = (tab: PatientTab) => {
    commit(current => ({ ...current, patientTab: tab }))
    if (perspectiveRef.current === 'patient') navigate('patient', tab)
  }
  const setSelectedPatientId = (id: PatientId) => {
    if (!isPatientId(id)) return
    voice.stopSpeech()
    generation.current++
    pendingReplies.current = 0
    setTypingPatient(null)
    setActiveCitation(null)
    setActiveHandoffModal(null)
    setActiveInstructionToEdit(null)
    commit(current => ({ ...current, selectedPatientId: id }))
  }

  useEffect(() => {
    const pop = () => {
      const next = route()
      perspectiveRef.current = next.perspective
      setPerspectiveState(next.perspective)
      if (next.tab) commit(current => ({ ...current, patientTab: next.tab! }))
    }
    const sync = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY || !event.newValue) return
      try {
        const incoming = restoreSession(JSON.parse(event.newValue))
        if (incoming.updatedAt <= sessionRef.current.updatedAt) return
        // Business data syncs between tabs; each tab keeps its own patient/view.
        const next = { ...incoming, selectedPatientId: sessionRef.current.selectedPatientId, patientTab: sessionRef.current.patientTab }
        sessionRef.current = next
        setSession(next)
      } catch { /* Ignore malformed external storage events. */ }
    }
    window.addEventListener('popstate', pop)
    window.addEventListener('storage', sync)
    return () => { window.removeEventListener('popstate', pop); window.removeEventListener('storage', sync) }
  }, [commit])

  useEffect(() => {
    document.body.classList.toggle('large-text-mode', session.largeTextMode)
    document.documentElement.classList.toggle('large-text-mode', session.largeTextMode)
    document.documentElement.lang = session.language
  }, [session.largeTextMode, session.language])

  const append = (current: DemoSession, message: ChatMessage): DemoSession => ({
    ...current, chatHistories: { ...current.chatHistories, [message.patientId]: [...(current.chatHistories[message.patientId] || []), message] }
  })
  const timeline = (current: DemoSession, event: Omit<TimelineEvent, 'id' | 'timestamp'>): DemoSession => ({
    ...current, timelineEvents: [{ ...event, id: newId('tl'), timestamp: current.demoTimestamp }, ...current.timelineEvents]
  })
  const makeRequest = (current: DemoSession, handoff: HandoffSummary, notes?: string): ClinicianRequest => ({
    id: newId('req'), patientId: handoff.patientId, patientName: handoff.patientName,
    createdAt: current.demoTimestamp, updatedAt: current.demoTimestamp,
    urgency: handoff.urgency || 'routine-review',
    ...requestDelivery(handoff.urgency || 'routine-review', current.coverageSettings, clockTime(current.demoTimestamp)),
    originalPatientMessage: handoff.originalPatientMessage || handoff.reportedConcern,
    patientConcern: handoff.reportedConcern, onset: handoff.onsetAndTimeline,
    patientNotes: notes, summary: { ...handoff, patientEditsNote: notes },
    sources: handoff.sources || []
  })

  const sendMessage = async (text: string, targetId?: PatientId) => {
    const query = text.trim()
    if (!query) return
    const snapshot = sessionRef.current
    const patientId = targetId || snapshot.selectedPatientId
    const patient = snapshot.patients[patientId]
    if (!patient) return
    const time = clockTime(snapshot.demoTimestamp)
    let response = processPatientQuery(patient, query, time)
    const token = response.pathway === 'emergency' ? ++generation.current : generation.current
    commit(current => append(current, { id: newId('msg'), patientId, sender: 'patient', timestamp: time, text: query }))
    voice.stopSpeech()
    let engineUsed: ChatMessage['engineUsed'] = response.pathway === 'emergency' ? 'emergency-bypass' : 'local-fallback'
    let groqModel: string | undefined
    // Emergency routing runs BEFORE any simulated loading or animation.
    if (response.pathway !== 'emergency') {
      pendingReplies.current++
      setTypingPatient(patientId)
      if (response.pathway === 'care-plan-explanation') {
        try {
          const api = await fetch('/api/chat', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query, patientId, currentTime: time }),
            signal: AbortSignal.timeout(7000)
          })
          if (!api.ok) {
            const failure = await api.json().catch(() => ({})) as { code?: string }
            setGroqIssue(failure.code || `HTTP_${api.status}`)
            throw new Error('Groq unavailable')
          }
          const data = await api.json() as { engineUsed?: string; groqModel?: string; highlight?: string }
          if (data.engineUsed === 'groq' && typeof data.highlight === 'string' &&
            response.citations.some(citation => citation.fullText?.includes(data.highlight!)) && response.responseText.includes(data.highlight)) {
            response = { ...response, responseText: 'Relevant passage selected by Groq:\n“' + data.highlight + '”\n\n' + response.responseText }
            engineUsed = 'groq'; groqModel = data.groqModel
            setGroqIssue('')
            setGroqConnectionStatus('connected')
          } else { setGroqIssue('SOURCE_MISMATCH'); setGroqConnectionStatus('fallback') }
        } catch { setGroqConnectionStatus('fallback') }
      } else await new Promise(resolve => window.setTimeout(resolve, 180))
      if (token !== generation.current || sessionRef.current.selectedPatientId !== patientId) return
    } else {
      pendingReplies.current = 0
      setTypingPatient(null)
      setTourActive(false)
      setDemoControlsOpen(false)
      setActiveHandoffModal(null)
      setActiveCitation(null)
    }
    const responseId = newId('msg')
    commit(current => {
      let next = current
      let requestId: string | undefined
      if (response.handoffSummary && (response.pathway === 'time-sensitive' || response.pathway === 'emergency')) {
        const created = upsertRequest(next.requests, makeRequest(next, response.handoffSummary))
        next = { ...next, requests: created.requests }
        requestId = created.request.id
      }
      next = append(next, {
        id: responseId, patientId, sender: 'avela', timestamp: time, engineUsed, groqModel,
        text: response.responseText, pathway: response.pathway,
        citations: response.citations, informationUsed: response.informationUsed,
        handoffSummary: response.handoffSummary, associatedRequestId: requestId,
        suggestedFollowUps: response.suggestedFollowUps
      })
      next = { ...next, activityEvents: [{
        id: newId('act'), timestamp: time, patientId, type: response.pathway,
        summary: query.slice(0, 90), status: response.pathway === 'emergency' ? 'Emergency guidance shown' : response.pathway === 'care-plan-explanation' ? 'Source explained' : 'Human review pathway'
      }, ...next.activityEvents].slice(0, 200) }
      return timeline(next, { patientId, category: response.pathway === 'care-plan-explanation' ? 'conversation' : 'review-request',
        title: response.pathway === 'emergency' ? 'Emergency guidance shown — demo only' : response.pathway === 'time-sensitive' ? 'Time-sensitive demo request recorded' : 'Patient question and AVELA response',
        description: query, pathway: response.pathway })
    })
    if (sessionRef.current.selectedPatientId === patientId && perspectiveRef.current === 'patient') voice.speakMessage(responseId, response.responseText)
    if (token === generation.current && response.pathway !== 'emergency') {
      pendingReplies.current = Math.max(0, pendingReplies.current - 1)
      if (!pendingReplies.current) setTypingPatient(null)
    }
  }

  const openChat = (id?: PatientId, query?: string) => {
    const targetId = id || sessionRef.current.selectedPatientId
    setSelectedPatientId(targetId)
    commit(current => ({ ...current, patientTab: 'chat' }))
    navigate('patient', 'chat')
    if (query) void sendMessage(query, targetId)
  }

  const submitHandoffRequest = (handoff: HandoffSummary, notes?: string): string | null => {
    if (!isPatientId(handoff.patientId) || !handoff.reportedConcern.trim()) return null
    let result: string | null = null
    commit(current => {
      const update = upsertRequest(current.requests, makeRequest(current, handoff, notes))
      result = update.request.id
      let next = { ...current, requests: update.requests }
      if (!update.added) return next
      next = timeline(next, { patientId: handoff.patientId, category: 'review-request', title: 'Care-team request recorded in demo', description: handoff.reportedConcern })
      return append(next, { id: newId('msg'), patientId: handoff.patientId, sender: 'avela', timestamp: clockTime(current.demoTimestamp),
        text: update.request.deliveryNotice || 'Request recorded in the demo inbox.',
        pathway: handoff.urgency === 'time-sensitive' ? 'time-sensitive' : 'clinical-review', associatedRequestId: update.request.id })
    })
    setActiveHandoffModal(null)
    return result
  }

  const sendDirectMessage = (text: string): string | null => {
    const snapshot = sessionRef.current
    const patient = snapshot.patients[snapshot.selectedPatientId]
    const query = text.trim()
    if (!query) return null
    const summary = generateHandoffSummary(patient, query, query, 'Direct patient message. No AI answer was generated.')
    summary.originalPatientMessage = query
    summary.urgency = 'routine-review'
    summary.sources = []
    commit(current => append(current, { id: newId('msg'), patientId: patient.id, sender: 'patient', timestamp: clockTime(current.demoTimestamp), text: query }))
    return submitHandoffRequest(summary)
  }

  const acknowledgeRequest = (id: string, name?: string) => {
    commit(current => {
      const request = current.requests.find(request => request.id === id)
      if (!request || ['acknowledged', 'answered', 'closed'].includes(request.status)) return current
      const clinician = name || current.patients[request.patientId as PatientId].careTeam[0]?.name || 'Demo clinician'
      const time = clockTime(current.demoTimestamp)
      const next = { ...current, requests: current.requests.map(item => item.id === id ? { ...item, status: 'acknowledged' as const, acknowledgedAt: time, acknowledgedBy: clinician, updatedAt: current.demoTimestamp } : item) }
      return append(next, { id: newId('msg'), patientId: request.patientId, sender: 'clinician', timestamp: time, text: 'Acknowledged by ' + clinician + ' in the demo. No real clinician has been contacted.', associatedRequestId: id })
    })
  }
  const replyToRequest = (id: string, text: string, name?: string) => {
    if (!text.trim()) return
    commit(current => {
      const request = current.requests.find(request => request.id === id)
      if (!request || request.status === 'closed') return current
      const clinician = name || current.patients[request.patientId as PatientId].careTeam[0]?.name || 'Demo clinician'
      const time = clockTime(current.demoTimestamp)
      let next = { ...current, requests: current.requests.map(item => item.id === id ? { ...item, status: 'answered' as const, updatedAt: current.demoTimestamp,
        clinicianReplies: [...(item.clinicianReplies || []), { id: newId('reply'), clinicianName: clinician, timestamp: time, message: text.trim() }] } : item) }
      next = append(next, { id: newId('msg'), patientId: request.patientId, sender: 'clinician', timestamp: time, text: clinician + ': ' + text.trim(), associatedRequestId: id })
      return timeline(next, { patientId: request.patientId, category: 'clinician-reply', title: 'Demo reply from ' + clinician, description: text.trim() })
    })
  }
  const closeRequest = (id: string) => {
    commit(current => {
      const request = current.requests.find(item => item.id === id)
      if (!request || request.status === 'closed') return current
      const next = { ...current, requests: current.requests.map(item => item.id === id ? { ...item, status: 'closed' as const, closedAt: clockTime(current.demoTimestamp), updatedAt: current.demoTimestamp } : item) }
      return append(next, { id: newId('msg'), patientId: request.patientId, sender: 'clinician', timestamp: clockTime(current.demoTimestamp), text: 'This request was closed in the demo inbox.', associatedRequestId: id })
    })
  }
  const publishInstructionVersion = (id: string, title: string, content: string, passage: string) => {
    if (!title.trim() || !content.trim() || !passage.trim() || !content.includes(passage)) {
      setNotice('The citation passage must appear exactly in the complete instruction.'); return
    }
    commit(current => {
      for (const patientId of ['patient-priya', 'patient-marcus'] as const) {
        const patient = current.patients[patientId]
        const old = patient.instructions.find(inst => inst.id === id)
        if (!old) continue
        const instruction = { ...old, title: title.trim(), content: content.trim(), exactPassage: passage.trim(), version: old.version + 1,
          date: current.demoTimestamp.slice(0, 10), previousVersionContent: old.content }
        const next = { ...current, patients: { ...current.patients, [patientId]: { ...patient, instructions: patient.instructions.map(inst => inst.id === id ? instruction : inst) } } }
        return timeline(next, { patientId, category: 'care-plan-update', title: 'Care instruction updated to v' + instruction.version, description: title })
      }
      return current
    })
    setActiveInstructionToEdit(null)
  }
  const importRecord = (record: PatientRecord) => {
    commit(current => {
      const id = current.selectedPatientId, patient = current.patients[id]
      const next = { ...current, patients: { ...current.patients, [id]: { ...patient, records: [{ ...record, id: newId('record'), status: 'unverified' as const }, ...patient.records] } } }
      return timeline(next, { patientId: id, category: 'care-plan-update', title: 'Unverified sample note imported', description: record.title })
    })
  }
  const completePendingCheckIn = (notes: string) => {
    if (!notes.trim()) return
    commit(current => {
      const id = current.selectedPatientId, patient = current.patients[id]
      if (!patient.pendingCheckIn || patient.pendingCheckIn.status !== 'scheduled') return current
      const next = { ...current, patients: { ...current.patients, [id]: { ...patient, pendingCheckIn: { ...patient.pendingCheckIn, status: 'completed' as const } } } }
      return timeline(next, { patientId: id, category: 'follow-up', title: 'Patient submitted a demo check-in', description: notes.trim() })
    })
  }
  const clearChatHistory = () => {
    voice.stopSpeech()
    generation.current++
    pendingReplies.current = 0
    setTypingPatient(null)
    commit(current => ({ ...current, chatHistories: { ...current.chatHistories, [current.selectedPatientId]: [] } }))
  }
  const advanceDemoTime = (hours: number) => {
    if (!Number.isFinite(hours)) return
    commit(current => ({ ...current, demoTimestamp: new Date(Date.parse(current.demoTimestamp) + hours * 3600000).toISOString() }))
  }
  const updateCoverageSettings = (patch: Partial<CoverageSettings>) => {
    commit(current => ({ ...current, coverageSettings: { ...current.coverageSettings, ...patch } }))
  }
  const setLanguage = (language: Language) => commit(current => ({ ...current, language }))
  const setLargeTextMode = (largeTextMode: boolean) => commit(current => ({ ...current, largeTextMode }))
  const resetDemo = () => {
    voice.stopSpeech()
    generation.current++
    pendingReplies.current = 0
    setTypingPatient(null)
    commit(() => createInitialSession())
    setActiveCitation(null); setActiveHandoffModal(null); setActiveInstructionToEdit(null)
    setIsMorningDigestOpen(false); setIsCoverageModalOpen(false); setTourActive(false); setTourStep(1)
    navigate('landing')
  }
  const startTour = () => { setTourStep(1); setTourActive(true); openChat('patient-priya') }
  const nextTourStep = () => setTourStep(step => Math.min(4, step + 1))
  const endTour = () => { setTourActive(false); setTourStep(1) }
  const currentPatient = session.patients[session.selectedPatientId]
  const value: AvelaContextType = {
    ...voice, groqConnectionStatus, groqIssue,
    perspective, setPerspective, patientTab: session.patientTab, setPatientTab,
    selectedPatientId: session.selectedPatientId, setSelectedPatientId, patients: session.patients, currentPatient,
    messages: session.chatHistories[session.selectedPatientId] || [], isTyping: typingPatient === session.selectedPatientId,
    sendMessage, openChat, sendDirectMessage, clearChatHistory,
    activeHandoffModal, setActiveHandoffModal, submitHandoffRequest, requests: session.requests,
    acknowledgeRequest, replyToRequest, closeRequest,
    activeCitation, setActiveCitation, highlightedPassage, setHighlightedPassage,
    activeInstructionToEdit, setActiveInstructionToEdit, publishInstructionVersion,
    isMorningDigestOpen, setIsMorningDigestOpen, isCoverageModalOpen, setIsCoverageModalOpen,
    isOnboardingOpen, setIsOnboardingOpen, timelineEvents: session.timelineEvents, activityEvents: session.activityEvents,
    demoTime: clockTime(session.demoTimestamp), demoDate: clockDate(session.demoTimestamp),
    isQuietHours: isQuietTime(clockTime(session.demoTimestamp), session.coverageSettings), coverageSettings: session.coverageSettings,
    updateCoverageSettings, advanceDemoTime, language: session.language, setLanguage,
    t: TRANSLATIONS[session.language], largeTextMode: session.largeTextMode, setLargeTextMode,
    tourActive, tourStep, startTour, nextTourStep, endTour, importRecord, completePendingCheckIn, resetDemo,
    demoControlsOpen, setDemoControlsOpen, persistenceNotice
  }
  return <AvelaContext.Provider value={value}>{children}</AvelaContext.Provider>
}
export function useAvela() {
  const context = useContext(AvelaContext)
  if (!context) throw new Error('useAvela must be used within AvelaProvider')
  return context
}
