import { ModalShell } from '../common/ModalShell'
import React from 'react'
import { useAvela } from '../../context/AvelaContext'
import { ArrowRight, X } from 'lucide-react'

export const OnboardingModal: React.FC = () => {
  const { 
    isOnboardingOpen, 
    setIsOnboardingOpen, 
    selectedPatientId, 
    setSelectedPatientId, 
    patients,
    language,
    setLanguage,
    largeTextMode,
    setLargeTextMode,
    setPatientTab,
    setPerspective
  } = useAvela()


  if (!isOnboardingOpen) return null

  const handleFinish = () => {
    setIsOnboardingOpen(false)
    setPerspective('patient')
    setPatientTab('home')
  }

  return (
    <ModalShell onClose={() => setIsOnboardingOpen(false)} label="Demo onboarding" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#173F3A]/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white border border-[#DDE5DF] rounded-3xl w-full max-w-xl overflow-y-auto flex flex-col shadow-2xl"
        role="dialog"
        aria-modal="true"
      >
        <div className="px-6 py-5 border-b border-[#DDE5DF] bg-[#F7F8F4] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-editorial font-bold text-lg text-[#173F3A]">
              Welcome to AVELA · Quick Demo Setup
            </span>
          </div>
          <button
            aria-label="Close dialog" onClick={() => setIsOnboardingOpen(false)}
            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-[#596963]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-6 text-xs text-[#173F3A]">
          {/* Step 1: Select Demo Patient */}
          <div>
            <label className="font-semibold text-sm text-[#173F3A] block mb-2">
              1. Select a Fictional Patient Profile:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(['patient-priya', 'patient-marcus'] as const).map(pid => {
                const p = patients[pid]
                const isSelected = selectedPatientId === pid
                return (
                  <button
                    key={pid}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => setSelectedPatientId(pid)}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      isSelected 
                        ? 'border-[#173F3A] bg-[#E8F0E9] ring-2 ring-[#173F3A]/20' 
                        : 'border-[#DDE5DF] bg-white hover:border-[#173F3A]/50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 mb-1.5">
                      <div className="w-7 h-7 rounded-full bg-[#173F3A] text-white flex items-center justify-center font-bold text-xs">
                        {p.avatarInitials}
                      </div>
                      <span className="font-semibold text-sm text-[#173F3A]">{p.name}</span>
                    </div>
                    <p className="text-[11px] text-[#596963] line-clamp-2">
                      {p.conditions.join(', ')}
                    </p>
                    <span className="mt-2 block text-[10px] text-[#173F3A] font-medium">
                      {pid === 'patient-priya' ? 'Has explicit caffeine instruction' : 'No caffeine instruction in care plan'}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Step 2: Language & Accessibility */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-xs text-[#173F3A] block mb-1.5">
                Language:
              </label>
              <div className="flex rounded-xl border border-[#DDE5DF] p-1 bg-[#F7F8F4] text-xs">
                {(['en', 'hi', 'te'] as const).map(lang => (
                  <button
                    key={lang}
                    aria-pressed={language === lang}
                    onClick={() => setLanguage(lang)}
                    className={`flex-1 py-1 rounded-lg font-medium transition-colors ${
                      language === lang ? 'bg-[#173F3A] text-white' : 'text-[#596963]'
                    }`}
                  >
                    {lang === 'en' ? 'English' : lang === 'hi' ? 'हिंदी' : 'తెలుగు'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="font-semibold text-xs text-[#173F3A] block mb-1.5">
                Display Mode:
              </label>
              <button
                aria-pressed={largeTextMode}
                onClick={() => setLargeTextMode(!largeTextMode)}
                className={`w-full py-2 px-3 rounded-xl border text-xs font-medium text-left transition-colors ${
                  largeTextMode ? 'bg-[#E8F0E9] border-[#173F3A] text-[#173F3A]' : 'border-[#DDE5DF] text-[#596963]'
                }`}
              >
                {largeTextMode ? '✓ Large Text Enabled' : 'Standard Text Size'}
              </button>
            </div>
          </div>

          {/* Privacy reassurance */}
          <div className="p-3.5 rounded-2xl bg-[#F7F8F4] border border-[#DDE5DF] text-[11px] text-[#596963] leading-relaxed">
            <strong className="text-[#173F3A]">No real personal data required:</strong> Demo data stays in this browser. Interface labels can be localized; record content and most responses remain in English.
          </div>
        </div>

        <div className="px-6 py-4 border-t border-[#DDE5DF] bg-[#F7F8F4] flex justify-between items-center text-xs">
          <button
            onClick={handleFinish}
            className="text-[#596963] hover:underline"
          >
            Skip setup
          </button>
          <button
            onClick={handleFinish}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-2xl bg-[#173F3A] text-white font-semibold hover:bg-[#122e2b] shadow-xs"
          >
            <span>Start Exploring</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </ModalShell>
  )
}

