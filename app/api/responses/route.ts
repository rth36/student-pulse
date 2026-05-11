import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const body = await req.json()

  const {
    gradeLevel,
    bedtimeHour,
    wakeHour,
    sleepHours,
    sleepQuality,
    stressLevel,
    screenTimeHours,
    screenBeforeBed,
    meditationMinutes,
    breathingExercise,
  } = body

  if (
    gradeLevel == null || bedtimeHour == null || wakeHour == null ||
    sleepHours == null || sleepQuality == null || stressLevel == null ||
    screenTimeHours == null || screenBeforeBed == null ||
    meditationMinutes == null || breathingExercise == null
  ) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  if (![9, 10, 11, 12].includes(Number(gradeLevel))) {
    return NextResponse.json({ error: 'Invalid grade level' }, { status: 400 })
  }
  if (sleepQuality < 1 || sleepQuality > 5) {
    return NextResponse.json({ error: 'sleepQuality must be 1–5' }, { status: 400 })
  }
  if (stressLevel < 1 || stressLevel > 10) {
    return NextResponse.json({ error: 'stressLevel must be 1–10' }, { status: 400 })
  }

  const response = await prisma.response.create({
    data: {
      gradeLevel: Number(gradeLevel),
      bedtimeHour: Number(bedtimeHour),
      wakeHour: Number(wakeHour),
      sleepHours: Number(sleepHours),
      sleepQuality: Number(sleepQuality),
      stressLevel: Number(stressLevel),
      screenTimeHours: Number(screenTimeHours),
      screenBeforeBed: Boolean(screenBeforeBed),
      meditationMinutes: Number(meditationMinutes),
      breathingExercise: Boolean(breathingExercise),
    },
  })

  return NextResponse.json({ success: true, id: response.id }, { status: 201 })
}

export async function GET() {
  const rows = await prisma.response.findMany({ orderBy: { createdAt: 'asc' } })

  const headers = [
    'id', 'createdAt', 'gradeLevel',
    'bedtimeHour', 'wakeHour', 'sleepHours', 'sleepQuality',
    'stressLevel',
    'screenTimeHours', 'screenBeforeBed',
    'meditationMinutes', 'breathingExercise',
  ]

  const csv = [
    headers.join(','),
    ...rows.map(r =>
      headers.map(h => String((r as Record<string, unknown>)[h] ?? '')).join(',')
    ),
  ].join('\n')

  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="student-wellness-data.csv"',
    },
  })
}
