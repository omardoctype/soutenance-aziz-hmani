import { UserRound } from 'lucide-react'
// Replace this asset by adding your preferred file at src/assets/soutenance-profile.png.
import profileImage from '../assets/soutenance-profile.png'

interface ProfileHeaderProps {
  visitorName: string
  onChangeName?: () => void
  subtitle?: string
  showChangeNameButton?: boolean
  mobileOnly?: boolean
  className?: string
}

export const ProfileHeader = ({
  visitorName,
  onChangeName,
  subtitle,
  showChangeNameButton = true,
  mobileOnly = true,
  className = '',
}: ProfileHeaderProps) => (
  <section
    className={`rounded-[1.5rem] border border-slate-200/75 bg-white/92 px-3.5 py-3 shadow-[0_16px_42px_rgba(16,40,70,0.08)] ${
      mobileOnly ? 'md:hidden' : ''
    } ${className}`}
  >
    <div className="flex items-center gap-3">
      <img
        src={profileImage}
        alt="Soutenance Aziz Hmani"
        className="h-12 w-12 shrink-0 rounded-full border-2 border-gold-500/70 object-cover shadow-[0_8px_22px_rgba(16,40,70,0.18)]"
        loading="lazy"
      />

      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-navy-900">
          Soutenance Aziz Hmani
        </p>
        <p className="truncate text-xs text-slate-600">
          {subtitle ?? `Bienvenue, ${visitorName}`}
        </p>
      </div>
    </div>

    {showChangeNameButton && onChangeName && (
      <button
        type="button"
        onClick={onChangeName}
        className="mt-3 inline-flex min-h-10 touch-manipulation items-center gap-2 rounded-full border border-navy-900/15 bg-navy-900/5 px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-navy-900 transition-colors hover:bg-navy-900/10"
      >
        <UserRound className="h-3.5 w-3.5" />
        Changer le nom
      </button>
    )}
  </section>
)
