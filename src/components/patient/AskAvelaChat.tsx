import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { ArrowDown, Send, Mic, MicOff, RotateCcw, Users, AlertOctagon, Stethoscope, FileText, Edit3, Volume2, VolumeX, Pause, Play, Square } from 'lucide-react'
import { useAvela } from '../../context/AvelaContext'
import { PathwayBadge } from '../common/PathwayBadge'
import { EvidenceCard } from '../common/EvidenceCard'
import { EmergencyBanner } from '../common/EmergencyBanner'
import type { ChatMessage } from '../../types'

type Recognition = {
  lang: string; interimResults: boolean; maxAlternatives: number
  start(): void; stop(): void; abort(): void
  onstart: (() => void) | null; onend: (() => void) | null
  onerror: (() => void) | null
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null
}
function MessageCard({ message, onFollowUp }: { message: ChatMessage; onFollowUp: (text: string, message: ChatMessage) => void }) {
  const ctx = useAvela()
  const user = message.sender === 'patient'
  const clinician = message.sender === 'clinician'
  const urgent = message.pathway === 'emergency' || message.pathway === 'time-sensitive'
  const request = message.associatedRequestId ? ctx.requests.find(request => request.id === message.associatedRequestId) : null
  return <article id={'message-' + message.id} data-message-id={message.id} className={'chat-message-row ' + (user ? 'is-user' : '')}>
    <div data-pathway={message.pathway} className={'chat-message-card ' + (user ? 'is-user' : clinician ? 'is-clinician' : urgent ? 'needs-attention' : '')}>
      {!user && <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <span className="flex gap-2 items-center font-semibold">{clinician ? <Stethoscope size={18}/> : <span className="avela-avatar">A</span>}{clinician ? 'Demo clinician reply' : 'AVELA'}</span>
        {!clinician && message.engineUsed === 'groq' && <span className="text-xs text-[#376c60]">Groq-selected excerpt · sample plan</span>}
        {!clinician && ctx.speechSynthesisSupported && <div className="flex gap-1 items-center">
          {ctx.isSpeaking && ctx.activeSpeechMessageId === message.id ? <>
            <button className="icon-button" aria-label={ctx.isPaused ? 'Resume spoken reply' : 'Pause spoken reply'} onClick={ctx.isPaused ? ctx.resumeSpeech : ctx.pauseSpeech}>{ctx.isPaused ? <Play size={16}/> : <Pause size={16}/>}</button>
            <button className="icon-button" aria-label="Stop spoken reply" onClick={ctx.stopSpeech}><Square size={15}/></button>
          </> : <button className="icon-button" aria-label="Replay spoken reply" title="Replay spoken reply" onClick={() => ctx.speakMessage(message.id, message.text, true)}><Volume2 size={17}/></button>}
        </div>}
        {message.pathway && <PathwayBadge pathway={message.pathway}/>}
      </div>}
      {ctx.autoplayBlocked && ctx.activeSpeechMessageId === message.id && <button className="secondary-button mb-3" onClick={() => ctx.speakMessage(message.id, message.text, true)}>Tap to play this reply</button>}
      {message.pathway === 'emergency' && <EmergencyBanner/>}
      {!user && !clinician && ctx.language !== 'en' && <p className="language-notice" lang={ctx.language}>{ctx.language === 'te' ? 'ఈ నమూనా సమాధానం, అసలు వైద్య సూచనలు ఆంగ్లంలో చూపబడుతున్నాయి.' : 'यह नमूना उत्तर और मूल देखभाल निर्देश अंग्रेज़ी में दिखाए गए हैं।'}</p>}
      <div className="chat-message-text" lang={user ? undefined : 'en'}>{message.text}</div>
      {!user && <EvidenceCard citations={message.citations} informationUsed={message.informationUsed}/>}
      {message.handoffSummary && message.pathway !== 'emergency' && <div className={'handoff-card ' + (message.pathway === 'time-sensitive' ? 'is-urgent' : '')}>
        <div><strong>{request ? 'On-call request recorded in demo' : 'A care-team review can help'}</strong><p>{request ? request.deliveryNotice : 'Review your words and the attached context before sending.'}</p></div>
        <button className="primary-button" onClick={() => ctx.setActiveHandoffModal(message.handoffSummary!)}><Edit3 size={15}/>{request ? 'Review request' : 'Review & send'}</button>
      </div>}
      {message.suggestedFollowUps?.length ? <div className="flex flex-wrap gap-2 pt-3">{message.suggestedFollowUps.map(text => <button className="suggestion-chip" key={text} onClick={() => onFollowUp(text, message)}>{text}</button>)}</div> : null}
      <p className={'message-time ' + (user ? 'text-white/75' : 'text-[#596963]')}>{message.timestamp}</p>
    </div>
  </article>
}
export const AskAvelaChat = () => {
  const ctx = useAvela()
  const { stopSpeech } = ctx
  const [input, setInput] = useState('')
  const [recording, setRecording] = useState(false)
  const [voiceNotice, setVoiceNotice] = useState('')
  const [hasUnread, setHasUnread] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const followRef = useRef(true)
  const recognitionRef = useRef<Recognition | null>(null)
  const last = ctx.messages.at(-1)
  const scrollToLatest = useCallback((force = false) => {
    const port = scrollRef.current
    if (!port || !last) return
    const target = document.getElementById('message-' + last.id)
    if (force || followRef.current || last.pathway === 'emergency') {
      port.scrollTo({ top: target ? target.offsetTop - 12 : port.scrollHeight, behavior: 'instant' })
      setHasUnread(false)
    } else setHasUnread(true)
  }, [last])
  useLayoutEffect(() => { scrollToLatest() }, [scrollToLatest])
  useEffect(() => () => {
    const recognition = recognitionRef.current
    if (recognition) { recognition.onstart = null; recognition.onend = null; recognition.onresult = null; recognition.onerror = null; recognition.abort() }
  }, [])
  useEffect(() => () => { stopSpeech() }, [stopSpeech])
  const submit = (text: string) => {
    if (!text.trim()) return
    followRef.current = true
    setInput('')
    void ctx.sendMessage(text.trim())
  }
  const followUp = (text: string, message: ChatMessage) => {
    if (/contact care team|care team directly/i.test(text)) { ctx.setPatientTab('careteam'); return }
    if (/view full|view.*instructions|browse.*care plan/i.test(text)) {
      if (message.citations?.[0]) ctx.setActiveCitation(message.citations[0])
      else ctx.setPatientTab('careplan')
      return
    }
    if (/review|send|on-call/i.test(text) && message.handoffSummary) { ctx.setActiveHandoffModal(message.handoffSummary); return }
    submit(text)
  }
  const voice = () => {
    if (recording) { recognitionRef.current?.stop(); return }
    const speechWindow = window as Window & { SpeechRecognition?: new () => Recognition; webkitSpeechRecognition?: new () => Recognition }
    const Constructor = speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition
    if (!Constructor) { setVoiceNotice('Voice input is unavailable in this browser. You can type your question.'); return }
    try {
      const recognition = new Constructor()
      recognitionRef.current = recognition
      recognition.lang = { en: 'en-IN', hi: 'hi-IN', te: 'te-IN' }[ctx.language]
      recognition.interimResults = false
      recognition.maxAlternatives = 1
      recognition.onstart = () => { setRecording(true); setVoiceNotice('Listening. Review the text before sending.') }
      recognition.onend = () => setRecording(false)
      recognition.onerror = () => { setRecording(false); setVoiceNotice('Microphone access or transcription is unavailable. Please type instead.') }
      recognition.onresult = event => { setInput(event.results[0][0].transcript); setRecording(false); setVoiceNotice('Transcript ready. Review it before sending.') }
      recognition.start()
    } catch { setRecording(false); setVoiceNotice('Voice input could not start. Please type instead.') }
  }
  return <section className="chat-workspace" aria-label={'Care-plan conversation for ' + ctx.currentPatient.name}>
    <div className="chat-header">
      <div className="min-w-0"><p className="eyebrow">Your care, in context</p><h1 className="text-xl sm:text-2xl font-editorial font-semibold">Ask AVELA</h1><p className="text-sm text-[#596963] mt-1">{ctx.currentPatient.name} · fictional care records</p></div>
      <div className="flex flex-wrap items-center gap-2 justify-end">
        {ctx.speechSynthesisSupported && <button className="secondary-button chat-voice-button" onClick={() => ctx.setVoiceEnabled(!ctx.voiceEnabled)} aria-label={ctx.voiceEnabled ? 'Turn spoken replies off' : 'Turn spoken replies on'} aria-pressed={ctx.voiceEnabled} title="Automatic spoken replies">{ctx.voiceEnabled ? <Volume2 size={16}/> : <VolumeX size={16}/>} <span className="chat-voice-label">{ctx.voiceEnabled ? 'Voice on' : 'Voice off'}</span></button>}
        <button className="secondary-button" aria-label="Contact care team" onClick={() => ctx.setPatientTab('careteam')}><Users size={16}/> Care team</button>
        <button className="icon-button" aria-label="Clear chat" title="Clear this conversation" onClick={ctx.clearChatHistory}><RotateCcw size={17}/></button>
      </div>
    </div>
    <div className="chat-coverage">
      <span>{ctx.isQuietHours ? 'Routine quiet hours until ' + ctx.coverageSettings.quietHoursEnd : 'Routine demo inbox available'} · {ctx.demoTime} IST</span>
      <button className="text-sm font-semibold underline underline-offset-4" onClick={() => {followRef.current = true; ctx.openChat('patient-priya', 'I have severe chest pain and trouble breathing right now.')}}><AlertOctagon size={14} className="inline mr-1"/>Emergency demo</button>
    </div>
    <p className="px-4 py-2 text-xs text-[#596963]" role="status">{ctx.groqConnectionStatus === 'connected' ? 'Groq connected to highlight sample instructions.' : ctx.groqConnectionStatus === 'fallback' ? `Groq unavailable${ctx.groqIssue ? ` (${ctx.groqIssue})` : ''}; using the local demo.` : 'Groq-assisted demo.'} Fictional data only. Some questions and sample instructions are sent to Groq; don’t enter real medical details.</p>
    <div ref={scrollRef} className="chat-scroll" role="log" aria-label="Conversation" aria-live="polite" aria-relevant="additions" onScroll={() => {
      const port = scrollRef.current!
      followRef.current = port.scrollHeight - port.scrollTop - port.clientHeight < 100
      if (followRef.current) setHasUnread(false)
    }}>
      {!ctx.messages.length && <div className="chat-empty"><FileText size={30}/><h2 className="font-editorial text-2xl">Start with your care plan.</h2><p>Ask about a recorded instruction, or contact your care team directly.</p><button className="suggestion-chip" onClick={() => submit('What are my caffeine instructions?')}>Explain my caffeine instructions</button></div>}
      {ctx.messages.map(message => <MessageCard key={message.id} message={message} onFollowUp={followUp}/>)}
      {ctx.isTyping && <div className="reply-loading" role="status" data-testid="reply-loading"><span className="loading-dot"/><span>Preparing a record-backed reply…</span></div>}
    </div>
    {hasUnread && <button className="jump-latest" onClick={() => {followRef.current = true; scrollToLatest(true)}}><ArrowDown size={16}/> Jump to latest</button>}
    <div className="chat-composer">
      <form onSubmit={event => {event.preventDefault(); submit(input)}}>
        <label htmlFor="chat-composer" className="sr-only">Your care-plan question</label>
        <textarea id="chat-composer" rows={2} maxLength={1000} value={input} onChange={event => setInput(event.target.value)} placeholder={recording ? 'Listening…' : ctx.t.composerPlaceholder} onKeyDown={event => {
          if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {event.preventDefault(); submit(input)}
        }}/>
        <div className="flex items-center justify-between gap-3">
          <button type="button" className="icon-button" onClick={voice} aria-label={recording ? 'Stop voice input' : 'Start voice input'}>{recording ? <MicOff size={18}/> : <Mic size={18}/>}</button>
          <span className="hidden sm:block text-xs text-[#596963]">Enter to send · Shift + Enter for a new line</span>
          <button type="submit" className="primary-button" disabled={!input.trim()}><span>{ctx.t.composerSend}</span><Send size={17}/></button>
        </div>
      </form>
      {voiceNotice && <p role="status" className="text-sm text-[#596963] mt-2">{voiceNotice}</p>}
      <p className="prototype-note">Fictional records · Saved on this browser · No real clinical monitoring</p>
    </div>
  </section>
}
