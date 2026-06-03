import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'

export interface NavItem {
  id: string
  label: string
  icon: LucideIcon
}

interface DesktopTopNavProps {
  items: NavItem[]
  activeId: string
  onNavigate: (id: string) => void
}

export const DesktopTopNav = ({
  items,
  activeId,
  onNavigate,
}: DesktopTopNavProps) => (
  <header className="sticky top-0 z-50 hidden border-b border-slate-200/90 bg-white/85 backdrop-blur md:block">
    <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4 lg:px-8">
      <p className="font-display text-[1.7rem] tracking-[0.24em] text-navy-900">
        AMIN FEHRI
      </p>
      <nav aria-label="Navigation principale">
        <ul className="flex items-center gap-2">
          {items.map((item) => {
            const Icon = item.icon
            const isActive = activeId === item.id

            return (
              <li key={item.id} className="relative">
                <button
                  type="button"
                  onClick={() => onNavigate(item.id)}
                  className={`relative inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-white'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-navy-900'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="desktop-nav-active"
                      className="absolute inset-0 -z-10 rounded-full bg-navy-900"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.45 }}
                    />
                  )}
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  </header>
)
