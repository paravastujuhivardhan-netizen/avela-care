import React from 'react'
import { useAvela } from '../../context/AvelaContext'
import { PathwayType } from '../../types'
import { Activity, ShieldCheck, Clock, AlertTriangle, AlertOctagon } from 'lucide-react'

export const ActivityVisualization: React.FC = () => {
  const { activityEvents } = useAvela()

  // Calculate actual counts of demo events
  const counts = {
    'care-plan-explanation': activityEvents.filter(e => e.type === 'care-plan-explanation').length,
    'clinical-review': activityEvents.filter(e => e.type === 'clinical-review').length,
    'time-sensitive': activityEvents.filter(e => e.type === 'time-sensitive').length,
    'emergency': activityEvents.filter(e => e.type === 'emergency').length
  }

  const dotColors: Record<PathwayType, string> = {
    'care-plan-explanation': 'bg-[#173F3A]',
    'clinical-review': 'bg-[#D97706]',
    'time-sensitive': 'bg-[#EA580C]',
    'emergency': 'bg-[#DC2626]'
  }

  return (
    <div className="bg-white rounded-3xl border border-[#DDE5DF] p-5 space-y-4 shadow-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#173F3A]">
          <Activity className="w-4 h-4" />
          <span>Real-Time Demo Activity Ledger</span>
        </div>
        <span className="text-[11px] text-[#596963]">
          {activityEvents.length} simulated interactions recorded
        </span>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3 rounded-2xl bg-[#E8F0E9] border border-[#CADBD0]">
          <div className="flex items-center gap-1.5 text-[#173F3A] font-semibold mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Care Plan</span>
          </div>
          <span className="text-xl font-bold font-editorial text-[#173F3A]">{counts['care-plan-explanation']}</span>
          <span className="block text-[10px] text-[#596963] mt-0.5">Direct source citations</span>
        </div>

        <div className="p-3 rounded-2xl bg-[#FEF3C7] border border-[#FDE68A]">
          <div className="flex items-center gap-1.5 text-[#92400E] font-semibold mb-1">
            <Clock className="w-3.5 h-3.5" />
            <span>Needs Review</span>
          </div>
          <span className="text-xl font-bold font-editorial text-[#92400E]">{counts['clinical-review']}</span>
          <span className="block text-[10px] text-[#92400E]/80 mt-0.5">Missing info / dose queries</span>
        </div>

        <div className="p-3 rounded-2xl bg-[#FFEDD5] border border-[#FED7AA]">
          <div className="flex items-center gap-1.5 text-[#C2410C] font-semibold mb-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Time-Sensitive</span>
          </div>
          <span className="text-xl font-bold font-editorial text-[#C2410C]">{counts['time-sensitive']}</span>
          <span className="block text-[10px] text-[#C2410C]/80 mt-0.5">On-call liaison routing</span>
        </div>

        <div className="p-3 rounded-2xl bg-[#FEE2E2] border border-[#FECACA]">
          <div className="flex items-center gap-1.5 text-[#991B1B] font-semibold mb-1">
            <AlertOctagon className="w-3.5 h-3.5" />
            <span>Emergency</span>
          </div>
          <span className="text-xl font-bold font-editorial text-[#991B1B]">{counts['emergency']}</span>
          <span className="block text-[10px] text-[#991B1B]/80 mt-0.5">Emergency guidance displayed</span>
        </div>
      </div>

      {/* Elegant Dot Grid */}
      <div className="pt-2">
        <span className="text-[11px] font-semibold text-[#596963] block mb-2">
          Event Stream (Latest 40 Interactions):
        </span>
        <div className="flex flex-wrap gap-1.5 p-3 rounded-2xl bg-[#F7F8F4] border border-[#DDE5DF]">
          {activityEvents.length === 0 ? (
            <span className="text-xs text-[#596963] italic">No activity yet. Run a test fixture to see events appear.</span>
          ) : (
            activityEvents.slice(0, 40).map((evt, idx) => (
              <div
                key={evt.id || idx}
                title={`[${evt.timestamp}] ${evt.type}: "${evt.summary}"`}
                className={`w-3.5 h-3.5 rounded-full transition-transform hover:scale-125 cursor-pointer ${dotColors[evt.type]}`}
              />
            ))
          )}
        </div>
      </div>

      <p className="text-[11px] text-[#596963] italic">
        *Honest metric declaration: Counts reflect actual demo interactions. These are not claims of real calls prevented or clinical outcomes.
      </p>
    </div>
  )
}

