'use client'

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { SignupMonth } from '@/lib/admin-analytics'

export default function SignupTrendChart({ data }: { data: SignupMonth[] }) {
  if (data.every((point) => point.count === 0)) {
    return <EmptyChart message="Member signup activity will appear here." />
  }

  return (
    <div className="h-64 w-full" role="img" aria-label="Monthly member signups for the last twelve months">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 12, left: -18, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F0EFEA" vertical={false} />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6B6B6B' }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#6B6B6B' }} tickLine={false} axisLine={false} allowDecimals={false} />
          <Tooltip
            contentStyle={{ background: '#202020', border: 'none', borderRadius: 10, color: '#fff', fontSize: 12, boxShadow: '0 8px 24px rgba(0,0,0,0.16)' }}
            labelStyle={{ color: '#EFBC2B' }}
          />
          <Line type="monotone" dataKey="count" stroke="#EFBC2B" strokeWidth={2.5} dot={{ fill: '#EFBC2B', r: 3 }} activeDot={{ r: 5 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

function EmptyChart({ message }: { message: string }) {
  return <div className="flex h-64 items-center justify-center text-sm text-brand-grey">{message}</div>
}
