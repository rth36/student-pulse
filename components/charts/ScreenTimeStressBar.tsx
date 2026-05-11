'use client'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

interface Bucket { label: string; count: number; avgStress: number | null }

export default function ScreenTimeStressBar({ data }: { data: Bucket[] }) {
  const filled = data.filter(d => d.avgStress != null)
  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Avg Stress by Daily Screen Time</h3>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={filled} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="label" tick={{ fontSize: 11 }} />
          <YAxis domain={[0, 10]} tick={{ fontSize: 11 }} />
          <Tooltip formatter={(v) => [Number(v).toFixed(1), 'Avg Stress']} />
          <Bar dataKey="avgStress" radius={[4, 4, 0, 0]}>
            {filled.map((_, i) => (
              <Cell key={i} fill={`hsl(${220 + i * 12}, 70%, ${60 - i * 4}%)`} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
