import React from 'react'
import { randomBytes } from 'node:crypto'
import path from 'node:path'
import QRCode from 'qrcode'
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  renderToBuffer,
} from '@react-pdf/renderer'

export interface TicketData {
  attendeeName: string
  attendeeEmail: string
  attendeePhone: string
  attendeeUniversity: string
  studyLevel: string
  eventTitle: string
  eventTheme?: string
  eventDate: string
  eventTime: string
  eventLocation: string
  eventUniversity: string
  ticketRef: string
  issuedAt: string
}

const styles = StyleSheet.create({
  page: { backgroundColor: '#F1EFE9', fontFamily: 'Helvetica', padding: 24, justifyContent: 'center' },
  ticket: { height: 322, flexDirection: 'row', overflow: 'hidden', borderRadius: 16, backgroundColor: '#FFFFFF' },
  main: { flex: 1, justifyContent: 'space-between', backgroundColor: '#17233B', padding: 24 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  logo: { width: 66, height: 34, objectFit: 'contain' },
  headerRule: { height: 1, marginTop: 15, backgroundColor: '#FFFFFF', opacity: 0.16 },
  brandNote: { color: '#E8E4D9', fontSize: 7, letterSpacing: 1.2, textAlign: 'right' },
  eventLabel: { color: '#F2BD2E', fontFamily: 'Helvetica-Bold', fontSize: 8, letterSpacing: 1.8 },
  eventTheme: { marginTop: 11, color: '#D8DDE7', fontSize: 8, letterSpacing: 1.4 },
  eventTitle: { maxWidth: 320, marginTop: 7, color: '#FFFFFF', fontFamily: 'Helvetica-Bold', fontSize: 25, lineHeight: 1.12 },
  attendeePanel: { marginTop: 22, paddingTop: 13, borderTopWidth: 1, borderTopColor: '#39455E' },
  overline: { color: '#B8C1D0', fontFamily: 'Helvetica-Bold', fontSize: 7, letterSpacing: 1.4 },
  attendeeName: { marginTop: 5, color: '#FFFFFF', fontFamily: 'Helvetica-Bold', fontSize: 16 },
  attendeeMeta: { marginTop: 4, color: '#C8CFDA', fontSize: 8 },
  detailRow: { flexDirection: 'row', marginTop: 17, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#39455E' },
  detailColumn: { flex: 1, paddingRight: 9 },
  detailColumnRight: { flex: 1, paddingLeft: 12, borderLeftWidth: 1, borderLeftColor: '#39455E' },
  detailLabel: { color: '#F2BD2E', fontFamily: 'Helvetica-Bold', fontSize: 7, letterSpacing: 1 },
  detailValue: { marginTop: 5, color: '#FFFFFF', fontFamily: 'Helvetica-Bold', fontSize: 9, lineHeight: 1.3 },
  detailSub: { marginTop: 3, color: '#C8CFDA', fontSize: 8, lineHeight: 1.3 },
  stub: { width: 173, justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 18, borderLeftWidth: 1, borderLeftColor: '#C9C4B8', borderLeftStyle: 'dashed', backgroundColor: '#F8F6F0' },
  stubTop: { width: '100%' },
  stubLabel: { color: '#867039', fontFamily: 'Helvetica-Bold', fontSize: 7, letterSpacing: 1.5 },
  admit: { marginTop: 7, color: '#17233B', fontFamily: 'Helvetica-Bold', fontSize: 17, lineHeight: 1.08 },
  stubCopy: { marginTop: 5, color: '#73716B', fontSize: 7, lineHeight: 1.35 },
  qrBlock: { alignItems: 'center', marginVertical: 6 },
  qr: { width: 82, height: 82 },
  qrCaption: { marginTop: 4, color: '#867039', fontFamily: 'Helvetica-Bold', fontSize: 6, letterSpacing: 0.7 },
  stubBottom: { width: '100%' },
  refBlock: { width: '100%', paddingTop: 8, borderTopWidth: 1, borderTopColor: '#DED9CD' },
  refLabel: { color: '#867039', fontFamily: 'Helvetica-Bold', fontSize: 6, letterSpacing: 1 },
  ref: { marginTop: 4, color: '#17233B', fontFamily: 'Helvetica-Bold', fontSize: 8, letterSpacing: 0.2 },
  footer: { marginTop: 5, color: '#858178', fontSize: 6 },
})

function TicketDocument({ data, qrCode }: { data: TicketData; qrCode: string }) {
  const logoPath = path.join(process.cwd(), 'public', 'kamp_logo.png')
  return (
    <Document title={`KAMP Ticket - ${data.eventTitle}`} author="KAMP - Kolade Adepoju Mentoring Program">
      <Page size="A5" orientation="landscape" style={styles.page}>
        <View style={styles.ticket}>
          <View style={styles.main}>
            <View>
              <View style={styles.header}>
                <Image src={logoPath} style={styles.logo} />
                <Text style={styles.brandNote}>KOLADE ADEPOJU{ '\n' }MENTORING PROGRAM</Text>
              </View>
              <View style={styles.headerRule} />
              <Text style={styles.eventLabel}>KAMP EVENT · ADMIT ONE</Text>
              {data.eventTheme && <Text style={styles.eventTheme}>{data.eventTheme.toUpperCase()}</Text>}
              <Text style={styles.eventTitle}>{data.eventTitle}</Text>
            </View>
            <View>
              <View style={styles.attendeePanel}>
                <Text style={styles.overline}>THIS PASS IS ISSUED TO</Text>
                <Text style={styles.attendeeName}>{data.attendeeName}</Text>
                <Text style={styles.attendeeMeta}>{[data.attendeeUniversity, data.studyLevel].filter(Boolean).join(' · ')}</Text>
              </View>
              <View style={styles.detailRow}>
                <View style={styles.detailColumn}>
                  <Text style={styles.detailLabel}>DATE & TIME</Text>
                  <Text style={styles.detailValue}>{data.eventDate}</Text>
                  <Text style={styles.detailSub}>{data.eventTime}</Text>
                </View>
                <View style={styles.detailColumnRight}>
                  <Text style={styles.detailLabel}>VENUE</Text>
                  <Text style={styles.detailValue}>{data.eventLocation}</Text>
                  <Text style={styles.detailSub}>{data.eventUniversity}</Text>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.stub}>
            <View style={styles.stubTop}>
              <Text style={styles.stubLabel}>YOUR ENTRY PASS</Text>
              <Text style={styles.admit}>You’re{ '\n' }on the list.</Text>
              <Text style={styles.stubCopy}>One entry · One attendee</Text>
            </View>
            <View style={styles.qrBlock}>
              <Image src={qrCode} style={styles.qr} />
              <Text style={styles.qrCaption}>SCAN AT THE WELCOME DESK</Text>
            </View>
            <View style={styles.stubBottom}>
              <View style={styles.refBlock}>
                <Text style={styles.refLabel}>UNIQUE TICKET CODE</Text>
                <Text style={styles.ref}>{data.ticketRef}</Text>
              </View>
              <Text style={styles.footer}>Issued {data.issuedAt}</Text>
              <Text style={styles.footer}>wearekamp.org</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  )
}

export async function generateTicketPDF(data: TicketData): Promise<Buffer> {
  const qrCode = await QRCode.toDataURL(data.ticketRef, {
    errorCorrectionLevel: 'M',
    margin: 1,
    width: 256,
    color: { dark: '#17233B', light: '#F8F6F0' },
  })
  return Buffer.from(await renderToBuffer(<TicketDocument data={data} qrCode={qrCode} />))
}

export function generateTicketRef(): string {
  const year = String(new Date().getFullYear()).slice(-2)
  const random = randomBytes(10).toString('hex').toUpperCase()
  return `KAMP-${year}-${random}`
}
