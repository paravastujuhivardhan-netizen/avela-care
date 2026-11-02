import { ModalShell } from '../common/ModalShell'
import React from 'react'
import { useAvela } from '../../context/AvelaContext'
import { Sun, X, Clock, AlertTriangle, FileText } from 'lucide-react'

export const MorningDigestModal: React.FC = () => {
  const { 
    isMorningDigestOpen, 
    setIsMorningDigestOpen, 
    requests, 
    activityEvents, 
    demoTime,
    demoDate
  } = useAvela()

  if (!isMorningDigestOpen) return null

  // Categorize requests
  const queuedReviews = requests.filter(r => r.status === 'queued')
  const timeSensitive = requests.filter(r => ['time-sensitive', 'emergency-audit'].includes(r.urgency) && r.status !== 'closed')
  const acknowledged = requests.filter(r => r.status === 'acknowledged')

  return (
    <ModalShell onClose={() => setIsMorningDigestOpen(false)} label="Morning digest" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#173F3A]/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white border border-[#DDE5DF] rounded-3xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="digest-title"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#DDE5DF] bg-[#F7F8F4] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#E8F0E9] text-[#173F3A] flex items-center justify-center shrink-0">
              <Sun className="w-5 h-5 text-[#173F3A]" />
            </div>
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#596963]">
                Daily Clinical Handover
              </span>
              <h3 id="digest-title" className="text-lg font-bold text-[#173F3A] font-editorial">
                Morning Clinical Digest ({demoDate}, {demoTime})
              </h3>
            </div>
          </div>
          <button
            aria-label="Close dialog" onClick={() => setIsMorningDigestOpen(false)}
            className="w-8 h-8 rounded-full hover:bg-[#E8F0E9] flex items-center justify-center text-[#596963]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Digest Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-[#173F3A]">
          {/* Summary Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-[#FEF3C7] border border-[#FDE68A]">
              <span className="text-2xl font-bold font-editorial text-[#92400E] block">{queuedReviews.length}</span>
              <span className="text-[#92400E] font-medium mt-0.5 block">Awaiting Review</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#FFEDD5] border border-[#FED7AA]">
              <span className="text-2xl font-bold font-editorial text-[#C2410C] block">{timeSensitive.length}</span>
              <span className="text-[#C2410C] font-medium mt-0.5 block">Open priority cases</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#E8F0E9] border border-[#CADBD0]">
              <span className="text-2xl font-bold font-editorial text-[#173F3A] block">{acknowledged.length}</span>
              <span className="text-[#173F3A] font-medium mt-0.5 block">Acknowledged</span>
            </div>
          </div>

          {/* Section 1: Queued Requests Awaiting Morning Review */}
          <div className="space-y-3">
            <h4 className="font-semibold text-xs uppercase tracking-wider text-[#596963] flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#173F3A]" />
              Requests Queued During Quiet Hours ({queuedReviews.length})
            </h4>

            {queuedReviews.length === 0 ? (
              <p className="text-xs text-[#596963] italic bg-[#F7F8F4] p-3 rounded-2xl border border-[#DDE5DF]">
                No overnight requests in queue.
              </p>
            ) : (
              <div className="space-y-2">
                {queuedReviews.map(r => (
                  <div key={r.id} className="p-3.5 rounded-2xl bg-[#F7F8F4] border border-[#DDE5DF] flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <span className="font-semibold text-[#173F3A] block">{r.patientName} (Age {r.summary.patientAge})</span>
                      <p className="text-[#596963] text-xs mt-0.5">"{r.patientConcern}"</p>
                      <span className="text-[10px] text-[#92400E] font-medium mt-1 inline-block">
                        Onset: {r.onset}
                      </span>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#FEF3C7] text-[#92400E]">
                      Needs Triage
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 2: Open priority cases */}
          <div className="space-y-3">
            <h4 className="font-semibold text-xs uppercase tracking-wider text-[#C2410C] flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              Open priority cases
            </h4>
            {timeSensitive.length === 0 ? (
              <p className="text-xs text-[#596963] italic bg-[#F7F8F4] p-3 rounded-2xl border border-[#DDE5DF]">
                No open priority alerts.
              </p>
            ) : (
              <div className="space-y-2">
                {timeSensitive.map(r => (
                  <div key={r.id} className="p-3.5 rounded-2xl bg-[#FFEDD5]/60 border border-[#FED7AA] flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <span className="font-bold text-[#C2410C] block">{r.patientName}</span>
                      <p className="text-[#173F3A] text-xs mt-0.5 font-medium">"{r.patientConcern}"</p>
                    </div>
                    <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-white text-[#C2410C]">
                      Status: {r.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 3: Overview of Routine Care-Plan Explanations */}
          <div className="p-4 rounded-2xl bg-[#E8F0E9]/50 border border-[#DDE5DF] space-y-1">
            <span className="font-semibold text-xs text-[#173F3A] flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-[#173F3A]" />
              Automated Care-Plan Explanations (Privacy-Scoped Summary)
            </span>
            <p className="text-[#596963] text-[11px] leading-relaxed">
              {activityEvents.filter(event => event.type === 'care-plan-explanation').length} record-backed explanation events recorded in this demo. Counts describe simulated interactions, not real calls prevented or clinical outcomes.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#DDE5DF] bg-[#F7F8F4] flex justify-end">
          <button
            aria-label="Close dialog" onClick={() => setIsMorningDigestOpen(false)}
            className="px-4 py-2 rounded-xl bg-[#173F3A] text-white font-semibold hover:bg-[#122e2b]"
          >
            Close digest
          </button>
        </div>
      </div>
    </ModalShell>
  )
}

