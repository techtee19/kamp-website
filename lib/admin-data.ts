const EVENT_TABLE_NAME = /^reg_[a-z0-9_]{1,43}$/

export function quoteEventTableName(value: unknown): string {
  if (typeof value !== 'string' || !EVENT_TABLE_NAME.test(value)) {
    throw new Error('Invalid event registration table name in registry')
  }
  return `"${value}"`
}

export function csvCell(value: unknown): string {
  let text = String(value ?? '')
  // Prevent spreadsheet formula execution in exported member-entered fields.
  if (/^[\s\u0000-\u001f]*[=+@-]/.test(text)) text = `'${text}`
  return `"${text.replace(/"/g, '""')}"`
}

export function buildCsv(headers: string[], rows: unknown[][]): string {
  return [headers.map(csvCell).join(','), ...rows.map((row) => row.map(csvCell).join(','))].join('\r\n')
}
