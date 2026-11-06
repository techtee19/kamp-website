export function csvFile(rows: Array<Record<string, unknown>>, columns: Array<{ key: string; label: string }>, filename: string) {
  const safeCell = (value: unknown) => {
    let text = value == null ? '' : value instanceof Date ? value.toISOString() : String(value)
    if (/^[\s\u0000-\u001f]*[=+@\-]/.test(text)) text = `'${text}`
    return `"${text.replace(/"/g, '""')}"`
  }
  const body = [columns.map((c) => safeCell(c.label)).join(','), ...rows.map((row) => columns.map((c) => safeCell(row[c.key])).join(','))].join('\r\n')
  return new Response(`\uFEFF${body}`, { headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': `attachment; filename="${filename}"`, 'Cache-Control': 'no-store' } })
}
