/** Store Nigerian local mobile numbers and international numbers consistently. */
export function normalizeWhatsAppNumber(value: string): string | null {
  let number = value.normalize('NFKC').trim().replace(/[\s().-]/g, '')
  if (/^0[789]\d{9}$/.test(number)) number = '+234' + number.slice(1)
  else if (/^\+?2340[789]\d{9}$/.test(number)) number = '+234' + number.replace(/^\+?2340/, '')
  else if (/^234[789]\d{9}$/.test(number)) number = '+' + number
  else if (number.startsWith('00')) number = '+' + number.slice(2)
  return /^\+[1-9]\d{7,14}$/.test(number) ? number : null
}
