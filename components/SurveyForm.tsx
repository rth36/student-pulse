'use client'
import { useState } from 'react'
import Image from 'next/image'

const SONY_IMG = '/headphones.jpg'
const SONY_URL = 'https://electronics.sony.com/audio/headphones/headband/p/wh1000xm5-b'

const TOTAL_STEPS = 6

type FormData = {
  gradeLevel: number | null
  bedtimeHour: number
  wakeHour: number
  sleepHours: number
  sleepQuality: number
  stressLevel: number
  screenTimeHours: number
  screenBeforeBed: boolean | null
  meditationMinutes: number
  breathingExercise: boolean | null
}

const HOURS = Array.from({ length: 24 }, (_, i) => i)
function fmtHour(h: number) {
  if (h === 0) return '12:00 AM'
  if (h < 12) return `${h}:00 AM`
  if (h === 12) return '12:00 PM'
  return `${h - 12}:00 PM`
}

function ProgressBar({ step }: { step: number }) {
  return (
    <div className="w-full mb-8">
      <div className="flex justify-between text-xs text-gray-400 mb-1">
        <span>Step {step} of {TOTAL_STEPS}</span>
        <span>{Math.round((step / TOTAL_STEPS) * 100)}%</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-indigo-500 rounded-full transition-all duration-500"
          style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
        />
      </div>
    </div>
  )
}

function OptionButton({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full py-4 px-5 rounded-xl border-2 text-left font-medium transition-all ${
        selected
          ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
          : 'border-gray-200 bg-white text-gray-700 hover:border-indigo-300'
      }`}
    >
      {label}
    </button>
  )
}

function EmojiScale({
  value, min, max, emojis, labels, onChange,
}: {
  value: number; min: number; max: number
  emojis: string[]; labels: [string, string]
  onChange: (v: number) => void
}) {
  const steps = Array.from({ length: max - min + 1 }, (_, i) => i + min)
  return (
    <div className="space-y-4">
      <div className="flex justify-between gap-2">
        {steps.map((v) => {
          const idx = Math.round(((v - min) / (max - min)) * (emojis.length - 1))
          return (
            <button
              key={v}
              type="button"
              onClick={() => onChange(v)}
              className={`flex-1 flex flex-col items-center gap-1 py-3 rounded-xl border-2 transition-all ${
                value === v
                  ? 'border-indigo-500 bg-indigo-50 scale-105 shadow-sm'
                  : 'border-gray-100 bg-gray-50 hover:border-indigo-200'
              }`}
            >
              <span className="text-xl">{emojis[idx]}</span>
              <span className="text-xs font-semibold text-gray-600">{v}</span>
            </button>
          )
        })}
      </div>
      <div className="flex justify-between text-xs text-gray-400">
        <span>{labels[0]}</span>
        <span>{labels[1]}</span>
      </div>
    </div>
  )
}

export default function SurveyForm() {
  const [step, setStep] = useState(0) // 0 = welcome
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [raffleStep, setRaffleStep] = useState(false)
  const [raffleName, setRaffleName] = useState('')
  const [raffleEmail, setRaffleEmail] = useState('')
  const [raffleSubmitted, setRaffleSubmitted] = useState(false)

  const [form, setForm] = useState<FormData>({
    gradeLevel: null,
    bedtimeHour: 23,
    wakeHour: 7,
    sleepHours: 7,
    sleepQuality: 3,
    stressLevel: 5,
    screenTimeHours: 4,
    screenBeforeBed: null,
    meditationMinutes: 0,
    breathingExercise: null,
  })

  function set<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  async function handleSubmit() {
    setSubmitting(true)
    await fetch('/api/responses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setSubmitting(false)
    setSubmitted(true)
  }

  async function handleRaffle() {
    if (!raffleName.trim() || !raffleEmail.trim()) return
    await fetch('/api/raffle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: raffleName, email: raffleEmail }),
    })
    setRaffleSubmitted(true)
  }

  // Welcome screen
  if (step === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-12">
        <a
          href={SONY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="block bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-5 text-white shadow-lg hover:opacity-95 transition-opacity mb-6"
        >
          <div className="flex items-center gap-4">
            <div className="bg-white rounded-xl p-2 flex-shrink-0">
              <Image src={SONY_IMG} alt="Sony WH-1000XM5" width={72} height={72} className="rounded-lg object-contain" unoptimized />
            </div>
            <div className="text-left">
              <p className="text-xs font-medium text-indigo-200 uppercase tracking-wide">Raffle Prize</p>
              <p className="font-bold text-lg leading-tight">Sony WH-1000XM5</p>
              <p className="text-indigo-100 text-sm">Noise canceling · $349.99 · Tap to preview ↗</p>
            </div>
          </div>
        </a>
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Student Wellness Survey</h1>
          <p className="text-gray-500 text-sm mb-4">
            Anonymous · 6 quick questions · Your data helps shape school policy
          </p>
          <ul className="space-y-2 text-sm text-gray-600 mb-6">
            <li className="flex gap-2"><span>😴</span> Sleep habits</li>
            <li className="flex gap-2"><span>😰</span> Stress levels</li>
            <li className="flex gap-2"><span>📱</span> Screen time</li>
            <li className="flex gap-2"><span>🧘</span> Wellness practices</li>
          </ul>
          <button
            onClick={() => setStep(1)}
            className="w-full py-4 bg-indigo-600 text-white rounded-xl font-semibold text-lg hover:bg-indigo-700 transition-colors shadow"
          >
            Start Survey →
          </button>
        </div>
        <p className="text-center text-xs text-gray-400">Fully anonymous. No personal info collected in the survey.</p>
      </div>
    )
  }

  // After submission
  if (submitted) {
    if (raffleSubmitted) {
      return (
        <div className="max-w-lg mx-auto px-4 py-16 text-center">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">You&apos;re in the raffle!</h2>
          <p className="text-gray-500 mb-6">We&apos;ll contact you if you win. Good luck!</p>
          <a href="/dashboard" className="inline-block py-3 px-6 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors">
            View Research Dashboard →
          </a>
        </div>
      )
    }

    if (raffleStep) {
      return (
        <div className="max-w-lg mx-auto px-4 py-12">
          <a
            href={SONY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-5 text-white shadow-lg hover:opacity-95 transition-opacity mb-6"
          >
            <div className="flex items-center gap-4">
              <div className="bg-white rounded-xl p-2 flex-shrink-0">
                <Image src={SONY_IMG} alt="Sony WH-1000XM5" width={72} height={72} className="rounded-lg object-contain" unoptimized />
              </div>
              <div className="text-left">
                <p className="text-xs font-medium text-indigo-200 uppercase tracking-wide">Enter to Win</p>
                <p className="font-bold text-lg leading-tight">Sony WH-1000XM5</p>
                <p className="text-indigo-100 text-sm">Not linked to your survey answers ↗</p>
              </div>
            </div>
          </a>
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your name</label>
              <input
                type="text"
                value={raffleName}
                onChange={e => setRaffleName(e.target.value)}
                placeholder="First name is fine"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
              <input
                type="email"
                value={raffleEmail}
                onChange={e => setRaffleEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <button
              onClick={handleRaffle}
              disabled={!raffleName.trim() || !raffleEmail.trim()}
              className="w-full py-4 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Enter Raffle 🎧
            </button>
            <button
              onClick={() => setRaffleSubmitted(true)}
              className="w-full py-3 text-gray-400 text-sm hover:text-gray-600 transition-colors"
            >
              Skip, no thanks
            </button>
          </div>
        </div>
      )
    }

    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="text-5xl mb-4">✅</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Thanks for participating!</h2>
        <p className="text-gray-500 mb-8">Your anonymous response has been recorded.</p>
        <button
          onClick={() => setRaffleStep(true)}
          className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold text-lg shadow hover:opacity-90 transition-opacity mb-4"
        >
          Enter to Win Sony WH-1000XM5 🎧
        </button>
        <a href="/dashboard" className="block text-sm text-gray-400 hover:text-gray-600 transition-colors">
          No thanks, take me to the dashboard →
        </a>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <ProgressBar step={step} />

      {step === 1 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900">What grade are you in?</h2>
          <p className="text-sm text-gray-400">Select one</p>
          {[9, 10, 11, 12].map(g => (
            <OptionButton
              key={g}
              label={`Grade ${g}`}
              selected={form.gradeLevel === g}
              onClick={() => { set('gradeLevel', g); setTimeout(() => setStep(2), 200) }}
            />
          ))}
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900">😴 Sleep</h2>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">What time do you usually go to bed?</label>
            <select
              value={form.bedtimeHour}
              onChange={e => set('bedtimeHour', Number(e.target.value))}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              {HOURS.map(h => <option key={h} value={h}>{fmtHour(h)}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">What time do you usually wake up?</label>
            <select
              value={form.wakeHour}
              onChange={e => set('wakeHour', Number(e.target.value))}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              {HOURS.map(h => <option key={h} value={h}>{fmtHour(h)}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              About how many hours of sleep do you get? <span className="font-bold text-indigo-600">{form.sleepHours}h</span>
            </label>
            <input type="range" min={2} max={12} step={0.5} value={form.sleepHours}
              onChange={e => set('sleepHours', Number(e.target.value))}
              className="w-full accent-indigo-500" />
            <div className="flex justify-between text-xs text-gray-400 mt-1"><span>2h</span><span>12h</span></div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-3">How would you rate your sleep quality?</label>
            <EmojiScale
              value={form.sleepQuality} min={1} max={5}
              emojis={['😩', '😕', '😐', '🙂', '😊']}
              labels={['Very poor', 'Excellent']}
              onChange={v => set('sleepQuality', v)}
            />
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900">😰 Stress</h2>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-3">
              How stressed do you generally feel on a typical school day?
            </label>
            <EmojiScale
              value={form.stressLevel} min={1} max={10}
              emojis={['😌', '🙂', '😐', '😤', '😰', '😫']}
              labels={['No stress', 'Extremely stressed']}
              onChange={v => set('stressLevel', v)}
            />
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900">📱 Screen Time</h2>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              On average, how many hours per day do you spend on screens (phone, computer, TV)?{' '}
              <span className="font-bold text-indigo-600">{form.screenTimeHours}h</span>
            </label>
            <input type="range" min={0} max={16} step={0.5} value={form.screenTimeHours}
              onChange={e => set('screenTimeHours', Number(e.target.value))}
              className="w-full accent-indigo-500" />
            <div className="flex justify-between text-xs text-gray-400 mt-1"><span>0h</span><span>16h</span></div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-3">
              Do you use screens in the last hour before going to sleep?
            </label>
            <div className="grid grid-cols-2 gap-3">
              {([true, false] as const).map(v => (
                <OptionButton
                  key={String(v)}
                  label={v ? '📱 Yes' : '🚫 No'}
                  selected={form.screenBeforeBed === v}
                  onClick={() => set('screenBeforeBed', v)}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {step === 5 && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900">🧘 Wellness Practices</h2>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              How many minutes per day do you spend meditating or doing mindfulness?{' '}
              <span className="font-bold text-indigo-600">{form.meditationMinutes === 0 ? 'None' : `${form.meditationMinutes} min`}</span>
            </label>
            <input type="range" min={0} max={60} step={5} value={form.meditationMinutes}
              onChange={e => set('meditationMinutes', Number(e.target.value))}
              className="w-full accent-indigo-500" />
            <div className="flex justify-between text-xs text-gray-400 mt-1"><span>None</span><span>60 min</span></div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-3">
              Do you practice any breathing exercises (e.g. box breathing, deep breaths)?
            </label>
            <div className="grid grid-cols-2 gap-3">
              {([true, false] as const).map(v => (
                <OptionButton
                  key={String(v)}
                  label={v ? '✅ Yes' : '❌ No'}
                  selected={form.breathingExercise === v}
                  onClick={() => set('breathingExercise', v)}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {step === 6 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900">All done! Review your answers</h2>
          <div className="bg-gray-50 rounded-xl divide-y divide-gray-100 text-sm">
            {[
              ['Grade', `Grade ${form.gradeLevel}`],
              ['Bedtime', fmtHour(form.bedtimeHour)],
              ['Wake time', fmtHour(form.wakeHour)],
              ['Sleep hours', `${form.sleepHours}h`],
              ['Sleep quality', `${form.sleepQuality}/5`],
              ['Stress level', `${form.stressLevel}/10`],
              ['Screen time', `${form.screenTimeHours}h/day`],
              ['Screen before bed', form.screenBeforeBed ? 'Yes' : 'No'],
              ['Meditation', form.meditationMinutes === 0 ? 'None' : `${form.meditationMinutes} min/day`],
              ['Breathing exercises', form.breathingExercise ? 'Yes' : 'No'],
            ].map(([label, val]) => (
              <div key={label} className="flex justify-between px-4 py-2.5">
                <span className="text-gray-500">{label}</span>
                <span className="font-medium text-gray-800">{val}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex gap-3 mt-8">
        {step > 1 && (
          <button
            onClick={() => setStep(s => s - 1)}
            className="flex-1 py-3 border-2 border-gray-200 text-gray-600 rounded-xl font-medium hover:border-gray-300 transition-colors"
          >
            ← Back
          </button>
        )}
        {step < TOTAL_STEPS ? (
          <button
            onClick={() => setStep(s => s + 1)}
            disabled={
              (step === 1 && form.gradeLevel === null) ||
              (step === 4 && form.screenBeforeBed === null) ||
              (step === 5 && form.breathingExercise === null)
            }
            className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Continue →
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {submitting ? 'Submitting…' : 'Submit ✓'}
          </button>
        )}
      </div>
    </div>
  )
}
