'use client'

// Eased stat counter that counts up the first time it scrolls into view. The
// stats sit directly below a full-height hero, so animating on mount meant the
// numbers had already finished climbing before anyone could see them.
import { useEffect, useRef, useState } from 'react'

type StatCounterProps = {
  value: string
}

export default function StatCounter({ value }: StatCounterProps) {
  const [displayValue, setDisplayValue] = useState('0+')
  const [hasEnteredView, setHasEnteredView] = useState(false)
  const numberRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const node = numberRef.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setHasEnteredView(true)
        // Count up once — scrolling back past it should not reset the number.
        observer.disconnect()
      },
      { threshold: 0.6 },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!hasEnteredView) return

    const target = Number(value.replace(/\D/g, ''))
    const suffix = value.replace(/[\d,]/g, '')
    const duration = 2000
    let animationFrame = 0
    let startTime: number | null = null

    const update = (time: number) => {
      if (startTime === null) startTime = time
      const progress = Math.min((time - startTime) / duration, 1)
      const easedProgress = 1 - (1 - progress) ** 3
      const current = Math.round(target * easedProgress)
      setDisplayValue(`${current.toLocaleString()}${suffix}`)

      if (progress < 1) animationFrame = requestAnimationFrame(update)
    }

    animationFrame = requestAnimationFrame(update)
    return () => cancelAnimationFrame(animationFrame)
  }, [value, hasEnteredView])

  return <span ref={numberRef}>{displayValue}</span>
}
