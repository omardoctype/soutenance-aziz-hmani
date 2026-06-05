import { motion } from 'framer-motion'
import { ArrowRight, GraduationCap, Images } from 'lucide-react'
import posterImage from '../assets/soutenance-poster.png'

interface HeroSectionProps {
  onViewDetails: () => void
  onShareMemory: () => void
}

const sectionMotion = {
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 },
}

export const HeroSection = ({
  onViewDetails,
  onShareMemory,
}: HeroSectionProps) => (
  <section
    id="accueil"
    className="w-full max-w-[100vw] overflow-x-hidden scroll-mt-24"
  >
    <div className="mx-auto flex w-full max-w-[100vw] justify-center overflow-x-hidden">
      <div className="relative mx-auto box-border w-[calc(100vw-24px)] max-w-[430px] overflow-hidden rounded-[2rem] border border-slate-200/75 bg-white/95 shadow-[0_30px_75px_rgba(11,38,74,0.13)] md:w-full md:max-w-none">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.82),rgba(246,250,255,0.66)_60%,rgba(240,246,252,0.76))]" />

        <div className="relative grid min-w-0 gap-7 px-5 pb-7 pt-8 sm:px-6 sm:pb-8 sm:pt-9 md:grid-cols-[1.03fr_0.97fr] md:items-center md:gap-10 md:px-10 md:py-10 lg:px-12 lg:py-12">
          <motion.div
            {...sectionMotion}
            transition={{ duration: 0.52, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 mx-auto flex w-full max-w-full min-w-0 flex-col items-center text-center"
          >
            <p className="mx-auto inline-flex max-w-full min-w-0 items-center justify-center gap-2 rounded-full border border-gold-500/35 bg-gold-500/10 px-3.5 py-2 text-center text-[0.64rem] font-semibold uppercase tracking-[clamp(0.08em,1vw,0.18em)] text-gold-600 sm:px-4">
              <GraduationCap className="h-4 w-4 shrink-0" />
              <span className="min-w-0 text-center">ISB</span>
            </p>

            <p className="mx-auto mt-4 max-w-full px-1 text-center text-[0.68rem] font-semibold uppercase leading-relaxed tracking-[0.08em] text-slate-500 sm:text-[0.72rem] sm:tracking-[0.14em]">
              International School of Business
            </p>

            <h1 className="mx-auto mt-4 max-w-full overflow-visible whitespace-normal text-center font-display text-[clamp(2.1rem,9.2vw,4rem)] leading-[1.05] tracking-[clamp(0.02em,0.55vw,0.14em)] text-[#071B3A]">
              SOUTENANCE
            </h1>

            <p className="mx-auto mt-4 max-w-full text-center font-script text-[clamp(2.2rem,10.4vw,4.2rem)] leading-[1] text-gold-600">
              Wiem Zouaoui
            </p>

            <p className="mx-auto mt-4 inline-flex max-w-full items-center justify-center rounded-full border border-gold-500/35 bg-white/80 px-3.5 py-2 text-center text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-navy-900 sm:px-4 sm:tracking-[0.18em]">
              Projet de fin d&apos;études
            </p>

            <p className="mx-auto mt-5 max-w-full break-words px-1 text-center text-[0.93rem] leading-[1.6] text-slate-600 sm:text-[0.98rem] md:text-base">
              Un moment important que j&apos;aimerais partager avec vous.
            </p>

            <div className="mx-auto mt-7 flex w-full max-w-full flex-col items-center justify-center gap-3 sm:max-w-[22rem] md:max-w-[29rem] md:flex-row">
              <button
                type="button"
                onClick={onViewDetails}
                className="box-border inline-flex min-h-12 w-full max-w-full touch-manipulation items-center justify-center gap-2 rounded-full bg-[#071B3A] px-4 py-3 text-center text-sm font-semibold text-white shadow-[0_14px_30px_rgba(7,27,58,0.24)] transition-colors hover:bg-[#0B4EA2] md:flex-1"
              >
                Voir les détails
                <ArrowRight className="h-4 w-4 shrink-0" />
              </button>

              <button
                type="button"
                onClick={onShareMemory}
                className="box-border inline-flex min-h-12 w-full max-w-full touch-manipulation items-center justify-center gap-2 rounded-full border border-gold-500/45 bg-white px-4 py-3 text-center text-sm font-semibold text-[#071B3A] transition-colors hover:bg-gold-500/10 md:flex-1"
              >
                Partager un souvenir
                <Images className="h-4 w-4 shrink-0" />
              </button>
            </div>
          </motion.div>

          <motion.div
            {...sectionMotion}
            transition={{ duration: 0.56, delay: 0.04, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 mx-auto w-full max-w-full min-w-0 md:max-w-[26rem] lg:max-w-[28rem]"
          >
            <div className="relative mx-auto w-full rounded-[2rem] border border-[#071B3A]/15 bg-[linear-gradient(170deg,#ffffff_0%,#f6f8fc_52%,#ecf1f8_100%)] p-2.5 shadow-[0_24px_55px_rgba(7,27,58,0.18)]">
              <div className="overflow-hidden rounded-[1.5rem] border border-white/80 bg-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.7)]">
                <img
                  src={posterImage}
                  alt="Affiche officielle de la soutenance Wiem Zouaoui"
                  className="aspect-[10/16] w-full object-contain bg-[#f8fafc]"
                  loading="eager"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  </section>
)
