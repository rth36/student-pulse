import SurveyForm from '@/components/SurveyForm'

export const metadata = { title: 'Take the Survey — Student Wellness Study' }

export default function SurveyPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <SurveyForm />
    </main>
  )
}
