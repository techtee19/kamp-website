'use client'

/**
 * UniversityCombobox
 * A searchable autocomplete for the 273 NUC-listed Nigerian universities.
 * Works with native <form> — renders a hidden <input name={name} /> that
 * contains the committed value so it appears in FormData on submit.
 */
import { useEffect, useId, useRef, useState } from 'react'
import { NIGERIAN_UNIVERSITIES, type NigerianUniversity } from '@/lib/nigerian-universities'

const MAX_SUGGESTIONS = 8

const TYPE_STYLES: Record<NigerianUniversity['type'], string> = {
  Federal: 'bg-emerald-100 text-emerald-700',
  State: 'bg-sky-100 text-sky-700',
  Private: 'bg-violet-100 text-violet-700',
}

interface UniversityComboboxProps {
  /** The name attribute forwarded to the hidden <input> for FormData. */
  name: string
  required?: boolean
  disabled?: boolean
  /** Pre-fill the input (e.g. when editing an existing form). */
  defaultValue?: string
  className?: string
}

export default function UniversityCombobox({
  name,
  required = false,
  disabled = false,
  defaultValue = '',
  className = '',
}: UniversityComboboxProps) {
  const id = useId()
  const listId = `${id}-list`

  const [query, setQuery] = useState(defaultValue)
  /** The value that has actually been *committed* (selected or typed and blurred). */
  const [committed, setCommitted] = useState(defaultValue)
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)

  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  // ── Filtering ────────────────────────────────────────────────────────────
  const suggestions: NigerianUniversity[] = query.trim().length < 1
    ? []
    : NIGERIAN_UNIVERSITIES.filter((u) => {
        const q = query.toLowerCase()
        return (
          u.name.toLowerCase().includes(q) ||
          u.abbreviation.toLowerCase().includes(q) ||
          u.state.toLowerCase().includes(q)
        )
      }).slice(0, MAX_SUGGESTIONS)

  // ── Keyboard navigation ───────────────────────────────────────────────────
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open || suggestions.length === 0) {
      if (e.key === 'ArrowDown' && suggestions.length > 0) {
        setOpen(true)
        setActiveIndex(0)
        e.preventDefault()
      }
      return
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1))
        break
      case 'ArrowUp':
        e.preventDefault()
        setActiveIndex((i) => Math.max(i - 1, 0))
        break
      case 'Enter':
        e.preventDefault()
        if (activeIndex >= 0 && activeIndex < suggestions.length) {
          commit(suggestions[activeIndex].name)
        }
        break
      case 'Escape':
        e.preventDefault()
        setOpen(false)
        setActiveIndex(-1)
        // Restore the last committed value so the field isn't left blank.
        setQuery(committed)
        break
      case 'Tab':
        // Accept the highlighted suggestion on Tab so keyboard users can
        // move through the form without needing to press Enter first.
        if (activeIndex >= 0 && activeIndex < suggestions.length) {
          commit(suggestions[activeIndex].name)
        } else {
          // No active suggestion — commit whatever was typed directly.
          setCommitted(query)
          setOpen(false)
        }
        break
    }
  }

  // ── Commit helpers ────────────────────────────────────────────────────────
  const commit = (value: string) => {
    setQuery(value)
    setCommitted(value)
    setOpen(false)
    setActiveIndex(-1)
    inputRef.current?.blur()
  }

  // ── Scroll active option into view ────────────────────────────────────────
  useEffect(() => {
    if (activeIndex < 0 || !listRef.current) return
    const item = listRef.current.children[activeIndex] as HTMLElement | undefined
    item?.scrollIntoView({ block: 'nearest' })
  }, [activeIndex])

  // ── Close on outside click ────────────────────────────────────────────────
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
        setActiveIndex(-1)
        // If the user typed something not in the list, keep what they typed.
        setCommitted(query)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [query])

  // ── Sync open state with suggestions ─────────────────────────────────────
  useEffect(() => {
    if (suggestions.length > 0) {
      setOpen(true)
      setActiveIndex(-1)
    } else {
      setOpen(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  const baseInput =
    'mt-2 w-full rounded-lg border border-brand-ink/25 bg-brand-white px-4 py-3 outline-none focus:border-brand-gold disabled:opacity-50 disabled:cursor-not-allowed'

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Hidden input carries the committed value into FormData */}
      <input type="hidden" name={name} value={committed} />

      {/* Visible combobox input */}
      <input
        ref={inputRef}
        id={id}
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={activeIndex >= 0 ? `${id}-opt-${activeIndex}` : undefined}
        aria-autocomplete="list"
        autoComplete="off"
        spellCheck={false}
        required={required}
        disabled={disabled}
        placeholder="e.g. University of Lagos or UNILAG"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value)
          // Reset committed whenever the user changes what's typed so the
          // hidden input doesn't silently hold a stale selection.
          setCommitted(e.target.value)
        }}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          if (suggestions.length > 0) setOpen(true)
        }}
        className={baseInput}
      />

      {/* Dropdown */}
      {open && suggestions.length > 0 && (
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          aria-label="Nigerian universities"
          className="absolute left-0 right-0 z-50 mt-1 max-h-64 overflow-y-auto rounded-xl border border-brand-ink/15 bg-brand-white shadow-xl"
        >
          {suggestions.map((uni, i) => {
            const isActive = i === activeIndex
            return (
              <li
                key={uni.abbreviation}
                id={`${id}-opt-${i}`}
                role="option"
                aria-selected={isActive}
                onMouseDown={(e) => {
                  // Prevent blur on the input before we commit.
                  e.preventDefault()
                  commit(uni.name)
                }}
                onMouseEnter={() => setActiveIndex(i)}
                className={`flex cursor-pointer items-start justify-between gap-3 px-4 py-3 text-sm transition-colors ${
                  isActive ? 'bg-brand-gold/15 text-brand-ink' : 'text-brand-ink hover:bg-brand-cream'
                }`}
              >
                <span className="min-w-0">
                  <span className="block truncate font-medium">{uni.name}</span>
                  <span className="text-xs text-brand-grey">{uni.state} State · {uni.abbreviation}</span>
                </span>
                <span
                  className={`mt-0.5 shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${TYPE_STYLES[uni.type]}`}
                >
                  {uni.type}
                </span>
              </li>
            )
          })}
        </ul>
      )}

      {/* "No matches" hint — only when user has typed enough and nothing matches */}
      {query.trim().length >= 2 && suggestions.length === 0 && (
        <p className="mt-1 text-xs text-brand-grey">
          No match found — you can still type your university name directly.
        </p>
      )}
    </div>
  )
}
