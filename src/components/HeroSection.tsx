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
    className="scroll-mt-24"
  >
    <div className="relative mx-auto w-[calc(100%-24px)] max-w-[430px] overflow-hidden rounded-[2rem] border border-slate-200/75 bg-white/95 shadow-[0_30px_75px_rgba(11,38,74,0.13)] md:w-full md:max-w-none">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_8%,rgba(214,177,94,0.22),transparent_28%),radial-gradient(circle_at_90%_0%,rgba(7,27,58,0.12),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.65),rgba(255,255,255,0.35)_55%,rgba(243,246,252,0.55))]" />

      <div className="relative grid gap-8 px-4 py-6 sm:px-7 sm:py-8 md:grid-cols-[1.03fr_0.97fr] md:items-center md:gap-10 md:px-9 md:py-10 lg:px-12 lg:py-12">
        <motion.div
          {...sectionMotion}
          transition={{ duration: 0.52, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 mx-auto w-full max-w-full text-center md:mx-0 md:text-left"
        >
          <p className="mx-auto inline-flex max-w-full items-center gap-2 rounded-full border border-gold-500/35 bg-gold-500/10 px-4 py-2 text-[0.64rem] font-semibold uppercase tracking-[0.22em] text-gold-600 md:mx-0 md:text-[0.66rem]">
            <GraduationCap className="h-4 w-4 shrink-0" />
            <span className="truncate">ISSEP SFAX</span>
          </p>

          <p className="mx-auto mt-4 max-w-[28rem] text-[0.67rem] font-semibold uppercase leading-relaxed tracking-[0.18em] text-slate-500 sm:text-[0.72rem] md:mx-0">
            Institut Supérieur du Sport et de l&apos;Éducation Physique
          </p>

          <h1 className="mx-auto mt-4 max-w-full font-display text-[clamp(1.85rem,11.5vw,5.2rem)] leading-[0.94] tracking-[0.065em] text-[#071B3A] md:mx-0 md:tracking-[0.1em]">
            SOUTENANCE
          </h1>

          <p className="mt-4 font-script text-[clamp(2.2rem,10.4vw,4.2rem)] leading-[1] text-gold-600">
            Aziz Hmani
          </p>

       

          <p className="mx-auto mt-5 max-w-[31rem] text-[0.93rem] leading-relaxed text-slate-600 sm:text-[0.98rem] md:mx-0 md:text-base">
            Un moment important que j&apos;aimerais partager avec vous.
          </p>

          <div className="mx-auto mt-7 flex w-full max-w-[27rem] flex-col gap-3 md:mx-0 md:max-w-[29rem] md:flex-row md:items-center">
            <button
              type="button"
              onClick={onViewDetails}
              className="inline-flex min-h-12 w-full touch-manipulation items-center justify-center gap-2 rounded-full bg-[#071B3A] px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(7,27,58,0.24)] transition-colors hover:bg-[#0B4EA2] md:flex-1"
            >
              Voir les détails
              <ArrowRight className="h-4 w-4 shrink-0" />
            </button>

            <button
              type="button"
              onClick={onShareMemory}
              className="inline-flex min-h-12 w-full touch-manipulation items-center justify-center gap-2 rounded-full border border-gold-500/45 bg-white px-5 py-3 text-sm font-semibold text-[#071B3A] transition-colors hover:bg-gold-500/10 md:flex-1"
            >
              Partager un souvenir
              <Images className="h-4 w-4 shrink-0" />
            </button>
          </div>
        </motion.div>

        <motion.div
          {...sectionMotion}
          transition={{ duration: 0.56, delay: 0.04, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 mx-auto w-full max-w-full md:max-w-[26rem] lg:max-w-[28rem]"
        >
          <div className="relative mx-auto w-full rounded-[2rem] border border-[#071B3A]/15 bg-[linear-gradient(170deg,#ffffff_0%,#f6f8fc_52%,#ecf1f8_100%)] p-2.5 shadow-[0_24px_55px_rgba(7,27,58,0.18)]">
            <div className="pointer-events-none absolute left-1/2 top-2.5 h-1.5 w-20 -translate-x-1/2 rounded-full bg-[#071B3A]/18" />

            <div className="overflow-hidden rounded-[1.5rem] border border-white/80 bg-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.7)]">
              <div className="flex items-center justify-end border-b border-slate-200/80 bg-white/95 px-4 py-2">
                <span className="h-2 w-2 rounded-full bg-gold-500 shadow-[0_0_10px_rgba(198,167,105,0.75)]" />
              </div>

              <img
                src={posterImage}
                alt="Affiche officielle de la soutenance Aziz Hmani"
                className="aspect-[10/16] w-full object-contain bg-[#f8fafc]"
                loading="eager"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
)
