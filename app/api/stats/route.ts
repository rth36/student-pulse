import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const rows = await prisma.response.findMany()

  if (rows.length === 0) {
    return NextResponse.json({ count: 0 })
  }

  const count = rows.length
  const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length

  const avgSleepHours = avg(rows.map(r => r.sleepHours))
  const avgStressLevel = avg(rows.map(r => r.stressLevel))
  const avgScreenTimeHours = avg(rows.map(r => r.screenTimeHours))
  const avgMeditationMinutes = avg(rows.map(r => r.meditationMinutes))
  const pctMeditating = (rows.filter(r => r.meditationMinutes > 0).length / count) * 100
  const pctScreenBeforeBed = (rows.filter(r => r.screenBeforeBed).length / count) * 100

  // Sleep distribution buckets
  const sleepBuckets = ['<6h', '6-7h', '7-8h', '8+h']
  const sleepDist = sleepBuckets.map(label => {
    const filtered = rows.filter(r => {
      if (label === '<6h') return r.sleepHours < 6
      if (label === '6-7h') return r.sleepHours >= 6 && r.sleepHours < 7
      if (label === '7-8h') return r.sleepHours >= 7 && r.sleepHours < 8
      return r.sleepHours >= 8
    })
    return {
      label,
      count: filtered.length,
      avgStress: filtered.length > 0 ? avg(filtered.map(r => r.stressLevel)) : null,
    }
  })

  // Screen time vs stress (binned)
  const screenBuckets = ['0-2h', '2-4h', '4-6h', '6-8h', '8+h']
  const screenDist = screenBuckets.map(label => {
    const filtered = rows.filter(r => {
      if (label === '0-2h') return r.screenTimeHours < 2
      if (label === '2-4h') return r.screenTimeHours >= 2 && r.screenTimeHours < 4
      if (label === '4-6h') return r.screenTimeHours >= 4 && r.screenTimeHours < 6
      if (label === '6-8h') return r.screenTimeHours >= 6 && r.screenTimeHours < 8
      return r.screenTimeHours >= 8
    })
    return {
      label,
      count: filtered.length,
      avgStress: filtered.length > 0 ? avg(filtered.map(r => r.stressLevel)) : null,
    }
  })

  // Meditation impact
  const meditators = rows.filter(r => r.meditationMinutes > 0)
  const nonMeditators = rows.filter(r => r.meditationMinutes === 0)
  const meditationImpact = {
    meditators: {
      count: meditators.length,
      avgStress: meditators.length > 0 ? avg(meditators.map(r => r.stressLevel)) : null,
    },
    nonMeditators: {
      count: nonMeditators.length,
      avgStress: nonMeditators.length > 0 ? avg(nonMeditators.map(r => r.stressLevel)) : null,
    },
  }

  // Stress by grade
  const grades = [9, 10, 11, 12]
  const stressByGrade = grades.map(grade => {
    const filtered = rows.filter(r => r.gradeLevel === grade)
    return {
      grade: `Grade ${grade}`,
      count: filtered.length,
      avgStress: filtered.length > 0 ? avg(filtered.map(r => r.stressLevel)) : null,
      avgSleep: filtered.length > 0 ? avg(filtered.map(r => r.sleepHours)) : null,
    }
  })

  // Scatter data: sleep vs stress (sampled, up to 200 points)
  const scatterData = rows.slice(0, 200).map(r => ({
    sleepHours: r.sleepHours,
    stressLevel: r.stressLevel,
    grade: r.gradeLevel,
  }))

  return NextResponse.json({
    count,
    avgSleepHours: Math.round(avgSleepHours * 10) / 10,
    avgStressLevel: Math.round(avgStressLevel * 10) / 10,
    avgScreenTimeHours: Math.round(avgScreenTimeHours * 10) / 10,
    avgMeditationMinutes: Math.round(avgMeditationMinutes * 10) / 10,
    pctMeditating: Math.round(pctMeditating),
    pctScreenBeforeBed: Math.round(pctScreenBeforeBed),
    sleepDist,
    screenDist,
    meditationImpact,
    stressByGrade,
    scatterData,
  })
}
