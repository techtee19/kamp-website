'use client'

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { CategoryCount } from '@/lib/admin-analytics'

export default function StatesChart({ data }: { data: CategoryCount[] }) {
  if (data.length === 0) return <div className="flex h-64 items-center justify-center text-sm text-brand-grey">No member data yet.</div>
  return (
    <div className="h-64 w-full" role="img" aria-label="Top ten states of origin by member count">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 10, left: -18, bottom: 26 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F0EFEA" vertical={false} />
          <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#6B6B6B' }} tickLine={false} axisLine={false} angle={-30} textAnchor="end" interval={0} />
          <YAxis tick={{ fontSize: 11, fill: '#6B6B6B' }} tickLine={false} axisLine={false} allowDecimals={false} />
          <Tooltip
            contentStyle={{ background: '#1A1A1A', border: 'none', borderRadius: 8, color: '#fff', fontSize: 12 }}
          />
          <Bar dataKey="count" name="Members" fill="#1A1A1A" radius={[5, 5, 0, 0]} barSize={24} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
