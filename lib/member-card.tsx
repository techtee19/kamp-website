import React from 'react'
import { Document, Page, Text, View, StyleSheet, renderToBuffer } from '@react-pdf/renderer'

export interface MemberCardData {
  firstName: string
  lastName: string
  memberId: string
  university: string
  yearJoined: number
}

const styles = StyleSheet.create({
  page: { width: 242.65, height: 153.07, padding: 13, backgroundColor: '#1B2A4A', color: '#fff', fontFamily: 'Helvetica' },
  card: { flex: 1, borderWidth: 1, borderColor: '#C49A22', padding: 12, justifyContent: 'space-between' },
  brand: { color: '#C49A22', fontSize: 15, fontFamily: 'Helvetica-Bold', letterSpacing: 2 },
  label: { color: '#fff', fontSize: 6, letterSpacing: 1.3, marginTop: 3 },
  name: { color: '#fff', fontSize: 15, fontFamily: 'Helvetica-Bold' },
  university: { color: '#d9dfeb', fontSize: 8, marginTop: 4 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  idLabel: { color: '#C49A22', fontSize: 6, letterSpacing: 1 },
  id: { color: '#fff', fontSize: 9, fontFamily: 'Helvetica-Bold', marginTop: 3 },
  year: { color: '#d9dfeb', fontSize: 7 },
})

function MemberCard({ data }: { data: MemberCardData }) {
  return <Document title={`KAMP Member Card ${data.memberId}`} author="KAMP"><Page size={{ width: 242.65, height: 153.07 }} style={styles.page}><View style={styles.card}><View><Text style={styles.brand}>KAMP</Text><Text style={styles.label}>MEMBERSHIP CARD</Text></View><View><Text style={styles.name}>{data.firstName} {data.lastName}</Text><Text style={styles.university}>{data.university}</Text></View><View style={styles.row}><View><Text style={styles.idLabel}>MEMBER ID</Text><Text style={styles.id}>{data.memberId}</Text></View><Text style={styles.year}>Joined {data.yearJoined}</Text></View></View></Page></Document>
}

export async function generateMemberCardPDF(data: MemberCardData): Promise<Buffer> {
  return Buffer.from(await renderToBuffer(<MemberCard data={data} />))
}
