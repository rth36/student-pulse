import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { name, email } = body

  if (!name?.trim() || !email?.trim()) {
    return NextResponse.json({ error: 'Name and email are required' }, { status: 400 })
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.trim())) {
    return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
  }

  await prisma.raffleEntry.create({
    data: { name: name.trim(), email: email.trim().toLowerCase() },
  })

  return NextResponse.json({ success: true }, { status: 201 })
}
