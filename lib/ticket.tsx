import React from 'react'
import {
  Document,
  Page,
  Text,
  View,
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
  page: { backgroundColor: '#FFFFFF', fontFamily: 'Helvetica' },
  header: { backgroundColor: '#1A1A1A', padding: 36, paddingBottom: 28 },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  brandName: { color: '#C9A227', fontSize: 28, fontFamily: 'Helvetica-Bold', letterSpacing: 2 },
  brandTagline: { color: '#FFFFFF', fontSize: 9, marginTop: 3, opacity: 0.7, letterSpacing: 0.5 },
  ticketLabel: { color: '#FFFFFF', fontSize: 9, letterSpacing: 2, opacity: 0.6, fontFamily: 'Helvetica-Bold' },
  eventTitle: { color: '#FFFFFF', fontSize: 22, fontFamily: 'Helvetica-Bold', marginTop: 4, lineHeight: 1.3 },
  eventTheme: { color: '#C9A227', fontSize: 11, marginTop: 6, letterSpacing: 1 },
  goldStrip: { backgroundColor: '#C9A227', height: 4 },
  body: { padding: 36 },
  sectionLabel: { fontSize: 8, color: '#6B6B6B', letterSpacing: 2, fontFamily: 'Helvetica-Bold', marginBottom: 6 },
  attendeeName: { fontSize: 20, fontFamily: 'Helvetica-Bold', color: '#1A1A1A', marginBottom: 4 },
  attendeeDetail: { fontSize: 11, color: '#6B6B6B', marginBottom: 2 },
  divider: { borderBottomWidth: 1, borderBottomColor: '#F0EFEA', marginVertical: 24 },
  detailsGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  detailBlock: { width: '50%', marginBottom: 20, paddingRight: 16 },
  detailLabel: { fontSize: 8, color: '#6B6B6B', letterSpacing: 1.5, fontFamily: 'Helvetica-Bold', marginBottom: 4 },
  detailValue: { fontSize: 12, color: '#1A1A1A', fontFamily: 'Helvetica-Bold', lineHeight: 1.4 },
  detailSub: { fontSize: 10, color: '#6B6B6B', marginTop: 2 },
  noteBox: { backgroundColor: '#F5F4EF', borderLeftWidth: 3, borderLeftColor: '#C9A227', padding: 14, marginTop: 8, borderRadius: 2 },
  noteTitle: { fontSize: 9, fontFamily: 'Helvetica-Bold', color: '#1A1A1A', marginBottom: 4, letterSpacing: 0.5 },
  noteText: { fontSize: 9, color: '#6B6B6B', lineHeight: 1.5 },
  footer: { backgroundColor: '#1A1A1A', padding: 20, paddingHorizontal: 36, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' },
  footerLeft: { color: '#FFFFFF', fontSize: 9, opacity: 0.6 },
  footerRef: { color: '#C9A227', fontSize: 9, fontFamily: 'Helvetica-Bold', letterSpacing: 0.5 },
  refLabel: { color: '#FFFFFF', fontSize: 8, opacity: 0.5, marginBottom: 2, letterSpacing: 1 },
})

function TicketDocument({ data }: { data: TicketData }) {
  return (
    <Document title={`KAMP Ticket - ${data.eventTitle}`} author="KAMP - Kolade Adepoju Mentoring Program">
      <Page size="A5" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.brandName}>KAMP</Text>
              <Text style={styles.brandTagline}>Kolade Adepoju Mentoring Program</Text>
            </View>
            <Text style={styles.ticketLabel}>EVENT TICKET</Text>
          </View>
          {data.eventTheme && <Text style={styles.eventTheme}>{data.eventTheme}</Text>}
          <Text style={styles.eventTitle}>{data.eventTitle}</Text>
        </View>
        <View style={styles.goldStrip} />
        <View style={styles.body}>
          <Text style={styles.sectionLabel}>REGISTERED ATTENDEE</Text>
          <Text style={styles.attendeeName}>{data.attendeeName}</Text>
          <Text style={styles.attendeeDetail}>{data.attendeeEmail}</Text>
          <Text style={styles.attendeeDetail}>{data.attendeeUniversity} - {data.studyLevel}</Text>
          <View style={styles.divider} />
          <View style={styles.detailsGrid}>
            <View style={styles.detailBlock}><Text style={styles.detailLabel}>DATE</Text><Text style={styles.detailValue}>{data.eventDate}</Text></View>
            <View style={styles.detailBlock}><Text style={styles.detailLabel}>TIME</Text><Text style={styles.detailValue}>{data.eventTime}</Text></View>
            <View style={styles.detailBlock}><Text style={styles.detailLabel}>VENUE</Text><Text style={styles.detailValue}>{data.eventLocation}</Text><Text style={styles.detailSub}>{data.eventUniversity}</Text></View>
            <View style={styles.detailBlock}><Text style={styles.detailLabel}>ISSUED</Text><Text style={styles.detailValue}>{data.issuedAt}</Text></View>
          </View>
          <View style={styles.noteBox}>
            <Text style={styles.noteTitle}>IMPORTANT</Text>
            <Text style={styles.noteText}>Please bring this ticket (printed or on your device) to the event. Your name will be verified against the registration list at the entrance. This ticket is non-transferable.</Text>
          </View>
        </View>
        <View style={styles.footer}>
          <Text style={styles.footerLeft}>wearekamp.org - @wearekamp</Text>
          <View style={{ alignItems: 'flex-end' }}><Text style={styles.refLabel}>TICKET REF</Text><Text style={styles.footerRef}>{data.ticketRef}</Text></View>
        </View>
      </Page>
    </Document>
  )
}

export async function generateTicketPDF(data: TicketData): Promise<Buffer> {
  return Buffer.from(await renderToBuffer(<TicketDocument data={data} />))
}

export function generateTicketRef(): string {
  const year = new Date().getFullYear()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `KAMP-${year}-${random}`
}
