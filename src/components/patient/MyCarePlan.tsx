import { instructionCitation } from '../../engine/retrieval'
import React, { useState } from 'react'
import { useAvela } from '../../context/AvelaContext'
import { CareInstruction } from '../../types'
import { FileText, ShieldCheck, Calendar, ExternalLink, Search, History } from 'lucide-react'

export const MyCarePlan: React.FC = () => {
  const { currentPatient, setActiveCitation, setHighlightedPassage, highlightedPassage } = useAvela()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const categories = [
    { id: 'all', label: 'All Instructions' },
    { id: 'diet', label: 'Diet & Nutrition' },
    { id: 'medication', label: 'Medications' },
    { id: 'activity', label: 'Activity & Rehab' },
    { id: 'monitoring', label: 'Home Monitoring' },
    { id: 'warning-signs', label: 'Warning Signs' }
  ]

  const filteredInstructions = currentPatient.instructions.filter(inst => {
    const matchesSearch = 
      inst.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inst.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inst.authorName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || inst.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleOpenCitation = (inst: CareInstruction) => {
    setActiveCitation(instructionCitation(currentPatient, inst))
    setHighlightedPassage(inst.exactPassage)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1 text-xs font-semibold uppercase tracking-wider text-[#173F3A]">
          <FileText className="w-4 h-4" />
          <span>Verified Care Instructions</span>
        </div>
        <h1 className="text-3xl font-bold font-editorial text-[#173F3A]">
          {currentPatient.name}’s Care Plan
        </h1>
        <p className="text-sm text-[#596963] mt-1 leading-relaxed">
          These fictional instructions represent a documented care plan. AVELA references only these records to answer your everyday questions.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-[#596963]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search care instructions"
            placeholder="Search instructions by keyword (e.g. caffeine, dose, crutches)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-[#DDE5DF] text-xs sm:text-sm text-[#173F3A] focus:border-[#173F3A] focus:outline-none"
          />
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {categories.map(cat => (
            <button
              key={cat.id}
              aria-pressed={selectedCategory === cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-2 rounded-xl text-xs whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-[#173F3A] text-white font-semibold'
                  : 'bg-white border border-[#DDE5DF] text-[#596963] hover:text-[#173F3A]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Instructions list */}
      <div className="space-y-4">
        {filteredInstructions.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-3xl border border-[#DDE5DF] text-sm text-[#596963]">
            No instructions match your search or filter.
          </div>
        ) : (
          filteredInstructions.map(inst => {
            const isHighlighted = highlightedPassage === inst.exactPassage

            return (
              <div 
                key={inst.id}
                className={`bg-white rounded-3xl border p-6 transition-all shadow-xs ${
                  isHighlighted ? 'border-[#EA580C] ring-2 ring-[#EA580C]/30 bg-[#FFFBF7]' : 'border-[#DDE5DF] hover:border-[#173F3A]/40'
                }`}
              >
                {/* Instruction meta */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#E8F0E9] text-[#173F3A]">
                      {inst.category}
                    </span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                      Version {inst.version}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-[#596963]">
                    <span className="flex items-center gap-1 text-[#173F3A] bg-[#E8F0E9]/80 px-2 py-0.5 rounded-full font-medium">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      {inst.status === "verified" ? "Verified sample" : inst.status}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#596963]" />
                      {inst.date}
                    </span>
                  </div>
                </div>

                <h3 className="text-lg font-bold font-editorial text-[#173F3A]">
                  {inst.title}
                </h3>
                <p className="text-xs text-[#596963] mt-0.5">
                  Signed by {inst.authorName} ({inst.authorRole})
                </p>

                {/* Content */}
                <div className="mt-4 text-sm text-[#173F3A] leading-relaxed">
                  <p>{inst.content}</p>
                </div>

                {/* Highlighted Exact Passage Box */}
                <div className="mt-4 p-3.5 rounded-2xl bg-[#F7F8F4] border border-[#DDE5DF] text-xs">
                  <span className="font-semibold text-[#596963] block mb-1">
                    Exact Source Passage for AVELA Retrieval:
                  </span>
                  <p className="font-mono text-[#173F3A] bg-[#E8F0E9]/60 p-2 rounded-xl border-l-2 border-[#173F3A]">
                    "{inst.exactPassage}"
                  </p>
                </div>

                {/* Previous version history comparison if superseded/updated */}
                {inst.previousVersionContent && (
                  <div className="mt-3 p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
                    <span className="font-semibold block mb-0.5 flex items-center gap-1">
                      <History className="w-3.5 h-3.5" />
                      Archived Previous Version (v{inst.version - 1}):
                    </span>
                    <p className="line-through text-amber-800 text-[11px]">
                      {inst.previousVersionContent}
                    </p>
                  </div>
                )}

                <div className="mt-4 pt-3 border-t border-[#DDE5DF]/60 flex justify-end">
                  <button
                    onClick={() => handleOpenCitation(inst)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-[#173F3A] hover:text-[#122e2b]"
                  >
                    <span>View full instruction</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

