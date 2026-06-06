import { getCourses } from '@/lib/data'
import CourseCard from '@/app/ui/course-card'

export default async function Home() {
  const courses = await getCourses()

  return (
    <>
      {/* Hero Banner */}
      <div className="bg-[#1c1d1f] text-white">
        <div className="mx-auto max-w-7xl px-4 py-14">
          <p className="mb-2 text-sm font-medium text-[#cec0fc]">注目のコース</p>
          <h1 className="mb-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
            あなたのスキルを<br className="sm:hidden" />次のレベルへ
          </h1>
          <p className="max-w-xl text-base text-white/70">
            AIを活用したプログラム開発を、実践的な動画コースで学ぼう。
            エンジニアも非エンジニアも、今すぐ始められます。
          </p>
        </div>
      </div>

      {/* Course List */}
      <main className="mx-auto max-w-7xl px-4 py-10">
        <h2 className="mb-6 text-xl font-extrabold text-[#1c1d1f]">
          すべてのコース
          <span className="ml-2 text-sm font-normal text-[#6a6f73]">
            {courses.length}件
          </span>
        </h2>

        {courses.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-[#d1d7dc] bg-[#f7f9fa] py-24 text-center">
            <span className="text-4xl">📚</span>
            <p className="text-sm text-[#6a6f73]">現在公開中のコースはありません。</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </main>
    </>
  )
}
