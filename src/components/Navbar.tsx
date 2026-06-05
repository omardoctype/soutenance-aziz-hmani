import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import profileImage from '../assets/soutenance-profile.png'

export type AppPath = '/accueil' | '/details' | '/souvenirs'

export interface NavItem {
  to: AppPath
  label: string
  icon: LucideIcon
}

interface NavbarProps {
  items: NavItem[]
  visitorName: string
}

export const Navbar = ({ items, visitorName }: NavbarProps) => (
  <header className="sticky top-0 z-50 hidden border-b border-slate-200/80 bg-white/86 backdrop-blur-xl md:block">
    <div className="mx-auto flex w-full max-w-[1180px] items-center justify-between gap-4 px-5 py-3 lg:px-8">
      <div className="min-w-0">
        <div className="flex items-center gap-3">
          <img
            src={profileImage}
            alt="Soutenance Wiem Zouaoui"
            className="h-11 w-11 shrink-0 rounded-full border-2 border-gold-500/70 object-cover shadow-[0_8px_18px_rgba(16,40,70,0.16)]"
            loading="lazy"
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-navy-900 lg:text-[0.95rem]">
              Soutenance Wiem Zouaoui
            </p>
            <p className="truncate text-xs text-slate-600">
              Bienvenue, {visitorName}
            </p>
          </div>
        </div>
      </div>

      <nav aria-label="Navigation principale">
        <ul className="flex items-center justify-end gap-1.5 lg:gap-2">
          {items.map((item) => {
            const Icon = item.icon

            return (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end
                  className={({ isActive }) =>
                    `relative inline-flex min-h-11 items-center gap-2 rounded-full px-3 py-2 text-[0.83rem] font-semibold transition-colors lg:px-4 lg:text-sm ${
                      isActive
                        ? 'text-white'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-navy-900'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <motion.span
                          layoutId="desktop-active-section"
                          className="absolute inset-0 -z-10 rounded-full bg-navy-900"
                          transition={{
                            type: 'spring',
                            bounce: 0.2,
                            duration: 0.45,
                          }}
                        />
                      )}
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </>
                  )}
                </NavLink>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  </header>
)
