'use client'
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface Point { sleepHours: number; stressLevel: number; grade: number }

export default function SleepStressScatter({ data }: { data: Point[] }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Sleep Hours vs Stress Level</h3>
      <ResponsiveContainer width="100%" height={280}>
        <ScatterChart margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="sleepHours" name="Sleep" type="number" domain={[3, 12]} label={{ value: 'Sleep (hrs)', position: 'insideBottom', offset: -4, fontSize: 11 }} tick={{ fontSize: 11 }} />
          <YAxis dataKey="stressLevel" name="Stress" type="number" domain={[1, 10]} label={{ value: 'Stress', angle: -90, position: 'insideLeft', fontSize: 11 }} tick={{ fontSize: 11 }} />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} formatter={(v, n) => [v, n === 'sleepHours' ? 'Sleep hrs' : 'Stress']} />
          <Scatter data={data} fill="#6366f1" fillOpacity={0.6} />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  )
}
