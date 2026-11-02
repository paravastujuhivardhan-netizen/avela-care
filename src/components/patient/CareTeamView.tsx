import { useState } from 'react'
import { Users, Send, CheckCircle2, Clock, PhoneCall, AlertOctagon } from 'lucide-react'
import { useAvela } from '../../context/AvelaContext'
import { requestStatusLabel } from '../../engine/session'

export const CareTeamView = () => {
  const ctx = useAvela()
  const [text, setText] = useState('')
  const [sentId, setSentId] = useState<string | null>(null)
  const [callNotice, setCallNotice] = useState('')
  const sent = ctx.requests.find(request => request.id === sentId)
  return <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-7">
    <div><p className="eyebrow flex items-center gap-2"><Users size={16}/> Your human care circle</p><h1 className="text-3xl font-editorial font-semibold mt-2">Contact your care team</h1><p className="text-[#596963] mt-3 leading-relaxed">You can reach your team directly. You do not need an AI referral.</p></div>
    <div className="p-4 rounded-2xl border border-[#DDE5DF] bg-[#E8F0E9] flex items-start gap-3 text-sm"><Clock size={19} className="shrink-0 mt-1"/><p>{ctx.isQuietHours ? 'Routine quiet hours are active until ' + ctx.coverageSettings.quietHoursEnd + ' IST. Routine messages wait for the next review window.' : 'The simulated routine inbox is available.'} {ctx.coverageSettings.onCallTeamActive ? 'Time-sensitive requests use the on-call route.' : 'On-call coverage is unavailable in the simulation.'}</p></div>
    <div className="grid sm:grid-cols-2 gap-4">{ctx.currentPatient.careTeam.map(member => <article key={member.id} className="bg-white border border-[#DDE5DF] rounded-3xl p-5 space-y-3">
      <div className="w-11 h-11 rounded-2xl bg-[#E8F0E9] grid place-items-center"><Users size={21}/></div>
      <h2 className="font-editorial text-xl font-semibold">{member.name}</h2><p className="text-sm text-[#596963]">{member.role} · {member.specialty}</p><p className="text-sm text-[#596963]">{member.organization}</p>
      <button className="secondary-button" onClick={() => setCallNotice('Demo only: no call was placed to ' + member.name + '. Use your real clinic’s contact details outside this prototype.')}><PhoneCall size={16}/> Simulate clinic call</button>
    </article>)}</div>
    {callNotice && <p role="status" className="p-4 rounded-2xl bg-[#E8F0E9] text-sm">{callNotice}</p>}
    <section className="bg-white border border-[#DDE5DF] rounded-3xl p-5 sm:p-7 space-y-4">
      <div><h2 className="text-2xl font-editorial font-semibold">Message your team directly</h2><p className="text-sm text-[#596963] mt-2">Creates a request in this demo’s clinician inbox. No real clinician is notified.</p></div>
      <form className="space-y-4" onSubmit={event => {
        event.preventDefault()
        const id = ctx.sendDirectMessage(text)
        if (id) {setSentId(id); setText('')}
      }}>
        <label htmlFor="direct-message" className="text-sm font-semibold block">Your message (fictional data only)</label>
        <textarea id="direct-message" rows={4} className="form-field" value={text} onChange={event => setText(event.target.value)} required maxLength={4000} placeholder="Write your question for your care team…"/>
        <div className="flex flex-wrap gap-3 justify-between items-center"><p className="text-sm text-[#596963]">For urgent symptoms, seek help directly.</p><button type="submit" className="primary-button" disabled={!text.trim()}><Send size={16}/> Send direct message</button></div>
      </form>
      {sent && <div role="status" className="p-4 rounded-2xl bg-[#E8F0E9] border border-[#CADBD0] space-y-2"><p className="font-semibold flex items-center gap-2"><CheckCircle2 size={18}/> Request recorded · {requestStatusLabel(sent)}</p><p className="text-sm">{sent.deliveryNotice}</p><p className="text-xs break-all">Request ID: {sent.id}</p><button className="secondary-button" onClick={() => ctx.setPerspective('clinician')}>View clinician inbox</button></div>}
    </section>
    <div className="p-5 rounded-2xl bg-[#FFF4EC] border border-[#E9B396] space-y-3"><h2 className="font-semibold flex items-center gap-2"><AlertOctagon size={18}/> Need emergency help?</h2><p className="text-sm">Do not wait for this demo or a routine message. In India, call 112. Elsewhere, use your local emergency number.</p><a className="emergency-link" href="tel:112"><PhoneCall size={16}/> Call 112 — India</a></div>
  </div>
}
