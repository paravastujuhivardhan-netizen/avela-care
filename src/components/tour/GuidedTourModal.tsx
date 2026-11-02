import { useState } from 'react'
import { Sparkles, ArrowRight, X } from 'lucide-react'
import { useAvela } from '../../context/AvelaContext'

export const GuidedTourModal = () => {
  const ctx = useAvela()
  const [busy, setBusy] = useState(false)
  if (!ctx.tourActive) return null
  const steps = [
    { title: 'Everyday guidance, with a source.', description: 'Ask about Priya’s caffeine instruction. AVELA explains the existing plan and links the exact passage.', action: 'Try a routine question' },
    { title: 'Know when a person should review.', description: 'A request to change medication needs the care team. AVELA prepares a draft; you review and send it when ready.', action: 'Prepare a review draft' },
    { title: 'A clear clinical handoff.', description: 'The clinician inbox contains sent requests and urgent demo events. Preparing a draft alone does not send it.', action: 'Explore the clinician inbox' },
    { title: 'Emergency help stays within reach.', description: 'The final example shows immediate emergency guidance and a simulated audit entry. No real call is placed.', action: 'Try the emergency demo' },
  ]
  const step = steps[ctx.tourStep - 1] || steps[0]
  const run = async () => {
    setBusy(true)
    try {
      if (ctx.tourStep === 1) {ctx.openChat('patient-priya'); await ctx.sendMessage('What are my caffeine instructions?', 'patient-priya')}
      if (ctx.tourStep === 2) {ctx.openChat('patient-priya'); await ctx.sendMessage('Can I double my medicine dose tonight?', 'patient-priya')}
      if (ctx.tourStep === 3) ctx.setPerspective('clinician')
      if (ctx.tourStep === 4) {ctx.endTour(); ctx.openChat('patient-priya', 'I have severe chest pain and trouble breathing right now.'); return}
      ctx.nextTourStep()
    } finally {setBusy(false)}
  }
  return <aside role="complementary" aria-label="Guided demo tour" className="fixed top-4 right-4 z-40 w-[min(24rem,calc(100vw-2rem))] bg-white border-2 border-[#52776C] rounded-3xl p-5 shadow-xl">
    <div className="flex items-center justify-between gap-2"><span className="font-semibold text-sm flex items-center gap-2"><Sparkles size={16}/> Guided tour · {ctx.tourStep} of 4</span><button className="icon-button" aria-label="Close guided tour" onClick={ctx.endTour}><X size={17}/></button></div>
    <h2 className="font-editorial text-xl mt-3">{step.title}</h2><p className="text-sm leading-relaxed text-[#596963] mt-2">{step.description}</p>
    <div className="flex flex-wrap justify-between items-center gap-3 mt-4"><button className="text-sm underline min-h-[44px]" onClick={ctx.endTour}>Dismiss</button><button className="primary-button" disabled={busy} onClick={() => void run()}>{step.action}<ArrowRight size={15}/></button></div>
  </aside>
}
