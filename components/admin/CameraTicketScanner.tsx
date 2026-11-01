'use client'

import { useEffect, useRef, useState } from 'react'
import { BrowserQRCodeReader } from '@zxing/browser'

export default function CameraTicketScanner({ onTicket, onClose }: { onTicket: (value: string) => void; onClose: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const stoppedRef = useRef(false)
  const stopScannerRef = useRef<(() => void) | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true
    const reader = new BrowserQRCodeReader(undefined, { delayBetweenScanAttempts: 250 })

    async function start() {
      if (!videoRef.current) return
      try {
        const controls = await reader.decodeFromConstraints(
          { audio: false, video: { facingMode: { ideal: 'environment' } } },
          videoRef.current,
          (result) => {
            if (!result || stoppedRef.current) return
            stoppedRef.current = true
            controlsStop()
            onTicket(result.getText())
          },
        )
        if (!mounted || stoppedRef.current) controls.stop()
        else stopScannerRef.current = () => controls.stop()
      } catch (cause) {
        if (!mounted) return
        const name = cause instanceof Error ? cause.name : ''
        setError(name === 'NotAllowedError'
          ? 'Camera access was blocked. Allow camera access in your browser settings, then try again.'
          : name === 'NotFoundError'
            ? 'No camera was found on this device. Search for the attendee by ticket code instead.'
            : 'The camera could not start. Check browser permissions and try again.')
      }
    }

    function controlsStop() {
      stopScannerRef.current?.()
      stopScannerRef.current = null
    }

    void start()
    return () => {
      mounted = false
      stoppedRef.current = true
      controlsStop()
    }
  }, [onTicket])

  return <div className="mt-4 rounded-xl border border-brand-card bg-brand-cream p-4">
    <div className="mb-3 flex items-center justify-between gap-3">
      <p className="text-sm font-semibold text-brand-black">Scan event ticket</p>
      <button type="button" onClick={onClose} className="rounded-full border border-brand-card bg-white px-3 py-1.5 text-xs font-semibold text-brand-black">Close camera</button>
    </div>
    <div className="overflow-hidden rounded-lg bg-black">
      <video ref={videoRef} className="aspect-video w-full object-cover" muted playsInline aria-label="Camera preview for scanning ticket QR codes" />
    </div>
    <p className="mt-2 text-xs text-brand-grey">Point the back camera at the QR code on the attendee’s ticket.</p>
    {error && <p role="alert" className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
  </div>
}
