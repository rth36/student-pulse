interface StatsData {
  count: number
  avgSleepHours: number
  avgStressLevel: number
  avgScreenTimeHours: number
  pctMeditating: number
  pctScreenBeforeBed: number
  sleepDist: { label: string; avgStress: number | null }[]
  meditationImpact: {
    meditators: { count: number; avgStress: number | null }
    nonMeditators: { count: number; avgStress: number | null }
  }
}

export default function FindingsBlock({ stats }: { stats: StatsData }) {
  if (stats.count < 5) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-amber-800 text-sm">
        Not enough responses yet to surface findings. Collect at least 5 responses.
      </div>
    )
  }

  const findings: string[] = []

  // Sleep vs stress
  const shortSleep = stats.sleepDist.find(b => b.label === '<6h')
  const goodSleep = stats.sleepDist.find(b => b.label === '8+h')
  if (shortSleep?.avgStress != null && goodSleep?.avgStress != null) {
    const diff = shortSleep.avgStress - goodSleep.avgStress
    if (diff >= 1) {
      findings.push(
        `Students sleeping fewer than 6 hours report an average stress level of ${shortSleep.avgStress.toFixed(1)}/10, compared to ${goodSleep.avgStress.toFixed(1)}/10 for those sleeping 8+ hours — a difference of ${diff.toFixed(1)} points.`
      )
    } else {
      findings.push(
        `Sleep duration and stress levels do not show a strong correlation in this dataset (difference of ${diff.toFixed(1)} stress points across sleep groups).`
      )
    }
  }

  // Meditation vs stress
  const { meditators, nonMeditators } = stats.meditationImpact
  if (meditators.avgStress != null && nonMeditators.avgStress != null && meditators.count >= 3) {
    const diff = nonMeditators.avgStress - meditators.avgStress
    if (diff >= 1) {
      findings.push(
        `Students who meditate daily report ${diff.toFixed(1)} points lower average stress (${meditators.avgStress.toFixed(1)}) versus non-meditators (${nonMeditators.avgStress.toFixed(1)}).`
      )
    } else {
      findings.push(
        `Meditation practice does not show a significant stress difference in this dataset (meditators: ${meditators.avgStress.toFixed(1)}, non-meditators: ${nonMeditators.avgStress.toFixed(1)}).`
      )
    }
  } else if (meditators.count < 3) {
    findings.push('Too few meditators in the sample to compare stress levels.')
  }

  // Screen before bed
  if (stats.pctScreenBeforeBed > 50) {
    findings.push(
      `${stats.pctScreenBeforeBed}% of respondents use screens in the last hour before bed.`
    )
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
      <h3 className="font-semibold text-blue-900 mb-3">Data Findings</h3>
      <p className="text-xs text-blue-600 mb-4">
        Based on {stats.count} anonymous responses. Findings are computed directly from the data — no predetermined conclusions.
      </p>
      <ul className="space-y-3">
        {findings.map((f, i) => (
          <li key={i} className="text-sm text-blue-800 flex gap-2">
            <span className="mt-0.5 text-blue-400">→</span>
            <span>{f}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
