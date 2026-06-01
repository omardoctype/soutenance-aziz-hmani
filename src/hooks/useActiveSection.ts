import { useEffect, useState } from 'react'

export const useActiveSection = (sectionIds: string[]) => {
  const [activeSection, setActiveSection] = useState(sectionIds[0] ?? '')

  useEffect(() => {
    const observedSections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section))

    if (observedSections.length === 0) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)

        if (visibleEntries[0]) {
          setActiveSection(visibleEntries[0].target.id)
        }
      },
      {
        threshold: [0.2, 0.4, 0.7],
        rootMargin: '-20% 0px -45% 0px',
      },
    )

    observedSections.forEach((section) => observer.observe(section))

    return () => observer.disconnect()
  }, [sectionIds])

  return activeSection
}
