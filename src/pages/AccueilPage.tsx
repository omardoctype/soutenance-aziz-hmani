import { useNavigate } from 'react-router-dom'
import { HeroSection } from '../components/HeroSection'

export const AccueilPage = () => {
  const navigate = useNavigate()

  return (
    <HeroSection
      onViewDetails={() => navigate('/details')}
      onShareMemory={() => navigate('/souvenirs')}
    />
  )
}
