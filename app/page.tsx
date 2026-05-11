import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-16">
      <div className="max-w-xl w-full space-y-6 text-center">

        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-3">
            Student Wellness Study
          </h1>
          <p className="text-gray-500 text-lg">
            An independent research project collecting anonymous data on sleep, stress,
            screen time, and wellness habits among high school students.
          </p>
        </div>

        {/* Raffle prize card */}
        <a
          href="https://electronics.sony.com/audio/headphones/headband/p/wh1000xm5-b"
          target="_blank"
          rel="noopener noreferrer"
          className="block bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg hover:opacity-95 transition-opacity"
        >
          <div className="flex items-center gap-5">
            <div className="bg-white rounded-xl p-2 flex-shrink-0">
              <Image
                src="/headphones.jpg"
                alt="Sony WH-1000XM5 Headphones"
                width={80}
                height={80}
                className="rounded-lg object-contain"
              />
            </div>
            <div className="text-left">
              <p className="text-xs font-medium text-indigo-200 uppercase tracking-wide mb-0.5">Raffle Prize</p>
              <p className="font-bold text-lg leading-tight">Sony WH-1000XM5</p>
              <p className="text-indigo-100 text-sm">Industry-leading noise canceling · $349.99</p>
              <p className="text-indigo-200 text-xs mt-1">Complete the survey to enter ↗</p>
            </div>
          </div>
        </a>

        <div className="grid grid-cols-2 gap-4">
          <Link
            href="/survey"
            className="flex flex-col items-center gap-2 bg-indigo-600 text-white rounded-2xl p-6 font-semibold hover:bg-indigo-700 transition-colors shadow"
          >
            <span className="text-2xl">📝</span>
            Take the Survey
          </Link>
          <Link
            href="/dashboard"
            className="flex flex-col items-center gap-2 bg-white text-gray-800 rounded-2xl p-6 font-semibold border border-gray-200 hover:border-indigo-300 transition-colors shadow-sm"
          >
            <span className="text-2xl">📊</span>
            View Findings
          </Link>
        </div>

        <p className="text-xs text-gray-400">
          No identifying information is collected in the survey. Raffle entries are stored
          separately and are not linked to your responses.
        </p>
      </div>
    </main>
  )
}
