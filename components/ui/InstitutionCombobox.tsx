'use client'

/**
 * Searchable autocomplete for Nigerian universities, polytechnics, and
 * colleges of education.
 * Works with native <form> — renders a hidden <input name={name} /> that
 * contains the committed value so it appears in FormData on submit.
 */
import { useEffect, useId, useRef, useState } from 'react'
import type { NigerianInstitution } from '@/lib/nigerian-institutions'

const MAX_SUGGESTIONS = 8

const TYPE_STYLES: Record<NigerianInstitution['type'], string> = {
  Federal: 'bg-emerald-100 text-emerald-700',
  State: 'bg-sky-100 text-sky-700',
  Private: 'bg-violet-100 text-violet-700',
}

interface InstitutionComboboxProps {
  /** The name attribute forwarded to the hidden <input> for FormData. */
  name: string
  required?: boolean
  disabled?: boolean
  /** Pre-fill the input (e.g. when editing an existing form). */
  defaultValue?: string
  className?: string
  onValueChange?: (value: string) => void
}

export default function InstitutionCombobox({
  name,
  required = false,
  disabled = false,
  defaultValue = '',
  className = '',
  onValueChange,
}: InstitutionComboboxProps) {
  const id = useId()
  const listId = `${id}-list`

  const [query, setQuery] = useState(defaultValue)
  /** The value that has actually been *committed* (selected or typed and blurred). */
  const [committed, setCommitted] = useState(defaultValue)
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const [suggestions, setSuggestions] = useState<NigerianInstitution[]>([])
  const [loading, setLoading] = useState(false)
  const [searchFailed, setSearchFailed] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  // Search on the server so the full 145 KB institutions list stays out of the
  // initial client bundle. Debouncing and aborting keep fast typing responsive.
  useEffect(() => {
    const q = query.trim()
    if (q.length < 3) {
      setSuggestions([])
      setLoading(false)
      setSearchFailed(false)
      return
    }

    const controller = new AbortController()
    const timer = window.setTimeout(async () => {
      setLoading(true)
      setSearchFailed(false)
      try {
        const response = await fetch(`/api/institutions?q=${encodeURIComponent(q)}`, { signal: controller.signal })
        if (!response.ok) throw new Error('Institution search failed')
        const result = await response.json() as { institutions: NigerianInstitution[] }
        setSuggestions(result.institutions.slice(0, MAX_SUGGESTIONS))
      } catch {
        if (!controller.signal.aborted) {
          setSuggestions([])
          setSearchFailed(true)
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }, 100)

    return () => {
      window.clearTimeout(timer)
      controller.abort()
    }
  }, [query])

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
          onValueChange?.(query)
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
    onValueChange?.(value)
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
        onValueChange?.(query)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [query])

  const hasSuggestions = open && (suggestions.length > 0 || loading)

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
        aria-busy={loading}
        autoComplete="off"
        spellCheck={false}
        required={required}
        disabled={disabled}
        placeholder="Search or enter your tertiary institution"
        value={query}
        onChange={(e) => {
          const value = e.target.value
          setQuery(value)
          // Reset committed whenever the user changes what's typed so the
          // hidden input doesn't silently hold a stale selection.
          setCommitted(value)
          setSuggestions([])
          setOpen(value.trim().length >= 3)
          setLoading(value.trim().length >= 3)
          onValueChange?.(value)
        }}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          if (query.trim().length >= 3) setOpen(true)
        }}
        className={baseInput}
      />

      {/* Dropdown */}
        {hasSuggestions && (
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          aria-label="Nigerian tertiary institutions"
          className="absolute left-0 right-0 z-50 mt-1 max-h-64 overflow-y-auto rounded-xl border border-brand-ink/15 bg-brand-white shadow-xl"
        >
          {loading && suggestions.length === 0 && Array.from({ length: 4 }, (_, index) => (
            <li key={`loading-${index}`} aria-hidden="true" className="flex items-center gap-3 px-4 py-3">
              <span className="h-4 flex-1 animate-pulse rounded bg-brand-card" />
              <span className="h-4 w-14 animate-pulse rounded-full bg-brand-card" />
            </li>
          ))}
          {suggestions.map((uni, i) => {
            const isActive = i === activeIndex
            return (
              <li
                key={`${uni.institutionType}-${uni.name}`}
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
                  <span className="text-xs text-brand-grey">{uni.state}{uni.state === 'FCT' ? '' : ' State'} · {uni.institutionType}{uni.abbreviation ? ` · ${uni.abbreviation}` : ''}</span>
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
      {query.trim().length >= 3 && !loading && searchFailed && (
        <p className="mt-1 text-xs text-brand-grey" role="status">
          Institution search is unavailable — you can still type your institution name.
        </p>
      )}
      {query.trim().length >= 3 && !loading && !searchFailed && suggestions.length === 0 && (
        <p className="mt-1 text-xs text-brand-grey">
          No match found — you can still type your institution name directly.
        </p>
      )}
      {query.trim().length > 0 && query.trim().length < 3 && (
        <p className="mt-1 text-xs text-brand-grey">Type at least 3 characters to search institutions.</p>
      )}
    </div>
  )
}
