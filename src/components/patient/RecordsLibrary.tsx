import { ModalShell } from '../common/ModalShell'
import { recordCitation } from '../../engine/retrieval'
import React, { useState } from 'react'
import { useAvela } from '../../context/AvelaContext'
import { PatientRecord } from '../../types'
import { FolderArchive, Upload, CheckCircle2, AlertTriangle, ShieldAlert, Calendar, Search, X } from 'lucide-react'

export const RecordsLibrary: React.FC = () => {
  const { currentPatient, importRecord, setActiveCitation } = useAvela()
  const [searchQuery, setSearchQuery] = useState('')
  const [isImportModalOpen, setIsImportModalOpen] = useState(false)
  const [importTitle, setImportTitle] = useState('')
  const [importContent, setImportContent] = useState('')
  const [importAuthor, setImportAuthor] = useState('')

  const filteredRecords = currentPatient.records.filter(r => 
    r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.author.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!importTitle.trim() || !importContent.trim()) return

    const newRec: PatientRecord = {
      id: `rec-import-${Date.now()}`,
      title: importTitle.trim(),
      type: 'imported-note',
      date: new Date().toISOString().split('T')[0],
      author: importAuthor.trim() || 'Patient Uploaded Note',
      sourceOrganization: 'External Document / Patient Provided',
      status: 'unverified',
      summary: importContent.slice(0, 120) + '...',
      fullText: importContent.trim(),
      highlights: [importContent.slice(0, 80)]
    }

    importRecord(newRec)
    setIsImportModalOpen(false)
    setImportTitle('')
    setImportContent('')
    setImportAuthor('')
  }

  const handleOpenRecord = (r: PatientRecord) => {
    setActiveCitation(recordCitation(currentPatient, r))
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1 text-xs font-semibold uppercase tracking-wider text-[#173F3A]">
            <FolderArchive className="w-4 h-4" />
            <span>Clinical Records Repository</span>
          </div>
          <h1 className="text-3xl font-bold font-editorial text-[#173F3A]">
            Patient Record Library
          </h1>
          <p className="text-sm text-[#596963] mt-1">
            Browse consultation notes, summaries, and audit sources connected to this profile.
          </p>
        </div>

        <button
          onClick={() => setIsImportModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#173F3A] hover:bg-[#122e2b] text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors self-start"
        >
          <Upload className="w-4 h-4" />
          <span>Import Sample Document</span>
        </button>
      </div>

      {/* Safety Notice Banner */}
      <div className="p-4 rounded-2xl bg-[#E8F0E9]/70 border border-[#DDE5DF] flex items-center gap-3 text-xs text-[#173F3A]">
        <ShieldAlert className="w-5 h-5 text-[#173F3A] shrink-0" />
        <div>
          <strong>Privacy & Simulation Note:</strong> Fictional patient data only. Real medical information or protected health identifiers should not be uploaded to this prototype. Imported records are flagged <em>Unverified</em> and are excluded from instruction answers in this demo.
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-[#596963]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Search records"
          placeholder="Search records by title, summary, or author name..."
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-[#DDE5DF] text-xs sm:text-sm text-[#173F3A] focus:border-[#173F3A] focus:outline-none"
        />
      </div>

      {/* Records List */}
      <div className="space-y-4">
        {!filteredRecords.length && <p className="p-6 text-[#596963] bg-white border border-[#DDE5DF] rounded-2xl">No records match your search. Try a different title or author.</p>}
        {filteredRecords.map(rec => {
          const isVerified = rec.status === 'verified'

          return (
            <div 
              key={rec.id}
              className="bg-white rounded-3xl border border-[#DDE5DF] hover:border-[#173F3A]/40 p-6 transition-all shadow-xs space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-mono font-medium px-2.5 py-0.5 rounded-full bg-[#F7F8F4] border border-[#DDE5DF] text-[#173F3A]">
                  {rec.type.replace('-', ' ').toUpperCase()}
                </span>

                <div className="flex items-center gap-2 text-xs">
                  {isVerified ? (
                    <span className="flex items-center gap-1 text-[#173F3A] bg-[#E8F0E9] px-2.5 py-0.5 rounded-full font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Verified Record
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[#B45309] bg-[#FEF3C7] px-2.5 py-0.5 rounded-full font-medium">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Unverified Imported Document
                    </span>
                  )}
                  <span className="text-[#596963] flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {rec.date}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold font-editorial text-[#173F3A]">
                  {rec.title}
                </h3>
                <p className="text-xs text-[#596963] mt-0.5">
                  Author: {rec.author} · Source: {rec.sourceOrganization}
                </p>
              </div>

              <p className="text-xs sm:text-sm text-[#173F3A]/90 leading-relaxed bg-[#F7F8F4] p-3.5 rounded-2xl border border-[#DDE5DF]">
                {rec.summary}
              </p>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => handleOpenRecord(rec)}
                  className="px-4 py-2 rounded-xl bg-[#FFFFFF] border border-[#DDE5DF] hover:border-[#173F3A] text-xs font-semibold text-[#173F3A] transition-colors"
                >
                  View Full Document Text
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Import Modal */}
      {isImportModalOpen && (
        <ModalShell label="Import fictional care note" onClose={() => setIsImportModalOpen(false)}>
          <div className="bg-white rounded-3xl border border-[#DDE5DF] w-full max-w-lg p-6 space-y-4 overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#DDE5DF]">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-[#173F3A]" />
                <h3 className="font-editorial font-bold text-lg text-[#173F3A]">
                  Import Fictional Care Note
                </h3>
              </div>
              <button
                aria-label="Close import dialog"
                onClick={() => setIsImportModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-[#596963]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleImportSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-[#173F3A] block mb-1">
                  Document Title:
                </label>
                <input
                  type="text"
                  aria-label="Document title" maxLength={160}
                  value={importTitle}
                  onChange={(e) => setImportTitle(e.target.value)}
                  placeholder="e.g. Dietitian Consultation Notes (Sample)"
                  required
                  className="w-full p-2.5 rounded-xl border border-[#DDE5DF] text-xs focus:border-[#173F3A] focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-[#173F3A] block mb-1">
                  Author / Clinician Name:
                </label>
                <input
                  type="text"
                  aria-label="Author or clinician name" maxLength={160}
                  value={importAuthor}
                  onChange={(e) => setImportAuthor(e.target.value)}
                  placeholder="e.g. Dietitian Priya Rao, RD"
                  className="w-full p-2.5 rounded-xl border border-[#DDE5DF] text-xs focus:border-[#173F3A] focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-[#173F3A] block mb-1">
                  Sample Document Content (Text):
                </label>
                <textarea
                  aria-label="Sample document content" maxLength={12000}
                  value={importContent}
                  onChange={(e) => setImportContent(e.target.value)}
                  rows={4}
                  required
                  placeholder="Paste simulated medical notes or instructions..."
                  className="w-full p-2.5 rounded-xl border border-[#DDE5DF] text-xs focus:border-[#173F3A] focus:outline-none"
                />
              </div>

              <div className="p-3 rounded-xl bg-[#FEF3C7] text-[#92400E] text-[11px] leading-relaxed">
                <strong>Notice:</strong> This note will be stored with status <em>Unverified</em>. It cannot override clinical boundaries or prescribed regimens until reviewed by the care team in triage.
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#DDE5DF]">
                <button
                  type="button"
                  onClick={() => setIsImportModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#DDE5DF] text-[#596963]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#173F3A] text-white font-semibold"
                >
                  Import Record
                </button>
              </div>
            </form>
          </div>
        </ModalShell>
      )}
    </div>
  )
}

