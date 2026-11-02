import { processPatientQuery } from '../../engine/routing'
import React, { useState } from 'react'
import { useAvela } from '../../context/AvelaContext'
import { AvelaLogo } from '../common/AvelaLogo'
import { PathwayBadge } from '../common/PathwayBadge'
import { ArrowRight, CheckCircle2, ShieldCheck, Clock, AlertOctagon, Sparkles, Lock } from 'lucide-react'

export const LandingPage: React.FC = () => {
  const { 
    setPerspective, 
    setPatientTab, 
    patients, 
    startTour,
    openChat,
    setActiveCitation,
    demoTime 
  } = useAvela()

  // Interactive Hero Preview state
  const [heroTab, setHeroTab] = useState<'routine' | 'review' | 'emergency'>('routine')

  const scenarios = {
    routine: {patientId: 'patient-priya' as const, question: 'What are my caffeine instructions?'},
    review: {patientId: 'patient-marcus' as const, question: 'Can I drink a cup of coffee right now?'},
    emergency: {patientId: 'patient-priya' as const, question: 'I feel intense crushing chest pressure radiating down my left arm.'}
  }
  const scenario = scenarios[heroTab]
  const previewPatient = patients[scenario.patientId]
  const preview = processPatientQuery(previewPatient, scenario.question, demoTime)
  const source = preview.citations[0]
  const currentHero = {
    patient: previewPatient.name + ', ' + previewPatient.age,
    time: demoTime + ' IST',
    question: scenario.question,
    pathway: preview.pathway,
    explanation: preview.responseText,
  }

  const faqs = [
    {
      q: 'Does AVELA diagnose conditions or change medication doses?',
      a: 'No. This prototype displays fictional care instructions and demonstrates handoffs for example questions. It does not provide a diagnosis, change a prescription, or notify a real clinician.'
    },
    {
      q: 'What happens if a patient asks an emergency question late at night?',
      a: 'The demo displays emergency guidance immediately, independent of quiet hours. It offers a direct call link to 112 in India. Elsewhere, use your local emergency number. It does not place calls or notify a real clinician.'
    },
    {
      q: 'Why does the same question yield different answers for different patients?',
      a: 'The demo uses different fictional care plans. Priya has a sample caffeine instruction; Marcus does not, so the prototype offers a simulated review handoff.'
    },
    {
      q: 'Can patients bypass AVELA to contact their doctor directly?',
      a: 'Yes. The prototype includes a direct care-team demo and an emergency call link. The care-team inbox is simulated and does not contact a real clinic.'
    }
  ]

  return (
    <div className="min-h-screen bg-[#F7F8F4] text-[#173F3A]">
      {/* Navigation Header */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-[#DDE5DF]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-3">
          <AvelaLogo size="md" showTagline={false} />

          <nav className="hidden md:flex items-center gap-7 text-xs sm:text-sm font-medium text-[#596963]">
            <a href="#how-it-works" className="hover:text-[#173F3A] transition-colors">How it works</a>
            <a href="#for-patients" className="hover:text-[#173F3A] transition-colors">For patients</a>
            <a href="#for-clinicians" className="hover:text-[#173F3A] transition-colors">For clinicians</a>
            <a href="#privacy" className="hover:text-[#173F3A] transition-colors">Privacy</a>
            <a href="#faq" className="hover:text-[#173F3A] transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setPerspective('patient')
                setPatientTab('chat')
              }}
              className="px-4 py-2 rounded-2xl bg-[#173F3A] text-white text-xs sm:text-sm font-semibold hover:bg-[#122e2b] shadow-xs transition-colors"
            >
              Try the patient experience
            </button>
            <button
              onClick={() => setPerspective('clinician')}
              className="hidden sm:inline-flex px-3.5 py-2 rounded-2xl border border-[#DDE5DF] text-[#173F3A] text-xs sm:text-sm font-semibold hover:bg-[#E8F0E9] transition-colors"
            >
              Clinician workspace
            </button>
          </div>
        </div>
      </header>

      {/* Spacious Asymmetric Hero Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 sm:pt-20 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Hero Column: Typography & CTAs (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E8F0E9] text-[#173F3A] text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#173F3A]" />
              Personalized Patient Care Companion & Clinician Triage
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-editorial font-bold text-[#173F3A] tracking-tight leading-[1.12]">
              Care doesn’t end when the appointment does.
            </h1>

            <p className="text-lg sm:text-xl text-[#596963] leading-relaxed max-w-xl">
              Understand your care plan, ask everyday questions, and reach your care team when you need them.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => {
                  setPerspective('patient')
                  setPatientTab('chat')
                }}
                className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#173F3A] text-white font-semibold text-sm sm:text-base hover:bg-[#122e2b] shadow-sm hover:shadow transition-all active:scale-98"
              >
                <span>Try the patient experience</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setPerspective('clinician')}
                className="px-5 py-3.5 rounded-2xl bg-white border border-[#DDE5DF] text-[#173F3A] font-semibold text-sm sm:text-base hover:bg-[#E8F0E9] transition-colors"
              >
                Explore clinician workspace
              </button>

              <button
                onClick={startTour}
                className="px-4 py-3.5 rounded-2xl text-xs font-medium text-[#596963] hover:text-[#173F3A] flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4 text-[#173F3A]" />
                <span>1-Min Tour</span>
              </button>
            </div>

            <button className="emergency-demo-button" onClick={() => openChat('patient-priya', scenarios.emergency.question)}><AlertOctagon size={17}/> Try the emergency demo</button>
            <p className="text-xs text-[#596963]">Interactive prototype · fictional patients · no real clinical monitoring</p>

            <div className="pt-4 flex flex-wrap items-center gap-4 text-xs text-[#596963]">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#173F3A]" />
                Record-linked explanations
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#173F3A]" />
                Direct care-team access
              </span>
            </div>
          </div>

          {/* Right Hero Column: Working Live Product Preview (5 cols) */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl border-2 border-[#DDE5DF] shadow-xl p-5 sm:p-6 space-y-4">
              {/* Preview Tab Switcher */}
              <div className="flex flex-wrap gap-2 items-center justify-between border-b border-[#DDE5DF] pb-3">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#596963]">
                  Interactive Preview
                </span>
                <div className="flex gap-1 bg-[#F7F8F4] p-1 rounded-xl">
                  <button
                    aria-pressed={heroTab === 'routine'} onClick={() => setHeroTab('routine')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                      heroTab === 'routine' ? 'bg-[#173F3A] text-white' : 'text-[#596963]'
                    }`}
                  >
                    Everyday
                  </button>
                  <button
                    aria-pressed={heroTab === 'review'} onClick={() => setHeroTab('review')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                      heroTab === 'review' ? 'bg-[#173F3A] text-white' : 'text-[#596963]'
                    }`}
                  >
                    Needs Review
                  </button>
                  <button
                    aria-pressed={heroTab === 'emergency'} onClick={() => setHeroTab('emergency')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                      heroTab === 'emergency' ? 'bg-[#173F3A] text-white' : 'text-[#596963]'
                    }`}
                  >
                    Urgent
                  </button>
                </div>
              </div>

              {/* Simulation Meta Header */}
              <div className="flex flex-wrap gap-2 items-center justify-between text-xs text-[#596963]">
                <span>Patient: <strong>{currentHero.patient}</strong></span>
                <span className="flex items-center gap-1 font-mono">
                  <Clock className="w-3.5 h-3.5" />
                  {currentHero.time}
                </span>
              </div>

              {/* Patient Message */}
              <div className="flex justify-end">
                <div className="bg-[#173F3A] text-white text-xs sm:text-sm p-3.5 rounded-2xl rounded-tr-xs max-w-[90%] leading-relaxed">
                  "{currentHero.question}"
                </div>
              </div>

              {/* AVELA Response */}
              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-editorial text-[#173F3A]">AVELA</span>
                  <PathwayBadge pathway={currentHero.pathway} size="sm" />
                </div>

                <div className="text-xs text-[#173F3A] leading-relaxed bg-[#F7F8F4] p-3.5 rounded-2xl border border-[#DDE5DF]">
                  {currentHero.explanation}
                </div>

                {source ? <button className="w-full text-left p-3 rounded-2xl bg-[#E8F0E9]/70 border border-[#CADBD0] text-xs space-y-2" onClick={() => setActiveCitation(source)}>
                  <span className="font-semibold block">View source: {source.title}</span>
                  <span className="block text-[#596963]">{source.author} · {source.date}</span>
                  <span className="block leading-relaxed line-clamp-2">“{source.exactPassage}”</span>
                </button> : <p className="p-3 rounded-2xl bg-[#FFFBEB] text-sm text-[#92400E] border border-[#EAD6AB]">No instruction authorizes an answer to this question. A review draft is prepared for the care team.</p>}

              </div>

              {/* Try this live CTA inside preview */}
              <button
                onClick={() => openChat(scenario.patientId, scenario.question)}
                className="w-full py-2.5 rounded-xl bg-[#F7F8F4] hover:bg-[#E8F0E9] border border-[#DDE5DF] text-xs font-semibold text-[#173F3A] text-center transition-colors block"
              >
                Open in Full Patient Chat →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Editorial Section 1: Your Care, in Context */}
      <section id="how-it-works" className="py-16 border-t border-[#DDE5DF] bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#173F3A]">
              01 · The Engine
            </span>
            <h2 className="text-3xl sm:text-4xl font-editorial font-bold text-[#173F3A] mt-2">
              Your care, in context.
            </h2>
            <p className="text-base text-[#596963] mt-3 leading-relaxed">
              Explore how a care companion could bring instructions, allergies, and medication records together using fictional patient profiles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#F7F8F4] p-6 rounded-3xl border border-[#DDE5DF] space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-[#E8F0E9] text-[#173F3A] flex items-center justify-center font-bold">
                1
              </div>
              <h3 className="font-editorial font-bold text-lg text-[#173F3A]">
                Care-plan retrieval
              </h3>
              <p className="text-xs text-[#596963] leading-relaxed">
                The demo retrieves sample care instructions and shows their supporting source.
              </p>
            </div>

            <div className="bg-[#F7F8F4] p-6 rounded-3xl border border-[#DDE5DF] space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-[#FEF3C7] text-[#92400E] flex items-center justify-center font-bold">
                2
              </div>
              <h3 className="font-editorial font-bold text-lg text-[#173F3A]">
                Honest boundary checks
              </h3>
              <p className="text-xs text-[#596963] leading-relaxed">
                When sample instructions are missing or need clinical judgment, the demo offers a review handoff.
              </p>
            </div>

            <div className="bg-[#F7F8F4] p-6 rounded-3xl border border-[#DDE5DF] space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-[#FEE2E2] text-[#991B1B] flex items-center justify-center font-bold">
                3
              </div>
              <h3 className="font-editorial font-bold text-lg text-[#173F3A]">
                Independent emergency routing
              </h3>
              <p className="text-xs text-[#596963] leading-relaxed">
                The included red-flag examples display emergency guidance without waiting for Groq.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Editorial Section 2: Clear answers, with sources */}
      <section id="for-patients" className="py-16 border-t border-[#DDE5DF] bg-[#F7F8F4]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-5">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#173F3A]">
              02 · Traceability
            </span>
            <h2 className="text-3xl sm:text-4xl font-editorial font-bold text-[#173F3A]">
              Clear answers, with sources.
            </h2>
            <p className="text-base text-[#596963] leading-relaxed">
              Supported demo responses link to their fictional source. Open a citation to see the sample passage, author, and date.
            </p>
            <div className="pt-2">
              <button
                onClick={() => {
                  setPerspective('patient')
                  setPatientTab('careplan')
                }}
                className="px-5 py-2.5 rounded-2xl bg-[#173F3A] text-white text-xs sm:text-sm font-semibold hover:bg-[#122e2b] transition-colors"
              >
                Inspect Sample Care Plan Records
              </button>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="bg-white rounded-3xl border border-[#DDE5DF] p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#173F3A]">
                <ShieldCheck className="w-4 h-4 text-[#173F3A]" />
                <span>Signature Interaction: Connected Evidence Card</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#FBF2ED] border border-[#F4D8CA] text-xs space-y-2">
                <span className="font-semibold text-[#C2410C] uppercase tracking-wider block text-[10px]">
                  Cited Instruction Passage:
                </span>
                <p className="text-sm font-semibold text-[#173F3A] bg-white p-3 rounded-xl border border-[#F4D8CA]">
                  “{patients["patient-priya"].instructions.find(item => item.id === "inst-p1")?.content}”
                </p>
                <div className="flex items-center justify-between text-[11px] text-[#596963] pt-1">
                  <span>Author: <strong>Dr. Ananya Sen, MD</strong></span>
                  <span>Issued: 14 Oct 2026</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Editorial Section 3: A Prepared Handoff */}
      <section id="for-clinicians" className="py-16 border-t border-[#DDE5DF] bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 order-2 lg:order-1">
            <div className="bg-[#F7F8F4] rounded-3xl border border-[#DDE5DF] p-6 shadow-sm space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-[#DDE5DF]">
                <span className="font-bold text-xs uppercase tracking-wider text-[#173F3A]">
                  Structured Clinician Handoff
                </span>
                <span className="bg-[#FEF3C7] text-[#92400E] px-2 py-0.5 rounded-full font-semibold text-[10px]">
                  Editable by Patient
                </span>
              </div>

              <div className="space-y-1.5">
                <strong className="text-[#173F3A]">Reported Concern:</strong>
                <p className="text-[#596963] bg-white p-2 rounded-lg border border-[#DDE5DF]">
                  "Patient asking if Omeprazole can be taken twice daily due to evening reflux."
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <strong className="text-[#596963]">Relevant History:</strong>
                  <p className="text-[#173F3A]">Hypertension, GERD</p>
                </div>
                <div>
                  <strong className="text-[#596963]">Active Meds:</strong>
                  <p className="text-[#173F3A]">Amlodipine 5mg, Omeprazole 20mg</p>
                </div>
              </div>

              <div className="pt-2">
                <strong className="text-[#B45309]">Missing Information:</strong>
                <p className="text-[#92400E]">Self-adjustment of PPI frequency not authorized on record.</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 order-1 lg:order-2 space-y-5">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#173F3A]">
              03 · Human Triage
            </span>
            <h2 className="text-3xl sm:text-4xl font-editorial font-bold text-[#173F3A]">
              A prepared handoff.
            </h2>
            <p className="text-base text-[#596963] leading-relaxed">
              Explore a simulated clinician inbox with patient-confirmed concerns, relevant sample records, and what AVELA displayed. No real messages are sent.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setPerspective('clinician')}
                className="px-5 py-2.5 rounded-2xl bg-[#173F3A] text-white text-xs sm:text-sm font-semibold hover:bg-[#122e2b] transition-colors"
              >
                Open Clinician Workspace
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Section */}
      <section id="privacy" className="py-16 border-t border-[#DDE5DF] bg-[#F7F8F4]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[#E8F0E9] text-[#173F3A] flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-editorial font-bold text-[#173F3A]">
            Privacy & Clinical Safety Principles
          </h2>
          <p className="text-sm text-[#596963] max-w-xl mx-auto leading-relaxed">
            This prototype uses fictional patient data and is not a validated medical service. Do not enter real health information. Some questions and sample instructions are sent to Groq to select an excerpt; the full sample instruction remains visible. No real clinicians are notified. Demo data persists in this browser and can be reset from Demo mode.
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 border-t border-[#DDE5DF] bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-editorial font-bold text-[#173F3A]">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-[#F7F8F4] border border-[#DDE5DF] space-y-2">
                <h3 className="font-semibold text-sm text-[#173F3A]">
                  {faq.q}
                </h3>
                <p className="text-xs sm:text-sm text-[#596963] leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Demo Call to Action */}
      <section className="py-20 border-t border-[#DDE5DF] bg-[#E8F0E9] text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-editorial font-bold text-[#173F3A]">
            Experience AVELA in Action
          </h2>
          <p className="text-base text-[#596963] max-w-xl mx-auto">
            Explore both the patient care companion and the connected clinician workspace using our seeded fictional patients.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => {
                setPerspective('patient')
                setPatientTab('chat')
              }}
              className="px-6 py-3.5 rounded-2xl bg-[#173F3A] text-white font-semibold text-sm sm:text-base hover:bg-[#122e2b] shadow-sm"
            >
              Start Patient Experience
            </button>
            <button
              onClick={() => setPerspective('clinician')}
              className="px-6 py-3.5 rounded-2xl bg-white border border-[#DDE5DF] text-[#173F3A] font-semibold text-sm sm:text-base hover:bg-gray-50"
            >
              Open Clinician Triage
            </button>
          </div>
        </div>
      </section>

      {/* Understated Light Footer */}
      <footer className="py-8 border-t border-[#DDE5DF] bg-white text-xs text-[#596963]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AvelaLogo size="sm" showTagline={false} />
            <span>Interactive Prototype · Fictional Patient Data · Simulated Communications</span>
          </div>
          <div>
            Design & Engineering Demonstration · Responsive Product Demonstration
          </div>
        </div>
      </footer>
    </div>
  )
}

