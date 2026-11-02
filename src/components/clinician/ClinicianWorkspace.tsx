import { useState } from 'react'
import { Stethoscope, Inbox, Sun, Moon, FileEdit, CheckCircle2, ArrowLeft, Send, FlaskConical, SlidersHorizontal } from 'lucide-react'
import { useAvela } from '../../context/AvelaContext'
import type { ClinicianRequest } from '../../types'
import { requestStatusLabel } from '../../engine/session'
import { AvelaLogo } from '../common/AvelaLogo'
import { ActivityVisualization } from './ActivityVisualization'
import { EvidenceCard } from '../common/EvidenceCard'

const urgency: Record<ClinicianRequest['urgency'], {label: string; style: string; rank: number}> = {
  'emergency-audit': {label: 'Emergency · demo audit', style: 'bg-[#FEE2E2] text-[#991B1B]', rank: 0},
  'time-sensitive': {label: 'Time-sensitive', style: 'bg-[#FFEDD5] text-[#9A3412]', rank: 1},
  'routine-review': {label: 'Routine review', style: 'bg-[#FEF3C7] text-[#92400E]', rank: 2},
}
export const ClinicianWorkspace = () => {
  const ctx = useAvela()
  const [toolsOpen, setToolsOpen] = useState(false)
  const [filter, setFilter] = useState<'all' | ClinicianRequest['urgency']>('all')
  const [selected, setSelected] = useState('')
  const [detailOpen, setDetailOpen] = useState(false)
  const [reply, setReply] = useState('')
  const [feedback, setFeedback] = useState('')
  const filtered = ctx.requests.filter(request => filter === 'all' || request.urgency === filter).toSorted((a, b) =>
    Number(a.status === 'closed') - Number(b.status === 'closed') || urgency[a.urgency].rank - urgency[b.urgency].rank || b.createdAt.localeCompare(a.createdAt))
  const active = filtered.find(request => request.id === selected) || filtered[0]
  const patient = active ? ctx.patients[active.patientId as keyof typeof ctx.patients] : ctx.currentPatient
  const clinician = patient?.careTeam[0]?.name || 'Demo clinician'
  const select = (id: string) => {setSelected(id); setDetailOpen(true); setReply(''); setFeedback('')}
  return <div className="min-h-screen">
    <header className="bg-white border-b border-[#DDE5DF]"><div className="clinician-toolbar">
      <div className="flex items-center gap-3"><AvelaLogo size="sm" showTagline={false} onClick={() => ctx.setPerspective('landing')}/><span className="text-sm font-semibold flex items-center gap-2"><Stethoscope size={18}/> Clinician workspace</span></div>
      <div className="clinician-header-actions flex flex-wrap items-center gap-2">
        <button className="secondary-button clinician-tools-toggle" aria-expanded={toolsOpen} onClick={() => setToolsOpen(!toolsOpen)}><SlidersHorizontal size={16}/> Workspace tools</button>
        <div className={'clinician-actions ' + (toolsOpen ? 'is-open' : '')}>
        <button className="secondary-button" aria-label="Morning digest" onClick={() => ctx.setIsMorningDigestOpen(true)}><Sun size={16}/> Digest</button>
        <button className="secondary-button" aria-label="Coverage & quiet hours" onClick={() => ctx.setIsCoverageModalOpen(true)}><Moon size={16}/> Coverage</button>
        <button className="secondary-button" aria-label="Care plan editor" onClick={() => {
          const target = patient || ctx.currentPatient
          ctx.setSelectedPatientId(target.id)
          const instruction = target.instructions.find(item => item.status === 'verified')
          if (instruction) ctx.setActiveInstructionToEdit(instruction)
        }}><FileEdit size={16}/> Care plans</button>
        <button className="secondary-button" onClick={() => ctx.setDemoControlsOpen(true)}><FlaskConical size={16}/> Demo mode</button>
        </div>
        <button className="primary-button" onClick={() => ctx.openChat(patient?.id)}>Patient app</button>
      </div>
    </div></header>
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div><p className="eyebrow">Clarity before interruption</p><h1 className="font-editorial text-3xl mt-1">Your triage inbox</h1></div>
        <p className="text-sm text-[#596963]">{ctx.demoTime} IST · {ctx.isQuietHours ? 'Routine quiet hours until ' + ctx.coverageSettings.quietHoursEnd : 'Routine demo inbox available'}</p>
      </div>
      <p className="text-sm text-[#596963]">Fictional cases and simulated delivery. Emergency assistance remains independent of this inbox.</p>
      <div className={'clinician-inbox ' + (detailOpen ? 'show-detail' : '')}>
        <aside className="clinician-list" aria-label="Triage requests">
          <div className="p-4 border-b border-[#DDE5DF] space-y-3"><h2 className="font-semibold flex items-center gap-2"><Inbox size={18}/> Requests ({filtered.length})</h2>
            <div className="flex flex-wrap gap-1.5">{(['all', 'routine-review', 'time-sensitive', 'emergency-audit'] as const).map(value => <button key={value} className={'filter-chip ' + (filter === value ? 'is-active' : '')} aria-pressed={filter === value} onClick={() => {setFilter(value); setSelected(''); setReply(''); setFeedback(''); setDetailOpen(false)}}>{value === 'all' ? 'All' : value === 'routine-review' ? 'Routine' : value === 'time-sensitive' ? 'Time-sensitive' : 'Emergency'}</button>)}</div>
          </div>
          {filtered.length ? filtered.map(request => <button className="request-list-button" key={request.id} aria-current={active?.id === request.id ? 'true' : undefined} onClick={() => select(request.id)}>
            <div className="flex flex-wrap items-center justify-between gap-2"><span className="font-semibold">{request.patientName}</span><span className={'text-xs font-semibold px-2 py-1 rounded-full ' + urgency[request.urgency].style}>{urgency[request.urgency].label}</span></div>
            <p className="line-clamp-3">“{request.patientConcern}”</p><span className="text-xs text-[#596963]">{requestStatusLabel(request)}</span>
          </button>) : <div className="p-6 space-y-2"><h3 className="font-editorial text-xl">A clear inbox.</h3><p className="text-sm text-[#596963]">No requests match this filter. Try another filter or run a demo scenario.</p></div>}
        </aside>
        <section className="clinician-detail space-y-5" aria-label="Selected request">
          <button className="secondary-button mobile-inbox-back" onClick={() => setDetailOpen(false)}><ArrowLeft size={16}/> Back to inbox</button>
          {!active ? <div className="py-12 text-center"><Inbox size={30} className="mx-auto mb-3 text-[#596963]"/><h2 className="font-editorial text-2xl">Nothing needs review here.</h2><p className="text-sm text-[#596963] mt-2">Requests appear here when sent or when a demo urgent route is triggered.</p></div> : <>
            <div className="space-y-3 border-b border-[#DDE5DF] pb-5">
              <span className={'inline-flex text-xs font-semibold px-3 py-1 rounded-full ' + urgency[active.urgency].style}>{urgency[active.urgency].label}</span>
              <h2 className="font-editorial text-2xl">{active.patientName}, {active.summary.patientAge}</h2>
              <p className="text-xs text-[#596963] break-all">Request ID: {active.id}</p>
              <p className="text-sm"><strong>{requestStatusLabel(active)}</strong> · {active.deliveryRoute || 'Seeded demo inbox'}</p>
              {active.deliveryNotice && <p className="text-sm text-[#596963]"><strong>Original delivery:</strong> {active.deliveryNotice}</p>}
              <div className="flex flex-wrap gap-2">
                {(['queued', 'sent-in-demo'] as string[]).includes(active.status) && <button className="primary-button" onClick={() => {ctx.acknowledgeRequest(active.id, clinician); setFeedback('Acknowledgment recorded and added to the patient’s conversation.')}}><CheckCircle2 size={16}/> Acknowledge request</button>}
                {active.status !== 'closed' && <button className="secondary-button" onClick={() => {ctx.closeRequest(active.id); setFeedback('Request closed in the demo. The patient can see this status.')}}>Resolve & close</button>}
              </div>
              {feedback && <p role="status" className="text-sm bg-[#E8F0E9] rounded-xl p-3">{feedback}</p>}
            </div>
            <div className="grid lg:grid-cols-2 gap-4">
              <article className="clinical-card !bg-[#FFFBF7] !border-[#F4D8CA]"><h3>Patient’s original words</h3><p>“{active.originalPatientMessage}”</p>{active.patientConcern !== active.originalPatientMessage && <p className="mt-3"><strong>Edited concern:</strong> {active.patientConcern}</p>}{active.patientNotes && <p className="mt-3"><strong>Additional notes:</strong> {active.patientNotes}</p>}<p className="mt-3 text-[#596963]"><strong>Reported timeline:</strong> {active.onset}</p></article>
              <article className="clinical-card !bg-[#F2F6F3]"><h3>Attached record context</h3><p><strong>Conditions:</strong> {active.summary.relevantHistory.join(', ')}</p><p className="mt-2"><strong>Medications:</strong> {active.summary.relevantMedications.join(' · ')}</p><p className="mt-2"><strong>Allergies:</strong> {active.summary.allergies.join(', ') || 'None listed in sample record'}</p></article>
            </div>
            <article className="clinical-card space-y-4">
              <h3>Structured handoff</h3><div><h4 className="font-semibold mb-1">What AVELA displayed</h4><p className="whitespace-pre-wrap">{active.summary.whatAvelaDisplayed}</p></div>
              <div><h4 className="font-semibold mb-1">Reason for review / missing information</h4><ul>{active.summary.missingInfo.map((item, index) => <li key={index}>{item}</li>)}</ul></div>
              <div><h4 className="font-semibold mb-1">Requested next step</h4><p>{active.summary.requestedNextStep}</p></div>
              <EvidenceCard citations={active.summary.sources}/>
            </article>
            {!!active.clinicianReplies?.length && <div className="space-y-3"><h3 className="font-semibold">Replies sent in this demo</h3>{active.clinicianReplies.map(item => <article className="clinical-card !bg-[#E8F0E9]" key={item.id}><p className="text-sm font-semibold mb-2">{item.clinicianName} · {item.timestamp}</p><p>{item.message}</p></article>)}</div>}
            {active.status !== 'closed' && <form className="space-y-3 pt-3" onSubmit={event => {event.preventDefault(); if (!reply.trim()) return; ctx.replyToRequest(active.id, reply.trim(), clinician); setReply(''); setFeedback('Reply saved to ' + active.patientName + '’s chat in the demo.')}}>
              <label className="font-semibold text-sm block" htmlFor="clinician-reply">Reply as {clinician}</label>
              <textarea id="clinician-reply" className="form-field" rows={3} value={reply} onChange={event => setReply(event.target.value)} required maxLength={4000} placeholder="Write a sample reply for the patient…"/>
              <div className="flex flex-wrap items-center justify-between gap-3"><p className="text-sm text-[#596963]">Saved to {active.patientName}’s conversation.</p><button className="primary-button" type="submit" disabled={!reply.trim()}><Send size={16}/> Reply to patient</button></div>
            </form>}
          </>}
        </section>
      </div>
      <details className="activity-disclosure"><summary>Demo activity ledger · {ctx.activityEvents.length} interactions</summary><ActivityVisualization/></details>
    </main>
  </div>
}
