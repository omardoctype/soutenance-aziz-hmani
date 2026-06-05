// Replace this asset by adding your preferred file at src/assets/soutenance-profile.png.
import profileImage from '../assets/soutenance-profile.png'

interface ProfileHeaderProps {
  visitorName: string
}

export const ProfileHeader = ({ visitorName }: ProfileHeaderProps) => (
  <section
    className="rounded-[1.5rem] border border-slate-200/75 bg-white/92 px-3.5 py-3 shadow-[0_16px_42px_rgba(16,40,70,0.08)] md:hidden"
  >
    <div className="flex items-center gap-3">
      <img
        src={profileImage}
        alt="Soutenance Wiem Zouaoui"
        className="h-12 w-12 shrink-0 rounded-full border-2 border-gold-500/70 object-cover shadow-[0_8px_22px_rgba(16,40,70,0.18)]"
        loading="lazy"
      />

      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-navy-900">
          Soutenance Wiem Zouaoui
        </p>
        <p className="truncate text-xs text-slate-600">
          Bienvenue, {visitorName}
        </p>
      </div>
    </div>
  </section>
)
