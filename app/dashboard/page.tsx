import StatsCard from '@/components/StatsCard'
import FindingsBlock from '@/components/FindingsBlock'
import SleepStressScatter from '@/components/charts/SleepStressScatter'
import SleepDistributionBar from '@/components/charts/SleepDistributionBar'
import ScreenTimeStressBar from '@/components/charts/ScreenTimeStressBar'
import MeditationImpactBar from '@/components/charts/MeditationImpactBar'
import StressByGradeBar from '@/components/charts/StressByGradeBar'

export const metadata = { title: 'Research Dashboard — Student Wellness Study' }
export const dynamic = 'force-dynamic'

async function getStats() {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'
  const res = await fetch(`${base}/api/stats`, { cache: 'no-store' })
  return res.json()
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
