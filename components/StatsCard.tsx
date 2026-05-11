interface StatsCardProps {
  label: string
  value: string | number
  sub?: string
}

export default function StatsCard({ label, value, sub }: StatsCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-1">
      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</span>
      <span className="text-3xl font-bold text-gray-900">{value}</span>
      {sub && <span className="text-sm text-gray-400">{sub}</span>}
    </div>
  )
}
