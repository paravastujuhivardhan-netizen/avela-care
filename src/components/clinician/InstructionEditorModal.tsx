import { ModalShell } from '../common/ModalShell'
import React, { useState } from 'react'
import { useAvela } from '../../context/AvelaContext'

import { FileEdit, X, History, Check } from 'lucide-react'

const InstructionEditorContent: React.FC = () => {
  const { 
    activeInstructionToEdit, 
    setActiveInstructionToEdit, 
    publishInstructionVersion,
    patients 
  } = useAvela()

  const [error, setError] = useState('')
  const [title, setTitle] = useState(activeInstructionToEdit?.title || '')
  const [content, setContent] = useState(activeInstructionToEdit?.content || '')
  const [exactPassage, setExactPassage] = useState(activeInstructionToEdit?.exactPassage || '')


  if (!activeInstructionToEdit) return null

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim() || !exactPassage.trim()) return

    if (!content.trim().includes(exactPassage.trim())) {
      setError('The cited passage must appear exactly in the complete instruction.')
      return
    }
    publishInstructionVersion(
      activeInstructionToEdit.id,
      title.trim(),
      content.trim(),
      exactPassage.trim()
    )
  }

  return (
    <ModalShell onClose={() => setActiveInstructionToEdit(null)} label="Care instruction editor" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#173F3A]/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white border border-[#DDE5DF] rounded-3xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="editor-title"
      >
        <div className="px-6 py-5 border-b border-[#DDE5DF] bg-[#F7F8F4] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#173F3A] text-white flex items-center justify-center shrink-0">
              <FileEdit className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#596963]">
                Care Plan Authoring · Versioning Control
              </span>
              <h3 id="editor-title" className="text-lg font-bold text-[#173F3A] font-editorial">
                Edit Standing Care Instruction (v{activeInstructionToEdit.version} → v{activeInstructionToEdit.version + 1})
              </h3>
            </div>
          </div>
          <button
            aria-label="Close dialog" onClick={() => setActiveInstructionToEdit(null)}
            className="w-8 h-8 rounded-full hover:bg-[#E8F0E9] flex items-center justify-center text-[#596963]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handlePublish} className="p-6 overflow-y-auto space-y-4 text-xs text-[#173F3A]">
          <label className="block text-sm font-semibold">Choose a current instruction
            <select className="form-field mt-2" aria-label="Choose a current instruction" value={activeInstructionToEdit.id} onChange={event => {
              const instruction = Object.values(patients).flatMap(patient => patient.instructions).find(item => item.id === event.target.value)
              if (instruction) setActiveInstructionToEdit(instruction)
            }}>
              {Object.values(patients).map(patient => <optgroup key={patient.id} label={patient.name}>{patient.instructions.filter(item => item.status === 'verified').map(item => <option key={item.id} value={item.id}>{item.title} · v{item.version}</option>)}</optgroup>)}
            </select>
          </label>
          {error && <p role="alert" className="p-3 rounded-xl bg-[#FEF3C7] text-[#92400E]">{error}</p>}
          <div className="p-3 rounded-2xl bg-[#E8F0E9] border border-[#CADBD0] text-xs">
            <span className="font-semibold text-[#173F3A]">Patient: {Object.values(patients).find(patient => patient.instructions.some(instruction => instruction.id === activeInstructionToEdit.id))?.name}</span>
            <p className="text-[#596963] text-[11px] mt-0.5">
              Publishing will increment to version {activeInstructionToEdit.version + 1}. Future queries by this patient will automatically cite the new version; prior conversation records retain original citations.
            </p>
          </div>

          <div>
            <label className="font-semibold text-[#173F3A] block mb-1">
              Instruction Title:
            </label>
            <input
              type="text"
              aria-label="Instruction title" maxLength={160}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 rounded-2xl border border-[#DDE5DF] text-xs focus:border-[#173F3A] focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="font-semibold text-[#173F3A] block mb-1">
              Complete Clinical Instruction:
            </label>
            <textarea
              aria-label="Complete clinical instruction" maxLength={12000}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={3}
              className="w-full p-3 rounded-2xl border border-[#DDE5DF] text-xs focus:border-[#173F3A] focus:outline-none leading-relaxed"
              required
            />
          </div>

          <div>
            <label className="font-semibold text-[#173F3A] block mb-1">
              Exact Source Passage for AVELA Citation:
            </label>
            <textarea
              aria-label="Exact source passage" maxLength={12000}
              value={exactPassage}
              onChange={(e) => setExactPassage(e.target.value)}
              rows={2}
              className="w-full p-3 rounded-2xl border border-[#DDE5DF] text-xs focus:border-[#173F3A] focus:outline-none font-mono text-[#173F3A] bg-[#F7F8F4]"
              required
            />
          </div>

          {/* Previous version view */}
          <div className="p-3.5 rounded-2xl bg-[#F7F8F4] border border-[#DDE5DF] space-y-1">
            <span className="font-semibold text-xs text-[#596963] flex items-center gap-1">
              <History className="w-3.5 h-3.5" />
              Current Active Version {activeInstructionToEdit.version} (Author: {activeInstructionToEdit.authorName}):
            </span>
            <p className="text-xs text-[#596963] italic">
              "{activeInstructionToEdit.exactPassage}"
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-[#DDE5DF]">
            <button
              type="button"
              onClick={() => setActiveInstructionToEdit(null)}
              className="px-4 py-2 rounded-xl border border-[#DDE5DF] text-[#596963]"
            >
              Discard Changes
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-2xl bg-[#173F3A] text-white font-semibold flex items-center gap-2 hover:bg-[#122e2b]"
            >
              <Check className="w-4 h-4" />
              <span>Publish Version {activeInstructionToEdit.version + 1}</span>
            </button>
          </div>
        </form>
      </div>
    </ModalShell>
  )
}


export const InstructionEditorModal = () => {
  const {activeInstructionToEdit} = useAvela()
  return activeInstructionToEdit ? <InstructionEditorContent key={activeInstructionToEdit.id + ':' + activeInstructionToEdit.version}/> : null
}
