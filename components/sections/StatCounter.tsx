'use client'

// Eased stat counter that animates from zero to its final value on page load.
import { useEffect, useState } from 'react'

type StatCounterProps = {
  value: string
}

export default function StatCounter({ value }: StatCounterProps) {
  const [displayValue, setDisplayValue] = useState('0+')

  useEffect(() => {
    const target = Number(value.replace(/\D/g, ''))
    const suffix = value.replace(/[\d,]/g, '')
    const duration = 2200
    let animationFrame = 0
    let startTime: number | null = null

    const update = (time: number) => {
      if (startTime === null) startTime = time
      const progress = Math.min((time - startTime) / duration, 1)
      const easedProgress = 1 - (1 - progress) ** 4
      const current = Math.round(target * easedProgress)
      setDisplayValue(`${current.toLocaleString()}${suffix}`)

      if (progress < 1) animationFrame = requestAnimationFrame(update)
    }

    animationFrame = requestAnimationFrame(update)
    return () => cancelAnimationFrame(animationFrame)
  }, [value])

  return <span>{displayValue}</span>
}
