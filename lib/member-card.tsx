import React from 'react'
import path from 'node:path'
import { Document, Page, Text, View, Image, StyleSheet, renderToBuffer } from '@react-pdf/renderer'

export interface MemberCardData {
  firstName: string
  lastName: string
  memberId: string
  university: string
  yearJoined: number
  passportDataUri: string
}

const CARD = { width: 153.07, height: 242.65 }

const styles = StyleSheet.create({
  page: { width: CARD.width, height: CARD.height, padding: 6, backgroundColor: '#EAE6DD', fontFamily: 'Helvetica' },
  front: { flex: 1, overflow: 'hidden', borderRadius: 10, borderWidth: 0.8, borderColor: '#C59A2A', backgroundColor: '#FFFEFB' },
  frontHeader: { height: 43, paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#1B2A4A', borderBottomWidth: 2, borderBottomColor: '#C59A2A' },
  logo: { width: 58, height: 27, objectFit: 'contain' },
  brandText: { color: '#E5C36A', fontSize: 5.5, letterSpacing: 0.8, textAlign: 'right' },
  frontBody: { flex: 1, paddingHorizontal: 12, paddingTop: 9, alignItems: 'center' },
  photoFrame: { width: 66, height: 78, padding: 2, borderWidth: 1.5, borderColor: '#C59A2A', borderRadius: 7, backgroundColor: '#fff' },
  photo: { width: '100%', height: '100%', objectFit: 'cover', borderRadius: 4 },
  name: { marginTop: 7, color: '#17233B', fontFamily: 'Helvetica-Bold', fontSize: 12, textAlign: 'center' },
  memberType: { marginTop: 3, color: '#8A6A20', fontSize: 6, fontFamily: 'Helvetica-Bold', letterSpacing: 1.1, textAlign: 'center' },
  institution: { marginTop: 4, color: '#606979', fontSize: 6.5, textAlign: 'center' },
  idPanel: { width: '100%', marginTop: 8, paddingVertical: 5, paddingHorizontal: 7, borderLeftWidth: 2, borderLeftColor: '#C59A2A', backgroundColor: '#F3F0E8' },
  idLabel: { color: '#77705F', fontSize: 5, letterSpacing: 1 },
  idValue: { marginTop: 2, color: '#17233B', fontFamily: 'Helvetica-Bold', fontSize: 8.5 },
  frontFooter: { height: 19, paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#1B2A4A' },
  footerText: { color: '#E5C36A', fontSize: 5, letterSpacing: 0.7 },
  footerYear: { color: '#fff', fontSize: 5.5 },

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
            <View><Text style={styles.brandText}>KOLADE ADEPOJU</Text><Text style={styles.brandText}>MENTORING PROGRAM</Text></View>
          </View>
          <View style={styles.frontBody}>
            <View style={styles.photoFrame}><Image src={data.passportDataUri} style={styles.photo} /></View>
            <Text style={styles.name}>{fullName}</Text>
            <Text style={styles.memberType}>KAMP MEMBER</Text>
            <Text style={styles.institution}>{data.university}</Text>
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
