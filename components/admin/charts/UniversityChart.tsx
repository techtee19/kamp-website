'use client'

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { UniversityCount } from '@/lib/admin-analytics'

export default function UniversityChart({ data }: { data: UniversityCount[] }) {
  if (data.length === 0) return <div className="flex h-64 items-center justify-center text-sm text-brand-grey">No member data yet.</div>
  return (
    <div className="h-72 w-full" role="img" aria-label="Top ten universities by member count">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 4, right: 20, left: 8, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F0EFEA" horizontal={false} />
          <XAxis type="number" tick={{ fontSize: 11, fill: '#6B6B6B' }} tickLine={false} axisLine={false} allowDecimals={false} />
          <YAxis type="category" dataKey="university" width={132} tick={{ fontSize: 10, fill: '#6B6B6B' }} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{ background: '#202020', border: 'none', borderRadius: 10, color: '#fff', fontSize: 12, boxShadow: '0 8px 24px rgba(0,0,0,0.16)' }}
          />
          <Bar dataKey="count" name="Members" fill="#EFBC2B" radius={[0, 5, 5, 0]} barSize={16} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
