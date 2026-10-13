import React from 'react'
import path from 'node:path'
import { Document, Page, Text, View, Image, StyleSheet, renderToBuffer } from '@react-pdf/renderer'

export interface MemberCardData {
  firstName: string
  lastName: string
  memberId: string
  membershipType: string
  affiliation: string
  kampPosition: string
  yearJoined: number
  passportDataUri?: string
}

const CARD = { width: 153.07, height: 242.65 }

const styles = StyleSheet.create({
  page: { width: CARD.width, height: CARD.height, fontFamily: 'Helvetica', backgroundColor: '#F7F5F0' },
  front: { flex: 1, overflow: 'hidden', borderWidth: 0.7, borderColor: '#D9D4C9', backgroundColor: '#FFFEFC' },
  frontHeader: { height: 50, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#17233B' },
  logo: { width: 48, height: 30, objectFit: 'contain' },
  brandBlock: { alignItems: 'flex-end', maxWidth: 82 },
  brandEyebrow: { color: '#F2BD2E', fontFamily: 'Helvetica-Bold', fontSize: 6, letterSpacing: 1 },
  brandText: { marginTop: 4, color: '#FFFFFF', fontSize: 5.2, letterSpacing: 0.35, textAlign: 'right', lineHeight: 1.35 },
  goldRule: { height: 2.5, backgroundColor: '#F2BD2E' },
  frontBody: { flex: 1, paddingHorizontal: 13, paddingTop: 6, paddingBottom: 4, alignItems: 'center' },
  photoFrame: { width: 57, height: 55, padding: 2, borderWidth: 1, borderColor: '#D6B343', borderRadius: 8, backgroundColor: '#fff' },
  photo: { width: '100%', height: '100%', objectFit: 'cover', borderRadius: 5 },
  photoPlaceholder: { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: '#EAE7DF', borderRadius: 5 },
  photoInitials: { color: '#17233B', fontFamily: 'Helvetica-Bold', fontSize: 18, letterSpacing: 1 },
  name: { width: '100%', marginTop: 5, color: '#17233B', fontFamily: 'Helvetica-Bold', fontSize: 11, textAlign: 'center' },
  typePill: { marginTop: 3, paddingVertical: 2.5, paddingHorizontal: 8, borderRadius: 99, backgroundColor: '#F7F0D9' },
  memberType: { color: '#705615', fontSize: 5.8, fontFamily: 'Helvetica-Bold', letterSpacing: 0.9, textAlign: 'center' },
  institution: { width: '100%', marginTop: 5, color: '#626B79', fontSize: 5.8, lineHeight: 1.25, textAlign: 'center' },
  positionPanel: { width: '100%', marginTop: 5, paddingVertical: 4, paddingHorizontal: 7, borderRadius: 5, backgroundColor: '#F7F0D9' },
  positionLabel: { color: '#705615', fontFamily: 'Helvetica-Bold', fontSize: 4.4, letterSpacing: 0.8 },
  positionValue: { marginTop: 2, color: '#17233B', fontFamily: 'Helvetica-Bold', fontSize: 5.6, lineHeight: 1.2 },
  idPanel: { width: '100%', marginTop: 4, paddingVertical: 4, paddingHorizontal: 8, borderRadius: 5, backgroundColor: '#F3F1EB', borderWidth: 0.5, borderColor: '#E5E0D5' },
  idLabel: { color: '#7A7468', fontFamily: 'Helvetica-Bold', fontSize: 4.8, letterSpacing: 1 },
  idValue: { marginTop: 3, color: '#17233B', fontFamily: 'Helvetica-Bold', fontSize: 7.4, letterSpacing: 0.2 },
  frontFooter: { height: 21, paddingHorizontal: 11, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#17233B' },
  footerText: { color: '#FFFFFF', fontSize: 4.7, letterSpacing: 0.45 },
  footerYear: { color: '#F2BD2E', fontFamily: 'Helvetica-Bold', fontSize: 5.8 },

})

function MemberCard({ data }: { data: MemberCardData }) {
  const logoPath = path.join(process.cwd(), 'public', 'kamp_logo.png')
  const fullName = `${data.firstName} ${data.lastName}`

  return (
    <Document title={`KAMP Member Card ${data.memberId}`} author="KAMP">
      <Page size={CARD} style={styles.page}>
        <View style={styles.front}>
          <View style={styles.frontHeader}>
            <Image src={logoPath} style={styles.logo} />
            <View style={styles.brandBlock}>
              <Text style={styles.brandEyebrow}>MEMBER CARD</Text>
              <Text style={styles.brandText}>KOLADE ADEPOJU{ '\n' }MENTORING PROGRAM</Text>
            </View>
          </View>
          <View style={styles.goldRule} />
          <View style={styles.frontBody}>
            <View style={styles.photoFrame}>{data.passportDataUri ? <Image src={data.passportDataUri} style={styles.photo} /> : <View style={styles.photoPlaceholder}><Text style={styles.photoInitials}>{`${data.firstName[0] ?? ''}${data.lastName[0] ?? ''}`.toUpperCase()}</Text></View>}</View>
            <Text style={styles.name}>{fullName}</Text>
            <View style={styles.typePill}><Text style={styles.memberType}>{data.membershipType.replaceAll('_', ' ').toUpperCase()}</Text></View>
            <Text style={styles.institution}>{data.affiliation}</Text>
            <View style={styles.positionPanel}><Text style={styles.positionLabel}>KAMP POSITION</Text><Text style={styles.positionValue}>{data.kampPosition || 'General Member'}</Text></View>
            <View style={styles.idPanel}><Text style={styles.idLabel}>MEMBER ID</Text><Text style={styles.idValue}>{data.memberId}</Text></View>
          </View>
          <View style={styles.frontFooter}><Text style={styles.footerText}>MENTORSHIP  •  COMMUNITY  •  GROWTH</Text><Text style={styles.footerYear}>{data.yearJoined}</Text></View>
        </View>
      </Page>
    </Document>
  )
}

export async function generateMemberCardPDF(data: MemberCardData): Promise<Buffer> {
  return Buffer.from(await renderToBuffer(<MemberCard data={data} />))
}
