import { ModalShell } from '../common/ModalShell'
import React, { useState } from 'react'
import { useAvela } from '../../context/AvelaContext'
import { HandoffSummary } from '../../types'
import { Send, X, Edit3, FileText, AlertCircle, Clock } from 'lucide-react'

const EditableHandoffContent: React.FC = () => {
  const { activeHandoffModal, setActiveHandoffModal, submitHandoffRequest, isQuietHours, coverageSettings } = useAvela()
  
  const [editedConcern, setEditedConcern] = useState(activeHandoffModal?.reportedConcern || '')
  const [patientClarificationNote, setPatientClarificationNote] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)


  if (!activeHandoffModal) return null
  const urgent = activeHandoffModal.urgency === 'time-sensitive'
  const queueRoutine = isQuietHours && !urgent

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    const updatedHandoff: HandoffSummary = {
      ...activeHandoffModal,
      originalPatientMessage: activeHandoffModal.originalPatientMessage || activeHandoffModal.reportedConcern,
      reportedConcern: editedConcern.trim() || activeHandoffModal.reportedConcern
    }

    submitHandoffRequest(updatedHandoff, patientClarificationNote.trim() || undefined)
  }

  return (
    <ModalShell onClose={() => setActiveHandoffModal(null)} label="Review and confirm handoff" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#173F3A]/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-[#FFFFFF] border border-[#DDE5DF] rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="handoff-title"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#DDE5DF] bg-[#F7F8F4] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FEF3C7] text-[#92400E] flex items-center justify-center shrink-0">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#92400E]">
                Prepared Clinician Handoff
              </span>
              <h3 id="handoff-title" className="text-lg font-bold text-[#173F3A] font-editorial">
                Review & Confirm Before Sending
              </h3>
            </div>
          </div>
          <button
            aria-label="Close dialog" onClick={() => setActiveHandoffModal(null)}
            className="w-9 h-9 rounded-full hover:bg-[#E8F0E9] flex items-center justify-center text-[#596963] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quiet Hours Banner notice if active */}
        {(queueRoutine || urgent) && (
          <div className="px-6 py-2.5 bg-[#FEF3C7] border-b border-[#FDE68A] flex items-center gap-2 text-xs text-[#92400E]">
            <Clock className="w-4 h-4 shrink-0" />
            <span>
              <strong>{urgent ? 'Time-sensitive on-call route:' : 'Routine quiet hours: ' + coverageSettings.quietHoursStart + '–' + coverageSettings.quietHoursEnd}</strong>{' '}{urgent ? (coverageSettings.onCallTeamActive ? 'This uses the simulated on-call inbox, including overnight.' : 'On-call coverage is unavailable. Seek urgent care when needed; do not wait for this demo.') : 'Recorded for routine review when coverage resumes.'}
            </span>
          </div>
        )}

        {/* Scrollable Content */}
        <form id="handoff-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 text-xs text-[#173F3A]">
          {/* Patient Header Card */}
          <div className="p-3.5 rounded-2xl bg-[#F7F8F4] border border-[#DDE5DF] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#173F3A] text-white flex items-center justify-center font-bold text-xs">
                {activeHandoffModal.patientName.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <span className="font-semibold text-sm text-[#173F3A]">
                  {activeHandoffModal.patientName}
                </span>
                <span className="text-[#596963] ml-1.5 font-normal">
                  (Age {activeHandoffModal.patientAge})
                </span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-white border border-[#DDE5DF] text-[11px] font-medium text-[#596963]">
              Fictional Demo Patient
            </span>
          </div>

          {/* 1. Patient-reported concern (Editable) */}
          <div className="space-y-1.5">
            <label htmlFor="handoff-concern" className="font-semibold text-[#173F3A] flex items-center justify-between">
              <span>Your Reported Concern / Question:</span>
              <span className="text-[11px] font-normal text-[#596963]">Click to edit if needed</span>
            </label>
            <textarea
              id="handoff-concern"
              value={editedConcern}
              onChange={(e) => setEditedConcern(e.target.value)}
              rows={2}
              className="w-full p-3 rounded-2xl border border-[#DDE5DF] focus:border-[#173F3A] focus:ring-1 focus:ring-[#173F3A] text-xs leading-relaxed resize-none bg-white font-medium"
              placeholder="Your reported question or concern..."
              required
            />
          </div>

          {/* 2. Optional additional clarification */}
          <div className="space-y-1.5">
            <label className="font-semibold text-[#173F3A] flex items-center justify-between">
              <span>Additional Notes or Clarifications for Your Doctor (Optional):</span>
              <span className="text-[11px] font-normal text-[#596963]">E.g. onset, severity, what you ate</span>
            </label>
            <input
              type="text"
              aria-label="Additional notes for your care team"
              value={patientClarificationNote}
              onChange={(e) => setPatientClarificationNote(e.target.value)}
              className="w-full p-3 rounded-2xl border border-[#DDE5DF] focus:border-[#173F3A] focus:ring-1 focus:ring-[#173F3A] text-xs bg-white"
              placeholder="E.g., Started around 7 PM after light dinner; no vomiting or dizzy feeling."
            />
          </div>

          {/* 3. Facts attached by AVELA from verified records */}
          <div className="p-4 rounded-2xl bg-[#E8F0E9]/60 border border-[#DDE5DF] space-y-3">
            <h4 className="font-semibold text-[#173F3A] flex items-center gap-1.5 text-xs uppercase tracking-wider">
              <FileText className="w-3.5 h-3.5 text-[#173F3A]" />
              Sample record context attached
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
              <div>
                <span className="font-semibold text-[#596963] block">Relevant Conditions:</span>
                <p className="text-[#173F3A] mt-0.5">{activeHandoffModal.relevantHistory.join(', ')}</p>
              </div>

              <div>
                <span className="font-semibold text-[#596963] block">Known Allergies:</span>
                <p className="text-[#B91C1C] font-medium mt-0.5">{activeHandoffModal.allergies.join(', ') || 'No known allergies'}</p>
              </div>
            </div>

            <div className="text-[11px]">
              <span className="font-semibold text-[#596963] block">Active Medications on Record:</span>
              <p className="text-[#173F3A] mt-0.5">{activeHandoffModal.relevantMedications.join(' · ')}</p>
            </div>

            <div className="text-[11px]">
              <span className="font-semibold text-[#596963] block">What AVELA Explained to Patient:</span>
              <p className="text-[#173F3A] mt-0.5 italic bg-white/70 p-2 rounded-xl border border-[#DDE5DF]">
                "{activeHandoffModal.whatAvelaDisplayed.slice(0, 150)}..."
              </p>
            </div>

            {activeHandoffModal.missingInfo.length > 0 && (
              <div className="text-[11px]">
                <span className="font-semibold text-[#B45309] flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Reason for Clinician Escalation:
                </span>
                <ul className="list-disc list-inside text-[#92400E] mt-0.5">
                  {activeHandoffModal.missingInfo.map((m, idx) => (
                    <li key={idx}>{m}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </form>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-[#DDE5DF] bg-[#F7F8F4] flex flex-wrap items-center justify-between gap-3 text-xs">
          <button
            type="button"
            onClick={() => setActiveHandoffModal(null)}
            className="px-4 py-2 rounded-xl border border-[#DDE5DF] text-[#596963] hover:text-[#173F3A] bg-white font-medium transition-colors"
          >
            Cancel
          </button>

          <button
            type="submit" form="handoff-form"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#173F3A] hover:bg-[#122e2b] text-white font-semibold shadow-sm hover:shadow transition-all active:scale-98 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>{urgent ? 'Update On-Call Request (Demo)' : queueRoutine ? 'Queue for Routine Review (Demo)' : 'Send to Care Team (Demo)'}</span>
          </button>
        </div>
      </div>
    </ModalShell>
  )
}


export const EditableHandoffModal = () => {
  const {activeHandoffModal} = useAvela()
  return activeHandoffModal ? <EditableHandoffContent key={activeHandoffModal.patientId + ':' + activeHandoffModal.originalPatientMessage}/> : null
}
