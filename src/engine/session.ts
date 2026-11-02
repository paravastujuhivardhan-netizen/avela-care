import type { PatientProfile, ChatMessage, ClinicianRequest, TimelineEvent, ActivityMetricEvent, CoverageSettings, Language } from '../types'
import { INITIAL_PATIENTS } from '../data/samplePatients'
import { INITIAL_HISTORIES, INITIAL_REQUESTS, INITIAL_TIMELINE, INITIAL_ACTIVITY, INITIAL_COVERAGE } from './initialState'

export type PatientId = PatientProfile['id']
export type PatientTab = 'home' | 'chat' | 'careplan' | 'records' | 'careteam' | 'timeline'
export const STORAGE_KEY = 'avela_prototype_state_v2'
export interface DemoSession {
  schemaVersion: 2
  updatedAt: number
  patients: Record<PatientId, PatientProfile>
  chatHistories: Record<string, ChatMessage[]>
  requests: ClinicianRequest[]
  timelineEvents: TimelineEvent[]
  activityEvents: ActivityMetricEvent[]
  coverageSettings: CoverageSettings
  demoTimestamp: string
  selectedPatientId: PatientId
  patientTab: PatientTab
  language: Language
  largeTextMode: boolean
}
export interface SessionStorage { getItem(key: string): string | null; setItem(key: string, value: string): void }
export function isPatientId(value: unknown): value is PatientId {
  return value === 'patient-priya' || value === 'patient-marcus'
}
export function createInitialSession(): DemoSession {
  const times: Record<string, string> = {
    'tl-1': '2026-10-14T11:30:00+05:30',
    'tl-2': '2026-11-01T20:15:00+05:30',
    'tl-3': '2026-10-24T16:00:00+05:30'
  }
  return structuredClone({
    schemaVersion: 2, updatedAt: 0, patients: INITIAL_PATIENTS,
    chatHistories: INITIAL_HISTORIES, requests: INITIAL_REQUESTS,
    timelineEvents: INITIAL_TIMELINE.map(event => ({ ...event, timestamp: times[event.id] || event.timestamp })),
    activityEvents: INITIAL_ACTIVITY, coverageSettings: INITIAL_COVERAGE,
    demoTimestamp: '2026-11-01T22:00:00+05:30', selectedPatientId: 'patient-priya',
    patientTab: 'home', language: 'en', largeTextMode: false
  })
}
const tabs = ['home', 'chat', 'careplan', 'records', 'careteam', 'timeline']
export function restoreSession(raw: unknown): DemoSession {
  const initial = createInitialSession()
  if (!raw || typeof raw !== 'object') return initial
  const data = raw as Partial<DemoSession>
  const patients = { ...initial.patients }
  for (const id of ['patient-priya', 'patient-marcus'] as const) {
    const candidate = data.patients?.[id]
    if (candidate?.id === id && typeof candidate.name === 'string' &&
      [candidate.instructions, candidate.records, candidate.medications, candidate.careTeam, candidate.conditions, candidate.allergies].every(Array.isArray)) {
      patients[id] = candidate
    }
  }
  const histories = { ...initial.chatHistories }
  for (const id of ['patient-priya', 'patient-marcus'] as const) {
    if (Array.isArray(data.chatHistories?.[id])) {
      histories[id] = data.chatHistories[id].filter(message => message?.patientId === id && typeof message.text === 'string')
    }
  }
  return {
    ...initial, patients, chatHistories: histories,
    requests: Array.isArray(data.requests) ? data.requests.filter(request => isPatientId(request?.patientId) && request.summary?.patientId === request.patientId && typeof request.id === 'string') : initial.requests,
    timelineEvents: Array.isArray(data.timelineEvents) ? data.timelineEvents.filter(event => isPatientId(event?.patientId)) : initial.timelineEvents,
    activityEvents: Array.isArray(data.activityEvents) ? data.activityEvents.filter(event => isPatientId(event?.patientId)).slice(0, 200) : initial.activityEvents,
    coverageSettings: data.coverageSettings ? { ...initial.coverageSettings, ...data.coverageSettings } : initial.coverageSettings,
    demoTimestamp: data.demoTimestamp && Number.isFinite(Date.parse(data.demoTimestamp)) ? data.demoTimestamp : initial.demoTimestamp,
    selectedPatientId: isPatientId(data.selectedPatientId) ? data.selectedPatientId : initial.selectedPatientId,
    patientTab: tabs.includes(data.patientTab || '') ? data.patientTab! : initial.patientTab,
    language: ['en', 'hi', 'te'].includes(data.language || '') ? data.language! : 'en',
    largeTextMode: data.largeTextMode === true,
    updatedAt: typeof data.updatedAt === 'number' ? data.updatedAt : 0
  }
}
export function loadSession(storage: Pick<SessionStorage, 'getItem'>): DemoSession {
  try {
    const raw = storage.getItem(STORAGE_KEY) || storage.getItem('avela_prototype_state_v1')
    return raw ? restoreSession(JSON.parse(raw)) : createInitialSession()
  } catch { return createInitialSession() }
}
export function persistSession(storage: Pick<SessionStorage, 'setItem'>, session: DemoSession): boolean {
  try { storage.setItem(STORAGE_KEY, JSON.stringify(session)); return true } catch { return false }
}
export function demoTime(timestamp: string): string {
  return new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(new Date(timestamp))
}
export function demoDate(timestamp: string): string {
  return new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kolkata', day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(timestamp))
}
export function isQuietTime(time: string, settings: CoverageSettings): boolean {
  if (!settings.quietHoursEnabled) return false
  const minutes = (s: string) => { const [h, m] = s.split(':').map(Number); return h * 60 + m }
  const now = minutes(time), start = minutes(settings.quietHoursStart), end = minutes(settings.quietHoursEnd)
  if (![now, start, end].every(Number.isFinite)) return false
  return start > end ? now >= start || now < end : start < end ? now >= start && now < end : false
}
export function requestDelivery(urgency: ClinicianRequest['urgency'], settings: CoverageSettings, time: string) {
  if (urgency !== 'routine-review') {
    return settings.onCallTeamActive
      ? { status: 'sent-in-demo' as const, deliveryRoute: settings.onCallRouteName, deliveryNotice: 'Recorded in the simulated on-call inbox. No real clinician has been notified.' }
      : { status: 'draft' as const, deliveryRoute: 'On-call coverage unavailable', deliveryNotice: 'This demo cannot contact an on-call clinician. Seek appropriate urgent care; do not wait for an inbox reply in an emergency.' }
  }
  return isQuietTime(time, settings)
    ? { status: 'queued' as const, deliveryRoute: 'Routine review queue', deliveryNotice: 'Recorded in the demo inbox for review when routine coverage resumes. No real notification was sent.' }
    : { status: 'sent-in-demo' as const, deliveryRoute: 'Routine review inbox', deliveryNotice: 'Recorded in the simulated care-team inbox. No real notification was sent.' }
}
export function requestStatusLabel(request: ClinicianRequest): string {
  if (request.urgency !== 'routine-review' && request.status === 'draft') return 'Coverage unavailable — action needed'
  return ({ draft: 'Draft', queued: 'Queued for routine review', 'sent-in-demo': request.urgency === 'routine-review' ? 'Sent in demo' : 'Sent to on-call demo inbox', acknowledged: 'Acknowledged in demo', answered: 'Reply received', closed: 'Closed in demo' })[request.status]
}
export function upsertRequest(requests: ClinicianRequest[], next: ClinicianRequest): { requests: ClinicianRequest[]; request: ClinicianRequest; added: boolean } {
  const normalize = (s: string) => s.trim().toLowerCase().replace(/\s+/g, ' ')
  const existing = requests.find(request => request.patientId === next.patientId && request.status !== 'closed' && normalize(request.originalPatientMessage) === normalize(next.originalPatientMessage))
  if (!existing) return { requests: [next, ...requests], request: next, added: true }
  const priority = { 'routine-review': 0, 'time-sensitive': 1, 'emergency-audit': 2 }
  const reroute = priority[next.urgency] > priority[existing.urgency] ||
    (existing.status === 'draft' && next.urgency !== 'routine-review' && next.status === 'sent-in-demo')
  const delivery = reroute ? { urgency: next.urgency, status: next.status, deliveryRoute: next.deliveryRoute, deliveryNotice: next.deliveryNotice } : {}
  const merged = { ...existing, ...delivery, patientConcern: next.patientConcern, patientNotes: next.patientNotes || existing.patientNotes, summary: { ...next.summary, originalPatientMessage: existing.originalPatientMessage }, sources: next.sources, updatedAt: next.updatedAt }
  return { requests: requests.map(request => request.id === existing.id ? merged : request), request: merged, added: false }
}
