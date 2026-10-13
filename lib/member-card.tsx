import React from 'react'
import path from 'node:path'
import { Document, Page, Text, View, Image, StyleSheet, renderToBuffer } from '@react-pdf/renderer'

export interface MemberCardData {
  firstName: string
  lastName: string
  memberId: string
  membershipType: string
  affiliation: string
  yearJoined: number
  passportDataUri?: string
}

const CARD = { width: 153.07, height: 242.65 }

const styles = StyleSheet.create({
  page: { width: CARD.width, height: CARD.height, padding: 5, backgroundColor: '#F1EFE9', fontFamily: 'Helvetica' },
  front: { flex: 1, overflow: 'hidden', borderRadius: 10, borderWidth: 0.6, borderColor: '#D9D4C9', backgroundColor: '#FFFEFC' },
  frontHeader: { height: 43, paddingHorizontal: 11, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#1B2A4A', borderBottomWidth: 2, borderBottomColor: '#EFBC2B' },
  logo: { width: 52, height: 28, objectFit: 'contain' },
  brandBlock: { alignItems: 'flex-end' },
  brandEyebrow: { color: '#EFBC2B', fontFamily: 'Helvetica-Bold', fontSize: 5.2, letterSpacing: 1.2 },
  brandText: { marginTop: 2, color: '#FFFFFF', fontSize: 5.3, letterSpacing: 0.5, textAlign: 'right' },
  frontBody: { flex: 1, paddingHorizontal: 12, paddingTop: 8, paddingBottom: 6, alignItems: 'center' },
  photoFrame: { width: 59, height: 67, padding: 2, borderWidth: 1, borderColor: '#D7C27D', borderRadius: 8, backgroundColor: '#fff' },
  photo: { width: '100%', height: '100%', objectFit: 'cover', borderRadius: 5 },
  photoPlaceholder: { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F1EFE9', borderRadius: 5 },
  photoInitials: { color: '#1B2A4A', fontFamily: 'Helvetica-Bold', fontSize: 17, letterSpacing: 1 },
  name: { width: '100%', marginTop: 6, color: '#17233B', fontFamily: 'Helvetica-Bold', fontSize: 11.5, textAlign: 'center' },
  typePill: { marginTop: 4, paddingVertical: 3, paddingHorizontal: 7, borderRadius: 99, backgroundColor: '#F5F0E1' },
  memberType: { color: '#745A1C', fontSize: 5.7, fontFamily: 'Helvetica-Bold', letterSpacing: 0.8, textAlign: 'center' },
  institution: { width: '100%', marginTop: 5, color: '#626B79', fontSize: 6.3, lineHeight: 1.3, textAlign: 'center' },
  idPanel: { width: '100%', marginTop: 7, paddingVertical: 5, paddingHorizontal: 7, borderRadius: 5, backgroundColor: '#F3F1EB' },
  idLabel: { color: '#7A7468', fontFamily: 'Helvetica-Bold', fontSize: 4.8, letterSpacing: 1 },
  idValue: { marginTop: 2, color: '#17233B', fontFamily: 'Helvetica-Bold', fontSize: 7.5, letterSpacing: 0.25 },
  frontFooter: { height: 20, paddingHorizontal: 11, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#1B2A4A' },
  footerText: { color: '#FFFFFF', fontSize: 5, letterSpacing: 0.45 },
  footerYear: { color: '#EFBC2B', fontFamily: 'Helvetica-Bold', fontSize: 5.8 },

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
              <Text style={styles.brandEyebrow}>KAMP MEMBERSHIP</Text>
              <Text style={styles.brandText}>KOLADE ADEPOJU MENTORING PROGRAM</Text>
            </View>
          </View>
          <View style={styles.frontBody}>
            <View style={styles.photoFrame}>{data.passportDataUri ? <Image src={data.passportDataUri} style={styles.photo} /> : <View style={styles.photoPlaceholder}><Text style={styles.photoInitials}>{`${data.firstName[0] ?? ''}${data.lastName[0] ?? ''}`.toUpperCase()}</Text></View>}</View>
            <Text style={styles.name}>{fullName}</Text>
            <View style={styles.typePill}><Text style={styles.memberType}>{data.membershipType.replaceAll('_', ' ').toUpperCase()}</Text></View>
            <Text style={styles.institution}>{data.affiliation}</Text>
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
