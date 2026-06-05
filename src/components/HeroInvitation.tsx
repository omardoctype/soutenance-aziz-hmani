import { motion } from 'framer-motion'
import { CalendarDays, Clock3, MapPin } from 'lucide-react'

interface HeroInvitationProps {
  onExploreMemories: () => void
}

export const HeroInvitation = ({ onExploreMemories }: HeroInvitationProps) => (
  <section id="home">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white/92 p-6 shadow-[0_36px_80px_rgba(16,40,70,0.1)] sm:p-9"
    >
      <div className="pointer-events-none absolute -right-14 -top-12 h-44 w-44 rounded-full bg-gold-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -left-16 -bottom-20 h-52 w-52 rounded-full bg-navy-900/10 blur-3xl" />

      <div className="relative z-10">
        <p className="inline-flex rounded-full border border-gold-500/45 bg-gold-500/15 px-4 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-gold-600">
          Invitation officielle
        </p>

        <h1 className="mt-4 max-w-3xl font-display text-4xl leading-tight text-navy-900 sm:text-5xl lg:text-6xl">
          Projet de fin d&apos;études de Wiem Zouaoui
        </h1>

        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
          Vous êtes invité à la soutenance de Wiem Zouaoui à International
          School of Business. Merci de célébrer ce moment avec nous et de
          partager vos souvenirs dans la galerie collective.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-mist-50/85 p-4">
            <CalendarDays className="mb-2 h-5 w-5 text-gold-600" />
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Date
            </p>
            <p className="mt-1 text-sm font-semibold text-navy-900">
              05-06-2026
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-mist-50/85 p-4">
            <Clock3 className="mb-2 h-5 w-5 text-gold-600" />
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Horaire
            </p>
            <p className="mt-1 text-sm font-semibold text-navy-900">
              14:00
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-mist-50/85 p-4">
            <MapPin className="mb-2 h-5 w-5 text-gold-600" />
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Lieu
            </p>
            <p className="mt-1 text-sm font-semibold text-navy-900">
              International School of Business
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onExploreMemories}
          className="mt-7 inline-flex items-center justify-center rounded-full bg-navy-900 px-6 py-3 text-sm font-semibold tracking-wide text-white transition-colors hover:bg-navy-800"
        >
          Partager un souvenir
        </button>
      </div>
    </motion.div>
  </section>
)
