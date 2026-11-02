import { PhoneCall, AlertOctagon } from 'lucide-react'
import { useAvela } from '../../context/AvelaContext'

export const EmergencyBanner = ({ compact = false }: { onDismiss?: () => void; compact?: boolean }) => {
  const {t} = useAvela()
  return <div role="alert" className={'bg-[#FEE2E2] border-2 border-[#FCA5A5] rounded-2xl text-[#7F1D1D] my-3 ' + (compact ? 'p-4' : 'p-4 sm:p-6')}>
    <h3 className="font-editorial text-xl font-semibold flex items-start gap-2"><AlertOctagon size={23} className="shrink-0 mt-1"/>{t.emergencyHeading}</h3>
    {!compact && <p className="text-base leading-relaxed mt-3">{t.emergencySubhead}</p>}
    <a href="tel:112" className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-[#B91C1C] text-white font-semibold min-h-[48px] px-4 py-3"><PhoneCall size={19}/>Call 112 — India</a>
    <p className="text-sm leading-relaxed mt-3">Outside India, call your local emergency number. Do not wait for a reply from this prototype.</p>
    <p className="text-sm leading-relaxed mt-3 font-semibold">No emergency services or real clinician have been contacted in this demo.</p>
  </div>
}
