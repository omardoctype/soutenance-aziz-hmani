import { motion } from 'framer-motion'
import { GraduationCap, Trophy } from 'lucide-react'

export const InvitationSection = () => (
  <section
    id="invitation"
    className="scroll-mt-24"
  >
    <div className="relative overflow-hidden rounded-[2rem] border border-slate-200/75 bg-white/92 shadow-[0_28px_80px_rgba(16,40,70,0.1)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(198,167,105,0.2),transparent_22%),radial-gradient(circle_at_88%_0%,rgba(16,40,70,0.1),transparent_20%),linear-gradient(180deg,rgba(255,255,255,0.3),rgba(255,255,255,0))]" />

      <div className="relative px-4 py-6 sm:px-8 sm:py-9 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-gold-500/30 bg-gold-500/10 px-4 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-gold-600">
            <GraduationCap className="h-4 w-4" />
            Invitation
          </div>

          <h2 className="mt-4 font-display text-3xl leading-tight text-navy-900 sm:text-5xl">
            Famille, amis, votre présence me ferait très plaisir !
          </h2>

          <div className="mt-6 flex items-center justify-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-slate-500">
            <Trophy className="h-4 w-4 text-gold-600" />
            Soutenance Wiem Zouaoui - International School of Business
          </div>
        </motion.div>
      </div>
    </div>
  </section>
)
