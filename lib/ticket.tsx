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
  page: { backgroundColor: '#EEEDE8', fontFamily: 'Helvetica', padding: 20, justifyContent: 'center' },
  ticket: { backgroundColor: '#FFFFFF', borderRadius: 14, overflow: 'hidden' },
  hero: { backgroundColor: '#202020', minHeight: 197, padding: 28, position: 'relative' },
  goldRail: { position: 'absolute', top: 0, bottom: 0, left: 0, width: 8, backgroundColor: '#EFBC2B' },
  eyebrowRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  brand: { color: '#FFFFFF', fontSize: 20, fontFamily: 'Helvetica-Bold', letterSpacing: 1.5 },
  label: { color: '#EFBC2B', fontSize: 8, fontFamily: 'Helvetica-Bold', letterSpacing: 1.8 },
  theme: { color: '#B5B5B5', fontSize: 9, marginTop: 29, letterSpacing: 0.7 },
  eventTitle: { color: '#FFFFFF', fontSize: 25, fontFamily: 'Helvetica-Bold', lineHeight: 1.12, marginTop: 7, maxWidth: 300 },
  ticketMark: { position: 'absolute', right: 28, bottom: 26, color: '#EFBC2B', fontSize: 12, fontFamily: 'Helvetica-Bold', letterSpacing: 1.4 },
  body: { paddingHorizontal: 28, paddingTop: 24, paddingBottom: 15 },
  attendeeLabel: { color: '#7D7B74', fontSize: 8, fontFamily: 'Helvetica-Bold', letterSpacing: 1.6 },
  attendeeName: { color: '#202020', fontSize: 21, fontFamily: 'Helvetica-Bold', marginTop: 6 },
  attendeeMeta: { color: '#6B6B6B', fontSize: 10, marginTop: 5 },
  details: { flexDirection: 'row', marginTop: 23, paddingTop: 17, borderTopWidth: 1, borderTopColor: '#E6E4DE' },
  dateColumn: { width: '50%', paddingRight: 14 },
  venueColumn: { width: '50%', paddingLeft: 14, borderLeftWidth: 1, borderLeftColor: '#E6E4DE' },
  detailLabel: { color: '#7D7B74', fontSize: 7, fontFamily: 'Helvetica-Bold', letterSpacing: 1.4 },
  detailValue: { color: '#202020', fontSize: 11, fontFamily: 'Helvetica-Bold', lineHeight: 1.35, marginTop: 5 },
  detailSub: { color: '#6B6B6B', fontSize: 9, marginTop: 3, lineHeight: 1.35 },
  stub: { borderTopWidth: 1, borderTopColor: '#B7B4AA', borderStyle: 'dashed', paddingHorizontal: 28, paddingVertical: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  stubMeta: { color: '#6B6B6B', fontSize: 8, lineHeight: 1.5 },
  refLabel: { color: '#7D7B74', fontSize: 7, fontFamily: 'Helvetica-Bold', letterSpacing: 1.3, textAlign: 'right' },
  ref: { color: '#202020', fontSize: 12, fontFamily: 'Helvetica-Bold', letterSpacing: 0.5, marginTop: 4 },
  footer: { backgroundColor: '#F5F4EF', paddingVertical: 10, paddingHorizontal: 28, flexDirection: 'row', justifyContent: 'space-between' },
  footerText: { color: '#6B6B6B', fontSize: 7 },
})

function TicketDocument({ data }: { data: TicketData }) {
  return (
    <Document title={`KAMP Ticket - ${data.eventTitle}`} author="KAMP - Kolade Adepoju Mentoring Program">
      <Page size="A5" style={styles.page}>
        <View style={styles.ticket}>
          <View style={styles.hero}>
            <View style={styles.goldRail} />
            <View style={styles.eyebrowRow}>
              <Text style={styles.brand}>KAMP</Text>
              <Text style={styles.label}>ADMIT ONE</Text>
            </View>
            {data.eventTheme && <Text style={styles.theme}>{data.eventTheme.toUpperCase()}</Text>}
            <Text style={styles.eventTitle}>{data.eventTitle}</Text>
            <Text style={styles.ticketMark}>EVENT TICKET</Text>
          </View>
          <View style={styles.body}>
            <Text style={styles.attendeeLabel}>THIS TICKET BELONGS TO</Text>
            <Text style={styles.attendeeName}>{data.attendeeName}</Text>
            <Text style={styles.attendeeMeta}>{data.attendeeUniversity} - {data.studyLevel}</Text>
            <View style={styles.details}>
              <View style={styles.dateColumn}>
                <Text style={styles.detailLabel}>DATE + TIME</Text>
                <Text style={styles.detailValue}>{data.eventDate}</Text>
                <Text style={styles.detailSub}>{data.eventTime}</Text>
              </View>
              <View style={styles.venueColumn}>
                <Text style={styles.detailLabel}>LOCATION</Text>
                <Text style={styles.detailValue}>{data.eventLocation}</Text>
                <Text style={styles.detailSub}>{data.eventUniversity}</Text>
              </View>
            </View>
          </View>
          <View style={styles.stub}>
            <Text style={styles.stubMeta}>Present this ticket at entry{`\n`}Valid for one attendee</Text>
            <View>
              <Text style={styles.refLabel}>TICKET REFERENCE</Text>
              <Text style={styles.ref}>{data.ticketRef}</Text>
            </View>
          </View>
          <View style={styles.footer}>
            <Text style={styles.footerText}>wearekamp.org</Text>
            <Text style={styles.footerText}>Issued {data.issuedAt}</Text>
          </View>
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
