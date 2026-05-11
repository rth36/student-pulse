'use client'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

interface MeditationData {
  meditators: { count: number; avgStress: number | null }
  nonMeditators: { count: number; avgStress: number | null }
}

export default function MeditationImpactBar({ data }: { data: MeditationData }) {
  const chartData = [
    { label: `Meditates (n=${data.meditators.count})`, avgStress: data.meditators.avgStress },
    { label: `No meditation (n=${data.nonMeditators.count})`, avgStress: data.nonMeditators.avgStress },
  ].filter(d => d.avgStress != null)

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Avg Stress: Meditators vs Non-Meditators</h3>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={chartData} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="label" tick={{ fontSize: 10 }} />
          <YAxis domain={[0, 10]} tick={{ fontSize: 11 }} />
          <Tooltip formatter={(v) => [Number(v).toFixed(1), 'Avg Stress']} />
          <Bar dataKey="avgStress" radius={[4, 4, 0, 0]}>
            <Cell fill="#34d399" />
            <Cell fill="#f87171" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
