'use client'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface Bucket { label: string; count: number; avgStress: number | null }

export default function SleepDistributionBar({ data }: { data: Bucket[] }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Sleep Duration Distribution</h3>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="label" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip formatter={(v) => [v, 'Students']} />
          <Bar dataKey="count" fill="#818cf8" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
