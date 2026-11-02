import { Home, MessageSquare, FileText, FolderArchive, Users, Clock, SlidersHorizontal, Stethoscope } from 'lucide-react'
import { useAvela } from '../../context/AvelaContext'
import { AvelaLogo } from '../common/AvelaLogo'
export const PatientNav = () => {
  const ctx = useAvela()
  const items = [
    { id: 'home', label: ctx.t.navHome, Icon: Home },
    { id: 'chat', label: ctx.t.navAskAvela, Icon: MessageSquare },
    { id: 'careplan', label: ctx.t.navCarePlan, Icon: FileText },
    { id: 'records', label: ctx.t.navRecords, Icon: FolderArchive },
    { id: 'careteam', label: ctx.t.navCareTeam, Icon: Users },
    { id: 'timeline', label: ctx.language === 'te' ? 'కాలక్రమం' : ctx.language === 'hi' ? 'समयरेखा' : 'Timeline', Icon: Clock }
  ] as const
  return <header className="patient-header">
    <div className="patient-header-main">
      <AvelaLogo size="sm" showTagline={false} onClick={() => ctx.setPerspective('landing')}/>
      <div className="header-actions flex flex-wrap items-center gap-2 min-w-0 justify-end">
        <button className="profile-button" onClick={() => ctx.setSelectedPatientId(ctx.selectedPatientId === 'patient-priya' ? 'patient-marcus' : 'patient-priya')} title="Switch fictional patient">
          <span className="profile-initials">{ctx.currentPatient.avatarInitials}</span><span className="profile-name">{ctx.currentPatient.name}</span>
        </button>
        <button className="secondary-button clinician-link hidden sm:inline-flex" onClick={() => ctx.setPerspective('clinician')}><Stethoscope size={16}/> Clinician view</button>
        <button className="secondary-button demo-open-button" onClick={() => ctx.setDemoControlsOpen(true)} aria-label="Open demo controls"><SlidersHorizontal size={16}/><span className="demo-mode-label">Demo mode</span></button>
        <a className="emergency-link" href="tel:112" aria-label="Call emergency services 112 in India">Emergency 112</a>
      </div>
    </div>
    <nav className="patient-nav" aria-label="Patient navigation">{items.map(({ id, label, Icon }) => <button key={id} aria-current={ctx.patientTab === id ? 'page' : undefined} onClick={() => ctx.setPatientTab(id)} className={'patient-nav-item ' + (ctx.patientTab === id ? 'is-active' : '')}><Icon size={16}/><span>{label}</span></button>)}</nav>
  </header>
}
