'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'

export type LeaderSelectOption = { value: string; label: string; detail: string }

export default function LeaderSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: LeaderSelectOption[]
  onChange: (value: string) => void
}) {
  const id = useId()
  const root = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(Math.max(0, options.findIndex((option) => option.value === value)))
  const selected = options.find((option) => option.value === value) ?? options[0]

  useEffect(() => {
    function closeOutside(event: PointerEvent) {
      if (!root.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', closeOutside)
    return () => document.removeEventListener('pointerdown', closeOutside)
  }, [])

  function openAtSelected() {
    setActive(Math.max(0, options.findIndex((option) => option.value === value)))
    setOpen(true)
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      if (!open) openAtSelected()
      else setActive((current) => (current + (event.key === 'ArrowDown' ? 1 : options.length - 1)) % options.length)
    } else if (event.key === 'Home' && open) {
      event.preventDefault(); setActive(0)
    } else if (event.key === 'End' && open) {
      event.preventDefault(); setActive(options.length - 1)
    } else if ((event.key === 'Enter' || event.key === ' ') && open) {
      event.preventDefault(); onChange(options[active].value); setOpen(false)
    } else if (event.key === 'Escape' && open) {
      event.preventDefault(); setOpen(false)
    }
  }

  return <div ref={root} className="relative">
    <span className="mb-1.5 block text-sm font-medium text-brand-black/75">{label}</span>
    <button
      type="button"
      role="combobox"
      aria-label={label}
      aria-expanded={open}
      aria-haspopup="listbox"
      aria-controls={`${id}-options`}
      aria-activedescendant={open ? `${id}-option-${active}` : undefined}
      onClick={() => open ? setOpen(false) : openAtSelected()}
      onKeyDown={onKeyDown}
      className={`group flex min-h-[58px] w-full items-center justify-between gap-3 rounded-2xl border bg-white px-4 py-3 text-left outline-none transition-[border-color,box-shadow,transform] duration-200 active:scale-[.995] motion-reduce:transition-none ${open ? 'border-brand-gold shadow-[0_0_0_4px_rgba(239,188,43,.16)]' : 'border-black/10 hover:border-brand-ink/30 focus-visible:border-brand-gold focus-visible:ring-4 focus-visible:ring-brand-gold/15'}`}
    >
      <span className="flex min-w-0 items-center gap-3">
        <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-brand-cream text-brand-ink"><span className="size-2 rounded-full bg-brand-gold" /></span>
        <span className="min-w-0"><span className="block truncate text-sm font-semibold text-brand-black">{selected.label}</span><span className="mt-0.5 block truncate text-xs text-black/45">{selected.detail}</span></span>
      </span>
      <ChevronDown aria-hidden="true" size={17} className={`shrink-0 text-brand-ink transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
    </button>
    {open && <div id={`${id}-options`} role="listbox" aria-label={label} className="absolute inset-x-0 top-[calc(100%+0.5rem)] z-30 overflow-hidden rounded-2xl border border-brand-black/10 bg-white p-1.5 shadow-[0_20px_60px_rgba(32,32,32,.16)] ring-1 ring-black/[.03] animate-[fade-in_160ms_ease-out] motion-reduce:animate-none">
      <div className="px-3 pb-1.5 pt-2 text-[10px] font-semibold uppercase tracking-[.16em] text-black/35">Choose {label.toLowerCase()}</div>
      {options.map((option, index) => {
        const isSelected = option.value === value
        return <div
          key={option.value}
          id={`${id}-option-${index}`}
          role="option"
          aria-selected={isSelected}
          onMouseEnter={() => setActive(index)}
          onClick={() => { onChange(option.value); setOpen(false) }}
          className={`flex cursor-pointer items-center justify-between gap-3 rounded-xl px-3 py-2.5 transition-colors duration-100 ${active === index ? 'bg-brand-cream' : 'bg-white hover:bg-brand-cream/70'} ${isSelected ? 'text-brand-black' : 'text-black/70'}`}
        >
          <span><span className="block text-sm font-semibold">{option.label}</span><span className="mt-0.5 block text-xs text-black/45">{option.detail}</span></span>
          {isSelected ? <span className="grid size-6 place-items-center rounded-full bg-brand-gold text-brand-black"><Check size={14} strokeWidth={2.5} /></span> : <span className="size-6 rounded-full border border-black/10" />}
        </div>
      })}
    </div>}
  </div>
}
