import { GraduationCap } from 'lucide-react'
import { MemorySection } from '../components/MemorySection'

interface SouvenirsPageProps {
  visitorName: string | null
}

export const SouvenirsPage = ({ visitorName }: SouvenirsPageProps) => (
  <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 sm:gap-8">
    <section className="rounded-[1.8rem] border border-slate-200/75 bg-white/92 px-4 py-5 shadow-[0_20px_50px_rgba(16,40,70,0.08)] sm:px-6 sm:py-6">
      <div className="inline-flex items-center gap-2 rounded-full border border-gold-500/30 bg-gold-500/10 px-4 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-gold-600">
        <GraduationCap className="h-4 w-4" />
        Invitation
      </div>

      <p className="mt-4 font-display text-2xl leading-tight text-navy-900 sm:text-3xl">
        Famille, amis, votre presence me ferait tres plaisir !
      </p>

      <p className="mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 sm:text-sm">
        Soutenance Aziz Hmani - ISSEP Sfax
      </p>
    </section>

    <MemorySection visitorName={visitorName} />
  </div>
)
