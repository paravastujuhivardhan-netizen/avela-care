import { useState } from 'react'
import { SlidersHorizontal, X, Play, RotateCcw, Clock, AlertOctagon } from 'lucide-react'
import { useAvela } from '../../context/AvelaContext'
import { FIXTURE_SCENARIOS } from '../../data/fixtures'
import { ModalShell } from './ModalShell'
import type { Language, PatientProfile } from '../../types'

export const DemoControlsBar = () => {
  const ctx = useAvela()
  const [category, setCategory] = useState('all')
  const categories = [['all', 'All examples'], ['personalization', 'Personalization'], ['routine', 'Care plan'], ['review-needed', 'Review'], ['time-sensitive', 'Time-sensitive'], ['emergency', 'Emergency'], ['negation', 'Negation'], ['compound', 'Mixed concerns']]
  const fixtures = FIXTURE_SCENARIOS.filter(fixture => category === 'all' || fixture.category === category)
  const run = (patientId: PatientProfile['id'], query: string) => {
    ctx.setDemoControlsOpen(false)
    ctx.openChat(patientId, query)
  }
  return <>
    {ctx.perspective === 'landing' && <button className="demo-launcher" onClick={() => ctx.setDemoControlsOpen(true)}><SlidersHorizontal size={16} /> Demo mode</button>}
    {ctx.demoControlsOpen && <ModalShell onClose={() => ctx.setDemoControlsOpen(false)} label="Demo controls">
      <div className="w-full max-w-3xl max-h-[90dvh] rounded-3xl bg-white border border-[#DDE5DF] shadow-xl flex flex-col overflow-hidden" role="dialog" aria-labelledby="demo-title">
        <div className="p-5 border-b border-[#DDE5DF] flex justify-between gap-3">
          <div><p className="eyebrow">Explore both sides of care</p><h2 id="demo-title" className="text-xl font-editorial font-semibold">Demo mode</h2><p className="text-sm text-[#596963] mt-1">Fictional records, local responses, and simulated communications.</p></div>
          <button className="icon-button" aria-label="Close demo controls" onClick={() => ctx.setDemoControlsOpen(false)}><X size={20}/></button>
        </div>
        <div className="overflow-y-auto min-h-0 p-5 space-y-5">
          <div className="flex flex-wrap gap-2">
            <button className="secondary-button" onClick={() => {ctx.setPerspective('landing'); ctx.setDemoControlsOpen(false)}}>Public Site</button>
            <button className="secondary-button" onClick={() => {ctx.openChat(); ctx.setDemoControlsOpen(false)}}>Patient View</button>
            <button className="secondary-button" onClick={() => {ctx.setPerspective('clinician'); ctx.setDemoControlsOpen(false)}}>Clinician Inbox</button>
            <button className="secondary-button" onClick={() => {ctx.setDemoControlsOpen(false); ctx.setIsOnboardingOpen(true)}}>Profile setup</button>
            <button className="secondary-button" onClick={() => {ctx.startTour(); ctx.setDemoControlsOpen(false)}}><Play size={15}/> Guided tour</button>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-[#F7F8F4] border border-[#DDE5DF]">
            <label className="space-y-1 text-sm font-medium">Fictional patient<select aria-label="Demo patient" className="form-field" value={ctx.selectedPatientId} onChange={event => ctx.setSelectedPatientId(event.target.value as PatientProfile['id'])}>
              {Object.values(ctx.patients).map(patient => <option key={patient.id} value={patient.id}>{patient.name}</option>)}
            </select></label>
            <label className="space-y-1 text-sm font-medium">Interface language<select aria-label="Interface language" className="form-field" value={ctx.language} onChange={event => ctx.setLanguage(event.target.value as Language)}>
              <option value="en">English</option><option value="hi">हिंदी</option><option value="te">తెలుగు</option>
            </select></label>
            <div className="flex flex-wrap items-center gap-2 text-sm"><Clock size={16}/><span>{ctx.demoDate} · <strong>{ctx.demoTime}</strong></span><button className="secondary-button" onClick={() => ctx.advanceDemoTime(2)}>+2h</button></div>
            <label className="flex items-center gap-3 text-sm"><input type="checkbox" checked={ctx.largeTextMode} onChange={event => ctx.setLargeTextMode(event.target.checked)}/> Large text</label>
          </div>
          {ctx.language !== 'en' && <p className="text-sm text-[#596963]">Interface labels are localized. Sample record text and most replies remain in English, with an explicit language notice.</p>}
          <button className="emergency-demo-button w-full" onClick={() => run('patient-priya', 'I have severe chest pain and trouble breathing right now.')}><AlertOctagon size={18}/> Try emergency scenario · demo only</button>
          <div className="flex flex-wrap gap-2" aria-label="Scenario category">{categories.map(([value, label]) => <button key={value} className={'filter-chip ' + (category === value ? 'is-active' : '')} aria-pressed={category === value} onClick={() => setCategory(value)}>{label}</button>)}</div>
          <div className="space-y-3">{fixtures.map(fixture => <article key={fixture.id} className="p-4 rounded-2xl border border-[#DDE5DF] space-y-2">
            <div className="flex flex-wrap justify-between gap-2 text-xs text-[#596963]"><span>{ctx.patients[fixture.targetPatientId].name}</span><span>{fixture.expectedPathway.replaceAll('-', ' ')}</span></div>
            <h3 className="font-semibold text-base">{fixture.title}</h3>
            <p className="text-sm text-[#596963]">{fixture.userQuery}</p>
            <div className="flex justify-end"><button className="primary-button" aria-label={'Simulate ' + fixture.title} onClick={() => run(fixture.targetPatientId, fixture.userQuery)}>Simulate</button></div>
          </article>)}</div>
        </div>
        <div className="p-4 border-t border-[#DDE5DF] flex flex-wrap justify-between gap-3">
          <button className="secondary-button" onClick={() => {if (window.confirm('Reset fictional demo data to its initial state?')) {ctx.resetDemo(); ctx.setDemoControlsOpen(false)}}}><RotateCcw size={15}/> Reset demo data</button>
          <button className="primary-button" onClick={() => ctx.setDemoControlsOpen(false)}>Done</button>
        </div>
      </div>
    </ModalShell>}
  </>
}
