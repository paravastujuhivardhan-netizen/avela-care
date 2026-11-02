import { ModalShell } from '../common/ModalShell'
import { requestStatusLabel } from '../../engine/session'
import React, { useState } from 'react'
import { useAvela } from '../../context/AvelaContext'
import { Pill, FileText, Clock, Send, Calendar, ChevronRight } from 'lucide-react'

export const PatientHome: React.FC = () => {
  const { 
    currentPatient, 
    setPatientTab, 
    sendMessage, 
    requests, 
    demoTime, 
    demoDate,
    t,
    completePendingCheckIn
  } = useAvela()

  const [inputQuery, setInputQuery] = useState('')
  const [checkInOpen, setCheckInOpen] = useState(false)
  const [checkInNotes, setCheckInNotes] = useState('')

  // Greeting time logic based on demoTime
  const hour = parseInt(demoTime.split(':')[0], 10)
  const greeting = hour >= 18 || hour < 5 ? 'Good evening' : hour < 12 ? 'Good morning' : 'Good afternoon'

  // Specific suggested questions for current patient
  const suggestedQueries = currentPatient.id === 'patient-priya' 
    ? [
        'Can I have a cup of coffee right now?',
        'I forgot my morning Amlodipine tablet. What should I do?',
        'When am I supposed to log my blood pressure for Nurse Sarah?'
      ]
    : [
        'Can I drink a cup of coffee right now?',
        'How much weight can I put on my right leg with crutches?',
        'How often and how long should I use the ice pack on my knee?'
      ]

  const handleComposerSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputQuery.trim()) return
    const query = inputQuery.trim()
    setInputQuery('')
    setPatientTab('chat')
    sendMessage(query)
  }

  const handleSuggestedClick = (q: string) => {
    setPatientTab('chat')
    sendMessage(q)
  }

  // Filter requests for current patient
  const patientRequests = requests.filter(r => r.patientId === currentPatient.id)

  // Status mapping
  const statusBadges = {
    'draft': { label: 'Draft', color: 'bg-gray-100 text-gray-700' },
    'queued': { label: 'Queued for morning triage', color: 'bg-[#FEF3C7] text-[#92400E]' },
    'sent-in-demo': { label: 'Sent in demo', color: 'bg-[#E8F0E9] text-[#173F3A]' },
    'acknowledged': { label: 'Acknowledged by clinician', color: 'bg-blue-100 text-blue-800' },
    'answered': { label: 'Answer received', color: 'bg-emerald-100 text-emerald-800' },
    'closed': { label: 'Resolved', color: 'bg-gray-100 text-gray-600' }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-in fade-in duration-300">
      {/* 1. Time-Aware Greeting Header */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F0E9] text-[#173F3A] text-xs font-semibold">
          <Clock className="w-3.5 h-3.5" />
          <span>Simulated Time: {demoTime} ({demoDate})</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-editorial font-bold text-[#173F3A] tracking-tight">
          {greeting}, {currentPatient.name.split(' ')[0]}.
        </h1>
        <p className="text-base text-[#596963] max-w-2xl leading-relaxed">
          AVELA is ready to explain your existing care instructions from {currentPatient.careTeam[0]?.name}. Ask any everyday question, or reach your care team if you need review.
        </p>
      </div>

      {/* 2. Dominant Question Composer */}
      <div className="bg-[#FFFFFF] border-2 border-[#DDE5DF] hover:border-[#173F3A] transition-all rounded-3xl p-5 sm:p-6 shadow-sm">
        <form onSubmit={handleComposerSubmit} className="space-y-4">
          <label htmlFor="home-composer" className="block text-sm font-semibold text-[#173F3A]">
            What can we help you understand right now?
          </label>
          <div className="relative">
            <textarea
              id="home-composer"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder={t.composerPlaceholder}
              rows={3}
              className="w-full p-4 pr-24 rounded-2xl bg-[#F7F8F4] border border-[#DDE5DF] focus:border-[#173F3A] focus:bg-white text-base text-[#173F3A] placeholder-[#596963]/60 focus:outline-none transition-all resize-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleComposerSubmit(e)
                }
              }}
            />
            <button
              type="submit"
              disabled={!inputQuery.trim()}
              className="absolute right-3 bottom-3 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#173F3A] hover:bg-[#122e2b] text-white text-sm font-semibold shadow-xs disabled:opacity-40 transition-all active:scale-95"
            >
              <span>{t.composerSend}</span>
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Suggested everyday questions */}
        <div className="mt-4 pt-4 border-t border-[#DDE5DF]/60">
          <span className="text-xs font-semibold text-[#596963] uppercase tracking-wider block mb-2">
            {t.composerSuggested}:
          </span>
          <div className="flex flex-wrap gap-2">
            {suggestedQueries.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSuggestedClick(q)}
                className="text-left text-xs sm:text-sm px-3.5 py-2 rounded-2xl bg-[#F7F8F4] hover:bg-[#E8F0E9] border border-[#DDE5DF] text-[#173F3A] font-medium transition-all hover:scale-[1.01] active:scale-98"
              >
                "{q}"
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Follow-up Check-in Card (if scheduled) */}
      {currentPatient.pendingCheckIn && currentPatient.pendingCheckIn.status === 'scheduled' && (
        <div className="p-5 rounded-3xl bg-[#FBF2ED] border border-[#F4D8CA] text-[#173F3A] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#C2410C] flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              Scheduled Care Follow-Up (Simulated)
            </span>
            <p className="text-sm font-semibold text-[#173F3A]">
              "{currentPatient.pendingCheckIn.prompt}"
            </p>
            <p className="text-xs text-[#596963]">
              Context: {currentPatient.pendingCheckIn.context}
            </p>
          </div>
          <button
            onClick={() => setCheckInOpen(true)}
            className="shrink-0 px-4 py-2 rounded-xl bg-[#173F3A] text-white text-xs font-semibold hover:bg-[#122e2b] shadow-2xs transition-colors"
          >
            Answer Check-in
          </button>
        </div>
      )}

      {/* 4. Two-Column Row: Latest Care Plan & Medication Schedule */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Latest Care Plan Card */}
        <div className="bg-[#FFFFFF] border border-[#DDE5DF] rounded-3xl p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#596963] flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-[#173F3A]" />
                Latest Care Plan
              </span>
              <span className="text-xs font-medium text-[#173F3A] bg-[#E8F0E9] px-2.5 py-0.5 rounded-full">
                {currentPatient.instructions[0]?.date}
              </span>
            </div>

            <h3 className="text-lg font-bold font-editorial text-[#173F3A]">
              {currentPatient.instructions[0]?.title}
            </h3>
            <p className="text-xs text-[#596963] mt-1">
              Issued by {currentPatient.instructions[0]?.authorName} ({currentPatient.instructions[0]?.authorRole})
            </p>

            <div className="mt-3.5 p-3 rounded-2xl bg-[#F7F8F4] border border-[#DDE5DF] text-xs text-[#173F3A] leading-relaxed italic line-clamp-3">
              "{currentPatient.instructions[0]?.exactPassage}"
            </div>
          </div>

          <button
            onClick={() => setPatientTab('careplan')}
            className="mt-5 flex items-center justify-between text-xs font-semibold text-[#173F3A] hover:text-[#596963] pt-3 border-t border-[#DDE5DF]/60 transition-colors"
          >
            <span>View all {currentPatient.instructions.length} care instructions</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Compact Medication Schedule */}
        <div className="bg-[#FFFFFF] border border-[#DDE5DF] rounded-3xl p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#596963] flex items-center gap-1.5">
                <Pill className="w-4 h-4 text-[#173F3A]" />
                Medication Schedule on Record
              </span>
              <span className="text-xs text-[#596963]">
                {currentPatient.medications.length} active
              </span>
            </div>

            <div className="space-y-2.5">
              {currentPatient.medications.map(med => (
                <div key={med.id} className="p-2.5 rounded-2xl bg-[#F7F8F4] border border-[#DDE5DF] flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-[#173F3A] block">{med.name} {med.dosage}</span>
                    <span className="text-[#596963] text-[11px]">{med.timing} · {med.purpose}</span>
                  </div>
                  <span className="text-[11px] font-medium text-[#173F3A] bg-[#E8F0E9] px-2 py-0.5 rounded-full shrink-0">
                    {med.frequency}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setPatientTab('records')}
            className="mt-5 flex items-center justify-between text-xs font-semibold text-[#173F3A] hover:text-[#596963] pt-3 border-t border-[#DDE5DF]/60 transition-colors"
          >
            <span>View complete medication records</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 5. Recent Requests & Honest Communication Status */}
      <div className="bg-[#FFFFFF] border border-[#DDE5DF] rounded-3xl p-5 sm:p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-editorial font-bold text-lg text-[#173F3A]">
              Care Team Communications & Open Requests
            </h3>
            <p className="text-xs text-[#596963]">
              Demo requests appear in the clinician workspace. No real notifications are sent.
            </p>
          </div>
          <button
            onClick={() => setPatientTab('careteam')}
            className="text-xs font-semibold text-[#173F3A] hover:underline"
          >
            Contact care team directly
          </button>
        </div>

        {patientRequests.length === 0 ? (
          <p className="text-xs text-[#596963] italic py-3">
            No review requests recorded yet. You can contact your care team directly at any time.
          </p>
        ) : (
          <div className="space-y-3">
            {patientRequests.map(req => {
              const badge = statusBadges[req.status] || statusBadges['draft']
              return (
                <div key={req.id} className="p-4 rounded-2xl bg-[#F7F8F4] border border-[#DDE5DF] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full font-medium text-[11px] ${badge.color}`}>
                        {requestStatusLabel(req)}
                      </span>
                      <span className="text-[#596963] text-[11px]">
                        ID: {req.id.slice(0, 10)}
                      </span>
                    </div>
                    <p className="font-semibold text-sm text-[#173F3A]">
                      "{req.patientConcern}"
                    </p>
                    {req.clinicianReplies && req.clinicianReplies.length > 0 && (
                      <div className="mt-2 p-2.5 rounded-xl bg-white border border-[#DDE5DF] text-xs text-[#173F3A]">
                        <span className="font-bold block text-[#173F3A]">
                          Reply from {req.clinicianReplies[0].clinicianName}:
                        </span>
                        <span>"{req.clinicianReplies[0].message}"</span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => setPatientTab('chat')}
                    className="shrink-0 px-3.5 py-1.5 rounded-xl bg-[#FFFFFF] border border-[#DDE5DF] hover:border-[#173F3A] text-xs font-semibold text-[#173F3A] transition-colors"
                  >
                    View in Chat
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {checkInOpen && <ModalShell label="Answer your scheduled check-in" onClose={() => setCheckInOpen(false)}>
        <div className="bg-white border border-[#DDE5DF] rounded-3xl p-6 w-full max-w-lg">
          <h2 className="text-2xl font-editorial">How are you feeling?</h2>
          <p className="text-sm text-[#596963] mt-2">{currentPatient.pendingCheckIn?.prompt}</p>
          <form className="space-y-4 mt-5" onSubmit={event => {
            event.preventDefault()
            if (!checkInNotes.trim()) return
            const text = checkInNotes.trim()
            completePendingCheckIn(text)
            setCheckInOpen(false)
            setCheckInNotes('')
            setPatientTab('chat')
            void sendMessage(text)
          }}>
            <label htmlFor="check-in-notes" className="block font-semibold text-sm">Your update or reading (fictional data only)</label>
            <textarea id="check-in-notes" value={checkInNotes} onChange={event => setCheckInNotes(event.target.value)} className="form-field" rows={4} required placeholder="Enter your own update. No readings are filled in for you."/>
            <div className="flex flex-wrap justify-end gap-2"><button type="button" className="secondary-button" onClick={() => setCheckInOpen(false)}>Cancel</button><button className="primary-button" type="submit" disabled={!checkInNotes.trim()}>Save my check-in</button></div>
          </form>
        </div>
      </ModalShell>}

      {/* 6. Understated Persistent Prototype Banner */}
      <div className="text-center py-4">
        <span className="text-xs text-[#596963] bg-[#E8F0E9]/60 px-4 py-1.5 rounded-full border border-[#DDE5DF]/60">
          Interactive prototype · fictional patient data · simulated communications
        </span>
      </div>
    </div>
  )
}

