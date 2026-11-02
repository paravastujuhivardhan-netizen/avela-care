import React from 'react'
import { AvelaProvider, useAvela } from './context/AvelaContext'
import { LandingPage } from './components/landing/LandingPage'
import { PatientNav } from './components/patient/PatientNav'
import { PatientHome } from './components/patient/PatientHome'
import { AskAvelaChat } from './components/patient/AskAvelaChat'
import { MyCarePlan } from './components/patient/MyCarePlan'
import { RecordsLibrary } from './components/patient/RecordsLibrary'
import { CareTeamView } from './components/patient/CareTeamView'
import { CareTimeline } from './components/patient/CareTimeline'
import { ClinicianWorkspace } from './components/clinician/ClinicianWorkspace'

// Modals and Common Controls
import { DemoControlsBar } from './components/common/DemoControlsBar'
import { CitationModal } from './components/common/CitationModal'
import { EditableHandoffModal } from './components/patient/EditableHandoffModal'
import { MorningDigestModal } from './components/clinician/MorningDigestModal'
import { CoverageSettingsModal } from './components/clinician/CoverageSettingsModal'
import { InstructionEditorModal } from './components/clinician/InstructionEditorModal'
import { GuidedTourModal } from './components/tour/GuidedTourModal'
import { OnboardingModal } from './components/patient/OnboardingModal'

const MainAppContent: React.FC = () => {
  const { perspective, patientTab, currentPatient, persistenceNotice } = useAvela()

  return (
    <div className={"app-shell " + (perspective === "patient" && patientTab === "chat" ? "chat-mode" : "")}>
      {perspective === 'landing' && <LandingPage />}

      {perspective === 'patient' && (
        <div className={"patient-layout " + (patientTab === "chat" ? "is-chat" : "")}>
          <PatientNav />
          <main className="patient-main" data-patient-content>
            {patientTab === 'home' && <PatientHome key={currentPatient.id} />}
            {patientTab === 'chat' && <AskAvelaChat key={currentPatient.id} />}
            {patientTab === 'careplan' && <MyCarePlan key={currentPatient.id} />}
            {patientTab === 'records' && <RecordsLibrary key={currentPatient.id} />}
            {patientTab === 'careteam' && <CareTeamView key={currentPatient.id} />}
            {patientTab === 'timeline' && <CareTimeline key={currentPatient.id} />}
          </main>
        </div>
      )}

      {perspective === 'clinician' && <ClinicianWorkspace />}

      {persistenceNotice && <div className="app-notice" role="alert">{persistenceNotice}</div>}
      {/* Demo controls are kept outside the patient conversation. */}
      <DemoControlsBar />

      {/* Global Modals and Drawers */}
      <CitationModal />
      <EditableHandoffModal />
      <MorningDigestModal />
      <CoverageSettingsModal />
      <InstructionEditorModal />
      <GuidedTourModal />
      <OnboardingModal />
    </div>
  )
}

export function App() {
  return (
    <AvelaProvider>
      <MainAppContent />
    </AvelaProvider>
  )
}

export default App
