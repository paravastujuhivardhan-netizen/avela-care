import React, { useState } from 'react'
import { useAvela } from '../../context/AvelaContext'

import { Clock, MessageSquare, FileText, Send, Calendar, ChevronDown, ChevronUp, Stethoscope } from 'lucide-react'

export const CareTimeline: React.FC = () => {
  const { timelineEvents, currentPatient } = useAvela()
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const patientEvents = timelineEvents.filter(e => e.patientId === currentPatient.id).toSorted((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

  const categoryIcons = {
    'conversation': MessageSquare,
    'care-plan-update': FileText,
    'review-request': Send,
    'clinician-reply': Stethoscope,
    'follow-up': Calendar
  }

  const categoryBadges = {
    'conversation': 'bg-gray-100 text-gray-700',
    'care-plan-update': 'bg-[#E8F0E9] text-[#173F3A]',
    'review-request': 'bg-[#FEF3C7] text-[#92400E]',
    'clinician-reply': 'bg-blue-100 text-blue-800',
    'follow-up': 'bg-[#FBF2ED] text-[#9A3412]'
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6 animate-in fade-in duration-300">
      <div>
        <div className="flex items-center gap-2 mb-1 text-xs font-semibold uppercase tracking-wider text-[#173F3A]">
          <Clock className="w-4 h-4" />
          <span>Longitudinal Event Record</span>
        </div>
        <h1 className="text-3xl font-bold font-editorial text-[#173F3A]">
          Care & Communication Timeline
        </h1>
        <p className="text-sm text-[#596963] mt-1">
          Chronological record of instructions, patient questions, clinician responses, and follow-ups for {currentPatient.name}.
        </p>
      </div>

      <div className="relative border-l-2 border-[#DDE5DF] ml-4 sm:ml-6 pl-6 space-y-8 py-2">
        {patientEvents.length === 0 ? (
          <p className="text-xs text-[#596963] italic">
            No events recorded yet for this session.
          </p>
        ) : (
          patientEvents.map(evt => {
            const Icon = categoryIcons[evt.category] || Clock
            const badgeClass = categoryBadges[evt.category] || 'bg-gray-100 text-gray-700'
            const isExpanded = expandedId === evt.id

            return (
              <div key={evt.id} className="relative group">
                {/* Node circle */}
                <div className="absolute -left-[35px] top-1.5 w-6 h-6 rounded-full bg-white border-2 border-[#173F3A] flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-[#173F3A]" />
                </div>

                <div className="bg-white rounded-3xl border border-[#DDE5DF] p-5 hover:border-[#173F3A]/40 transition-all shadow-2xs">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span className={`text-[11px] font-semibold uppercase px-2.5 py-0.5 rounded-full ${badgeClass}`}>
                      {evt.category.replace('-', ' ')}
                    </span>
                    <span className="text-xs font-mono text-[#596963]">
                      {Number.isNaN(Date.parse(evt.timestamp)) ? evt.timestamp : new Intl.DateTimeFormat('en-IN', {dateStyle:'medium', timeStyle:'short', timeZone:'Asia/Kolkata'}).format(new Date(evt.timestamp))}
                    </span>
                  </div>

                  <h3 className="font-editorial font-bold text-base text-[#173F3A] flex items-center gap-2"><Icon size={17}/>
                    {evt.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#596963] mt-1 leading-relaxed">
                    {evt.description}
                  </p>

                  {/* Expand toggle */}
                  <div className="mt-3 pt-2 border-t border-[#DDE5DF]/50 flex justify-between items-center text-xs text-[#596963]">
                    <span className="text-[11px]">Demo event · {evt.id.slice(0, 14)}</span>
                    <button
                      aria-expanded={isExpanded}
                      aria-label={(isExpanded ? "Hide" : "Show") + " details for " + evt.title}
                      onClick={() => setExpandedId(isExpanded ? null : evt.id)}
                      className="flex items-center gap-1 font-semibold text-[#173F3A] hover:underline"
                    >
                      <span>{isExpanded ? 'Less' : 'Details'}</span>
                      {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="mt-3 p-3 rounded-2xl bg-[#F7F8F4] text-xs font-mono text-[#173F3A] space-y-1">
                      <div>Patient Profile: {currentPatient.name} ({currentPatient.id})</div>
                      <div>Category: {evt.category}</div>
                      <div>Full Record: {evt.description}</div>
                    </div>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

