import { ModalShell } from './ModalShell'
import React from 'react'
import { useAvela } from '../../context/AvelaContext'
import { X, ShieldCheck, Calendar, User, FileText, CheckCircle2, AlertTriangle } from 'lucide-react'

export const CitationModal: React.FC = () => {
  const { activeCitation, setActiveCitation, currentPatient, patients } = useAvela()

  if (!activeCitation) return null

  const sourcePatient = activeCitation.patientId && activeCitation.patientId in patients ? patients[activeCitation.patientId as keyof typeof patients] : currentPatient

  // Find corresponding instruction or record if available
  const matchedInst = sourcePatient.instructions.find(i => i.id === activeCitation.instructionId)
  const matchedRec = sourcePatient.records.find(r => r.id === activeCitation.recordId)

  const isVerified = activeCitation.status === 'verified'

  return (
    <ModalShell onClose={() => setActiveCitation(null)} label="Care record" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#173F3A]/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-[#FFFFFF] border border-[#DDE5DF] rounded-3xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="citation-title"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#DDE5DF] flex items-center justify-between bg-[#F7F8F4]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#E8F0E9] text-[#173F3A] flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#596963]">
                Traceable Care Record
              </span>
              <h3 id="citation-title" className="text-lg font-bold text-[#173F3A] font-editorial">
                {activeCitation.title}
              </h3>
            </div>
          </div>
          <button
            aria-label="Close dialog" onClick={() => setActiveCitation(null)}
            className="w-9 h-9 rounded-full hover:bg-[#E8F0E9] flex items-center justify-center text-[#596963] hover:text-[#173F3A] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Provenance Bar */}
        <div className="px-6 py-3 bg-[#FFFFFF] border-b border-[#DDE5DF] flex flex-wrap items-center gap-4 text-xs text-[#596963]">
          <div className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-[#173F3A]" />
            <span>Author: <strong className="text-[#173F3A]">{activeCitation.author}</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#173F3A]" />
            <span>Issued: <strong>{activeCitation.date}</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            {isVerified ? (
              <span className="inline-flex items-center gap-1 text-[#173F3A] bg-[#E8F0E9] px-2.5 py-0.5 rounded-full font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Verified sample record
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[#B45309] bg-[#FEF3C7] px-2.5 py-0.5 rounded-full font-medium">
                <AlertTriangle className="w-3.5 h-3.5" />
                Unverified External Record
              </span>
            )}
          </div>
          {activeCitation.version && (
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-gray-100 text-gray-700">
              v{activeCitation.version}
            </span>
          )}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm text-[#173F3A] leading-relaxed">
          {/* Highlighted exact passage banner */}
          <div className="p-4 rounded-2xl bg-[#FBF2ED] border border-[#F4D8CA] text-[#173F3A]">
            <div className="flex items-center gap-2 mb-1.5 text-xs font-semibold text-[#C2410C] uppercase tracking-wide">
              <ShieldCheck className="w-4 h-4 text-[#C2410C]" />
              Exact Instruction Passage Cited by AVELA
            </div>
            <p className="font-medium text-[#173F3A] bg-[#F4D8CA]/40 p-2.5 rounded-xl border-l-3 border-[#EA580C]">
              "{activeCitation.exactPassage}"
            </p>
          </div>

          {/* Full document / context */}
          <div>
            <h4 className="text-xs font-semibold text-[#596963] uppercase tracking-wider mb-2">
              Full Document Context
            </h4>
            <div className="bg-[#F7F8F4] p-4 rounded-2xl border border-[#DDE5DF] font-mono text-xs text-[#173F3A] whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto">
              {activeCitation.fullText || (matchedInst?.version === activeCitation.version ? matchedInst?.content : undefined) || matchedRec?.fullText || activeCitation.exactPassage}
            </div>
          </div>

          {/* Previous version comparison if available */}
          {matchedInst?.previousVersionContent && activeCitation.version === matchedInst.version && (
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs">
              <h5 className="font-semibold text-amber-900 mb-1">Previous Version (v{matchedInst.version - 1})</h5>
              <p className="text-amber-800 line-through">
                {matchedInst.previousVersionContent}
              </p>
              <span className="text-[11px] text-amber-700 mt-1 block">
                Archived when clinician published updated instruction on {activeCitation.date}.
              </span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#DDE5DF] bg-[#F7F8F4] flex items-center justify-between text-xs text-[#596963]">
          <span>Traceable provenance: Fictional patient ID {sourcePatient.id}</span>
          <button
            aria-label="Close dialog" onClick={() => setActiveCitation(null)}
            className="px-4 py-2 rounded-xl bg-[#173F3A] text-white font-medium hover:bg-[#122e2b] transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </ModalShell>
  )
}

