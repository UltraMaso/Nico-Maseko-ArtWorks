import { useEffect } from 'react'

export const useSlideshow = (slides, slideIndex, setSlideIndex) => {
  useEffect(() => {
    if (!slides.length) return undefined
    if (slideIndex >= slides.length) setSlideIndex(0)

    const timer = setInterval(() => {
      setSlideIndex((prevIndex) => (prevIndex + 1) % slides.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [slides, slideIndex, setSlideIndex])
}
