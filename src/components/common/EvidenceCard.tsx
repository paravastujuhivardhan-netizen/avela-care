import React, { useId } from 'react'
import { CitationReference, InformationUsedBreakdown } from '../../types'
import { FileCheck, ExternalLink, ChevronDown, ChevronUp, AlertCircle, ShieldCheck } from 'lucide-react'
import { useAvela } from '../../context/AvelaContext'

interface EvidenceCardProps {
  citations?: CitationReference[]
  informationUsed?: InformationUsedBreakdown
  onViewSource?: (citation: CitationReference) => void
}

export const EvidenceCard: React.FC<EvidenceCardProps> = ({ 
  citations = [], 
  informationUsed,
  onViewSource 
}) => {
  const { setActiveCitation, setHighlightedPassage } = useAvela()
  const [isExpanded, setIsExpanded] = React.useState(false)
  const contentId = useId()

  if (!citations.length && !informationUsed) return null

  const handleCitationClick = (c: CitationReference) => {
    if (onViewSource) onViewSource(c)
    else setActiveCitation(c)
    if (c.exactPassage) {
      setHighlightedPassage(c.exactPassage)
    }
  }

  return (
    <div className="mt-3.5 pt-3 border-t border-[#DDE5DF]/70 text-xs text-[#596963]">
      {/* Clickable Citations */}
      {citations.length > 0 && (
        <div className="space-y-1.5 mb-2.5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#173F3A] flex items-center gap-1.5">
            <FileCheck className="w-3.5 h-3.5 text-[#173F3A]" />
            Supporting source
          </span>
          <div className="flex flex-wrap gap-2">
            {citations.map((c, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleCitationClick(c)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FFFFFF] border border-[#DDE5DF] hover:border-[#173F3A] text-[#173F3A] font-medium text-xs shadow-2xs hover:shadow-xs transition-all text-left group"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#173F3A] shrink-0" />
                <span className="min-w-0 break-words">{c.title}</span>
                <span className="text-[11px] text-[#596963]">· {c.date}</span>
                <ExternalLink className="w-3 h-3 text-[#596963] group-hover:text-[#173F3A] shrink-0 transition-colors" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Expandable "Information Used" Accordion */}
      {informationUsed && (
        <div className="rounded-2xl border border-[#DDE5DF]/80 bg-[#F7F8F4]/80 overflow-hidden mt-2">
          <button
            type="button"
            aria-expanded={isExpanded} aria-controls={contentId}
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full px-3.5 py-2 flex items-center justify-between text-left text-xs font-semibold text-[#173F3A] hover:bg-[#E8F0E9]/50 transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <span>Information used ({citations.length} {citations.length === 1 ? "source" : "sources"})</span>
            </span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {isExpanded && (
            <div id={contentId} className="px-3.5 pb-3 pt-1 space-y-2.5 text-[11px] border-t border-[#DDE5DF]/50 bg-white">
              {/* Relevant excerpts */}
              {informationUsed.relevantExcerpts.length > 0 && (
                <div>
                  <span className="font-semibold text-[#173F3A] block mb-1">Exact Clinical Excerpt:</span>
                  <div className="space-y-1">
                    {informationUsed.relevantExcerpts.map((ex, idx) => (
                      <div key={idx} className="p-2 rounded-lg bg-[#E8F0E9]/60 border-l-2 border-[#173F3A] text-[#173F3A] font-mono text-[11px]">
                        {ex}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Available context */}
              {informationUsed.availableContext.length > 0 && (
                <div>
                  <span className="font-semibold text-[#596963] block mb-0.5">Known Context Used:</span>
                  <ul className="list-disc list-inside space-y-0.5 text-[#596963]">
                    {informationUsed.availableContext.map((c, idx) => (
                      <li key={idx}>{c}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Missing information */}
              {informationUsed.missingInformation.length > 0 && (
                <div>
                  <span className="font-semibold text-[#B45309] flex items-center gap-1 mb-0.5">
                    <AlertCircle className="w-3 h-3" />
                    Missing / Unaddressed In Record:
                  </span>
                  <ul className="list-disc list-inside space-y-0.5 text-[#92400E]">
                    {informationUsed.missingInformation.map((m, idx) => (
                      <li key={idx}>{m}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

