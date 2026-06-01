import type { NavItem } from './DesktopTopNav'

interface MobileBottomNavProps {
  items: NavItem[]
  activeId: string
  onNavigate: (id: string) => void
}

export const MobileBottomNav = ({
  items,
  activeId,
  onNavigate,
}: MobileBottomNavProps) => (
  <nav
    aria-label="Navigation mobile"
    className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200/90 bg-white/95 px-2 pb-[calc(env(safe-area-inset-bottom)+0.4rem)] pt-2 backdrop-blur md:hidden"
  >
    <ul className="mx-auto grid max-w-lg grid-cols-4 gap-1">
      {items.map((item) => {
        const Icon = item.icon
        const isActive = activeId === item.id

        return (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => onNavigate(item.id)}
              className={`flex w-full flex-col items-center gap-1 rounded-xl px-2 py-2 text-[11px] font-semibold tracking-wide transition-colors ${
                isActive
                  ? 'bg-navy-900 text-white'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-navy-900'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </button>
          </li>
        )
      })}
    </ul>
  </nav>
)
