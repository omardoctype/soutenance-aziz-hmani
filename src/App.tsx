import { CalendarDays, Home, Images } from 'lucide-react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { BottomNav } from './components/BottomNav'
import { Navbar, type NavItem } from './components/Navbar'
import { ProfileHeader } from './components/ProfileHeader'
import { VisitorGate } from './components/VisitorGate'
import { useVisitor } from './hooks/useVisitor'
import { AccueilPage } from './pages/AccueilPage'
import { DetailsPage } from './pages/DetailsPage'
import { SouvenirsPage } from './pages/SouvenirsPage'

const NAV_ITEMS: NavItem[] = [
  { to: '/accueil', label: 'Accueil', icon: Home },
  { to: '/details', label: 'Details', icon: CalendarDays },
  { to: '/souvenirs', label: 'Souvenirs', icon: Images },
]

function App() {
  const { visitorName, hasVisitor, setVisitorName } = useVisitor()

  if (!hasVisitor) {
    return <VisitorGate onSubmitName={setVisitorName} />
  }

  return (
    <div className="relative isolate min-h-dvh overflow-x-clip pb-[calc(6.8rem+env(safe-area-inset-bottom))] md:pb-0">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[-12%] top-[-8rem] h-[24rem] w-[24rem] rounded-full bg-gold-500/15 blur-3xl" />
        <div className="absolute right-[-16%] top-[28rem] h-[30rem] w-[30rem] rounded-full bg-navy-900/10 blur-3xl" />
        <div className="absolute bottom-[-10rem] left-1/2 h-[26rem] w-[26rem] -translate-x-1/2 rounded-full bg-gold-500/10 blur-3xl" />
      </div>

      <Navbar
        items={NAV_ITEMS}
        visitorName={visitorName}
      />

      <main className="mx-auto flex w-full max-w-[1180px] flex-col gap-6 px-3 pb-10 pt-4 sm:gap-8 sm:px-5 sm:pt-6 md:pb-14 md:pt-10 lg:px-8">
        <ProfileHeader visitorName={visitorName} />

        <Routes>
          <Route
            path="/"
            element={
              <Navigate
                to="/accueil"
                replace
              />
            }
          />
          <Route
            path="/accueil"
            element={<AccueilPage />}
          />
          <Route
            path="/details"
            element={<DetailsPage />}
          />
          <Route
            path="/souvenirs"
            element={<SouvenirsPage visitorName={visitorName} />}
          />
          <Route
            path="/home"
            element={
              <Navigate
                to="/accueil"
                replace
              />
            }
          />
          <Route
            path="/detail"
            element={
              <Navigate
                to="/details"
                replace
              />
            }
          />
          <Route
            path="/souvenir"
            element={
              <Navigate
                to="/souvenirs"
                replace
              />
            }
          />
          <Route
            path="/invitation"
            element={
              <Navigate
                to="/souvenirs"
                replace
              />
            }
          />
          <Route
            path="*"
            element={
              <Navigate
                to="/accueil"
                replace
              />
            }
          />
        </Routes>
      </main>

      <BottomNav items={NAV_ITEMS} />
    </div>
  )
}

export default App

