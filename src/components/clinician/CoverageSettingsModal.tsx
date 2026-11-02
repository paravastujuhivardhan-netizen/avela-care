import { useState } from 'react'
import { Moon, X, ShieldAlert } from 'lucide-react'
import { ModalShell } from '../common/ModalShell'
import { useAvela } from '../../context/AvelaContext'

const CoverageSettingsContent = () => {
  const ctx = useAvela()
  const [form, setForm] = useState(ctx.coverageSettings)
  if (!ctx.isCoverageModalOpen) return null
  return <ModalShell label="Coverage and quiet hours" onClose={() => ctx.setIsCoverageModalOpen(false)}>
    <div className="bg-white border border-[#DDE5DF] rounded-3xl w-full max-w-lg overflow-y-auto p-6 space-y-5">
      <div className="flex items-center justify-between gap-3"><h2 className="font-editorial text-2xl flex items-center gap-2"><Moon size={21}/> Coverage & quiet hours</h2><button className="icon-button" aria-label="Close coverage settings" onClick={() => ctx.setIsCoverageModalOpen(false)}><X size={19}/></button></div>
      <div className="p-4 bg-[#FFF4EC] rounded-2xl text-sm flex gap-2"><ShieldAlert size={20} className="shrink-0"/><p>Emergency access is independent of quiet hours. This is a routing simulation; it does not contact emergency services or a real clinician.</p></div>
      <form className="space-y-5" onSubmit={event => {event.preventDefault(); ctx.updateCoverageSettings({...form, onCallRouteName: form.onCallRouteName.trim()}); ctx.setIsCoverageModalOpen(false)}}>
        <label className="flex items-center justify-between gap-3 text-sm font-semibold">Enable routine quiet hours<input className="w-5 h-5 accent-[#173F3A]" type="checkbox" checked={form.quietHoursEnabled} onChange={event => setForm({...form, quietHoursEnabled:event.target.checked})}/></label>
        <div className="grid grid-cols-2 gap-3"><label className="text-sm font-semibold space-y-2">Start (IST)<input type="time" required className="form-field" value={form.quietHoursStart} onChange={event => setForm({...form, quietHoursStart: event.target.value})}/></label><label className="text-sm font-semibold space-y-2">End (IST)<input type="time" required className="form-field" value={form.quietHoursEnd} onChange={event => setForm({...form, quietHoursEnd: event.target.value})}/></label></div>
        <label className="flex items-center justify-between gap-3 text-sm font-semibold">Simulated on-call coverage available<input className="w-5 h-5 accent-[#173F3A]" type="checkbox" checked={form.onCallTeamActive} onChange={event => setForm({...form, onCallTeamActive:event.target.checked})}/></label>
        <label className="text-sm font-semibold block space-y-2">On-call route name<input className="form-field" required maxLength={160} value={form.onCallRouteName} onChange={event => setForm({...form, onCallRouteName:event.target.value})}/></label>
        <p className="text-sm text-[#596963]">Routine requests may queue. Time-sensitive and emergency audit requests never queue overnight. When coverage is unavailable, the demo shows that status explicitly.</p>
        <div className="flex flex-wrap justify-end gap-2 border-t border-[#DDE5DF] pt-4"><button className="secondary-button" type="button" onClick={() => ctx.setIsCoverageModalOpen(false)}>Cancel</button><button className="primary-button" type="submit">Save coverage policy</button></div>
      </form>
    </div>
  </ModalShell>
}

export const CoverageSettingsModal = () => {
  const {isCoverageModalOpen} = useAvela()
  return isCoverageModalOpen ? <CoverageSettingsContent/> : null
}
