import { motion } from 'framer-motion'
import { CalendarDays, Clock3, GraduationCap, MapPin } from 'lucide-react'

const cards = [
  {
    icon: CalendarDays,
    label: 'Date',
    value: '04/06/2026',
    accent: 'from-gold-500/16 to-white',
  },
  {
    icon: Clock3,
    label: 'Heure',
    value: '15:30',
    accent: 'from-navy-900/10 to-white',
  },
  {
    icon: MapPin,
    label: 'Lieu',
    value: 'International School of Business',
    accent: 'from-gold-500/10 to-white',
  },
]

const cardMotion = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 },
}

export const DetailsSection = () => (
  <section
    id="details"
    className="scroll-mt-24"
  >
    <div className="relative overflow-hidden rounded-[2rem] border border-slate-200/70 bg-white/92 shadow-[0_28px_80px_rgba(16,40,70,0.1)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(198,167,105,0.2),transparent_22%),radial-gradient(circle_at_86%_10%,rgba(16,40,70,0.1),transparent_20%),linear-gradient(180deg,rgba(255,255,255,0.24),rgba(255,255,255,0))]" />
      <div className="pointer-events-none absolute -right-12 bottom-6 h-44 w-44 rounded-full border border-gold-500/18 bg-[radial-gradient(circle,rgba(198,167,105,0.14),transparent_70%)]" />
      <div className="pointer-events-none absolute left-4 top-6 hidden h-24 w-24 rounded-full border border-navy-900/8 lg:block" />

      <div className="relative px-4 py-6 sm:px-8 sm:py-9 lg:px-10">
        <motion.div
          {...cardMotion}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"
        >
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold-500/30 bg-gold-500/10 px-4 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-gold-600">
              <GraduationCap className="h-4 w-4" />
              Détails
            </div>

            <h2 className="mt-4 font-display text-3xl leading-tight text-navy-900 sm:text-5xl">
              Informations de la journée
            </h2>

            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
              Votre présence rendra ce moment encore plus spécial à
              International School of Business.
            </p>
          </div>

          <div className="inline-flex items-center gap-3 self-start rounded-full border border-navy-900/10 bg-navy-900/5 px-4 py-2 text-sm text-navy-900">
            <span className="h-2.5 w-2.5 rounded-full bg-gold-500 shadow-[0_0_18px_rgba(198,167,105,0.7)]" />
            Projet de fin d&apos;études
          </div>
        </motion.div>

        <div className="mt-7 grid gap-3 sm:gap-4 md:grid-cols-3">
          {cards.map((card, index) => {
            const Icon = card.icon

            return (
              <motion.article
                key={card.label}
                {...cardMotion}
                transition={{
                  duration: 0.5,
                  delay: index * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={`group relative overflow-hidden rounded-[1.5rem] border border-slate-200/80 bg-gradient-to-br ${card.accent} p-4 shadow-[0_18px_45px_rgba(16,40,70,0.08)] sm:rounded-[1.6rem] sm:p-5`}
              >
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.92),transparent_42%)]" />
                <div className="relative z-10">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-navy-900 text-white shadow-[0_12px_24px_rgba(16,40,70,0.2)]">
                      <Icon className="h-5 w-5" />
                    </div>

                    <div className="relative h-12 w-12 opacity-80">
                      <div className="absolute inset-0 rounded-full border border-gold-500/25" />
                      <div className="absolute inset-2 rounded-full border border-navy-900/10" />
                      <div className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border border-navy-900/12" />
                    </div>
                  </div>

                  <p className="mt-5 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-slate-500 sm:mt-6 sm:text-[0.72rem]">
                    {card.label}
                  </p>
                  <p className="mt-2 font-display text-[1.72rem] text-navy-900 sm:text-3xl">
                    {card.value}
                  </p>
                </div>
              </motion.article>
            )
          })}
        </div>
      </div>
    </div>
  </section>
)
