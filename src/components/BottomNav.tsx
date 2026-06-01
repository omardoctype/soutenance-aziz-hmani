import { NavLink } from 'react-router-dom'
import type { NavItem } from './Navbar'

interface BottomNavProps {
  items: NavItem[]
}

export const BottomNav = ({ items }: BottomNavProps) => (
  <nav
    aria-label="Navigation mobile"
    className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200/80 bg-white/95 px-2 pb-[calc(env(safe-area-inset-bottom)+0.55rem)] pt-2 shadow-[0_-10px_25px_rgba(16,40,70,0.08)] backdrop-blur-xl md:hidden"
  >
    <ul
      className="mx-auto grid w-full max-w-xl gap-1"
      style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}
    >
      {items.map((item) => {
        const Icon = item.icon

        return (
          <li key={item.to}>
            <NavLink
              to={item.to}
              end
              className={({ isActive }) =>
                `flex min-h-[3.5rem] w-full touch-manipulation flex-col items-center justify-center gap-1 rounded-xl px-1.5 py-2 text-[10px] font-semibold leading-tight tracking-wide transition-colors ${
                  isActive
                    ? 'bg-navy-900 text-white shadow-[0_10px_22px_rgba(16,40,70,0.24)]'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-navy-900'
                }`
              }
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </NavLink>
          </li>
        )
      })}
    </ul>
  </nav>
)
