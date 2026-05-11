import StatsCard from '@/components/StatsCard'
import FindingsBlock from '@/components/FindingsBlock'
import SleepStressScatter from '@/components/charts/SleepStressScatter'
import SleepDistributionBar from '@/components/charts/SleepDistributionBar'
import ScreenTimeStressBar from '@/components/charts/ScreenTimeStressBar'
import MeditationImpactBar from '@/components/charts/MeditationImpactBar'
import StressByGradeBar from '@/components/charts/StressByGradeBar'
import { prisma } from '@/lib/prisma'

export const metadata = { title: 'Research Dashboard — Student Wellness Study' }
export const dynamic = 'force-dynamic'

async function getStats() {
  const rows = await prisma.response.findMany()

  if (rows.length === 0) return {
    count: 0, avgSleepHours: 0, avgStressLevel: 0, avgScreenTimeHours: 0,
    avgMeditationMinutes: 0, pctMeditating: 0, pctScreenBeforeBed: 0,
    sleepDist: [], screenDist: [], stressByGrade: [], scatterData: [],
    meditationImpact: { meditators: { count: 0, avgStress: null }, nonMeditators: { count: 0, avgStress: null } },
  }

  const count = rows.length
  const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length

  const avgSleepHours = avg(rows.map(r => r.sleepHours))
  const avgStressLevel = avg(rows.map(r => r.stressLevel))
  const avgScreenTimeHours = avg(rows.map(r => r.screenTimeHours))
  const avgMeditationMinutes = avg(rows.map(r => r.meditationMinutes))
  const pctMeditating = Math.round((rows.filter(r => r.meditationMinutes > 0).length / count) * 100)
  const pctScreenBeforeBed = Math.round((rows.filter(r => r.screenBeforeBed).length / count) * 100)

  const sleepBuckets = ['<6h', '6-7h', '7-8h', '8+h']
  const sleepDist = sleepBuckets.map(label => {
    const filtered = rows.filter(r => {
      if (label === '<6h') return r.sleepHours < 6
      if (label === '6-7h') return r.sleepHours >= 6 && r.sleepHours < 7
      if (label === '7-8h') return r.sleepHours >= 7 && r.sleepHours < 8
      return r.sleepHours >= 8
    })
    return { label, count: filtered.length, avgStress: filtered.length > 0 ? avg(filtered.map(r => r.stressLevel)) : null }
  })

  const screenBuckets = ['0-2h', '2-4h', '4-6h', '6-8h', '8+h']
  const screenDist = screenBuckets.map(label => {
    const filtered = rows.filter(r => {
      if (label === '0-2h') return r.screenTimeHours < 2
      if (label === '2-4h') return r.screenTimeHours >= 2 && r.screenTimeHours < 4
      if (label === '4-6h') return r.screenTimeHours >= 4 && r.screenTimeHours < 6
      if (label === '6-8h') return r.screenTimeHours >= 6 && r.screenTimeHours < 8
      return r.screenTimeHours >= 8
    })
    return { label, count: filtered.length, avgStress: filtered.length > 0 ? avg(filtered.map(r => r.stressLevel)) : null }
  })

  const meditators = rows.filter(r => r.meditationMinutes > 0)
  const nonMeditators = rows.filter(r => r.meditationMinutes === 0)
  const meditationImpact = {
    meditators: { count: meditators.length, avgStress: meditators.length > 0 ? avg(meditators.map(r => r.stressLevel)) : null },
    nonMeditators: { count: nonMeditators.length, avgStress: nonMeditators.length > 0 ? avg(nonMeditators.map(r => r.stressLevel)) : null },
  }

  const stressByGrade = [9, 10, 11, 12].map(grade => {
    const filtered = rows.filter(r => r.gradeLevel === grade)
    return {
      grade: `Grade ${grade}`,
      count: filtered.length,
      avgStress: filtered.length > 0 ? avg(filtered.map(r => r.stressLevel)) : null,
      avgSleep: filtered.length > 0 ? avg(filtered.map(r => r.sleepHours)) : null,
    }
  })

  const scatterData = rows.slice(0, 200).map(r => ({ sleepHours: r.sleepHours, stressLevel: r.stressLevel, grade: r.gradeLevel }))

  return {
    count,
    avgSleepHours: Math.round(avgSleepHours * 10) / 10,
    avgStressLevel: Math.round(avgStressLevel * 10) / 10,
    avgScreenTimeHours: Math.round(avgScreenTimeHours * 10) / 10,
    avgMeditationMinutes: Math.round(avgMeditationMinutes * 10) / 10,
    pctMeditating,
    pctScreenBeforeBed,
    sleepDist,
    screenDist,
    meditationImpact,
    stressByGrade,
    scatterData,
  }
}

export default async function DashboardPage() {
  const stats = await getStats()

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Student Wellness — Research Dashboard</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Live data from {stats.count ?? 0} anonymous student responses.
            Findings are computed directly from submissions — no predetermined conclusions.
          </p>
          <a
            href="/api/responses"
            className="inline-block mt-3 text-xs font-medium text-indigo-600 border border-indigo-200 rounded-lg px-3 py-1.5 hover:bg-indigo-50 transition-colors"
          >
            ↓ Download CSV
          </a>
        </div>

        {stats.count === 0 ? (
          <div className="text-center py-24 text-gray-400">
            <div className="text-4xl mb-3">📭</div>
            <p className="text-lg font-medium">No responses yet.</p>
            <a href="/survey" className="mt-4 inline-block text-indigo-600 font-medium hover:underline">
              Be the first to take the survey →
            </a>
          </div>
        ) : (
          <>
            {/* Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <StatsCard label="Responses" value={stats.count} />
              <StatsCard label="Avg Sleep" value={`${stats.avgSleepHours}h`} sub="per night" />
              <StatsCard label="Avg Stress" value={`${stats.avgStressLevel}/10`} />
              <StatsCard label="Avg Screen Time" value={`${stats.avgScreenTimeHours}h`} sub="per day" />
              <StatsCard label="Meditating" value={`${stats.pctMeditating}%`} sub="of students" />
              <StatsCard label="Screen Before Bed" value={`${stats.pctScreenBeforeBed}%`} sub="of students" />
              <StatsCard label="Avg Meditation" value={`${stats.avgMeditationMinutes} min`} sub="per day" />
            </div>

            {/* Findings */}
            <div className="mb-8">
              <FindingsBlock stats={stats} />
            </div>

            {/* Charts grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <SleepDistributionBar data={stats.sleepDist} />
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <StressByGradeBar data={stats.stressByGrade} />
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-5 md:col-span-2">
                <SleepStressScatter data={stats.scatterData} />
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <ScreenTimeStressBar data={stats.screenDist} />
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <MeditationImpactBar data={stats.meditationImpact} />
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  )
}
