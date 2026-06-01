interface SectionHeadingProps {
  eyebrow: string
  title: string
  description: string
}

export const SectionHeading = ({
  eyebrow,
  title,
  description,
}: SectionHeadingProps) => (
  <div>
    <p className="text-xs font-semibold uppercase tracking-[0.26em] text-gold-600">
      {eyebrow}
    </p>
    <h2 className="mt-2 font-display text-3xl leading-tight text-navy-900 sm:text-4xl">
      {title}
    </h2>
    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
      {description}
    </p>
  </div>
)
