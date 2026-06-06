import { notFound } from 'next/navigation'
import Image from 'next/image'
import { getCourseById, getLessonsByCourseId, getCompletedLessonIds } from '@/lib/data'
import { createClient } from '@/lib/supabase/server'
import { LessonList } from './_components/lesson-list'

export default async function CoursePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [course, lessons] = await Promise.all([
    getCourseById(id),
    getLessonsByCourseId(id),
  ])
  if (!course) notFound()

  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()
  const claims = data?.claims ?? null

  let completedIds: string[] = []
  if (claims) {
    completedIds = await getCompletedLessonIds(
      claims.sub,
      lessons.map((l) => l.id)
    )
  }

  const progressRate = lessons.length > 0
    ? Math.round((completedIds.length / lessons.length) * 100)
    : 0

  return (
    <>
      {/* Hero */}
      <div className="bg-[#1c1d1f] text-white">
        <div className="mx-auto max-w-7xl px-4 py-10">
          <p className="mb-3 text-sm text-[#cec0fc]">コース詳細</p>
          <h1 className="mb-3 text-3xl font-extrabold tracking-tight">{course.title}</h1>
          {course.description && (
            <p className="max-w-2xl text-base text-white/70">{course.description}</p>
          )}
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-10">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Left: Lesson list */}
          <div className="flex-1 min-w-0">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-[#1c1d1f]">
                レッスン一覧
                <span className="ml-2 text-sm font-normal text-[#6a6f73]">{lessons.length}本</span>
              </h2>
              {claims && lessons.length > 0 && (
                <span className="text-sm font-medium text-[#a435f0]">
                  {completedIds.length} / {lessons.length} 完了
                </span>
              )}
            </div>

            {/* Progress bar */}
            {claims && lessons.length > 0 && (
              <div className="mb-4">
                <div className="h-2 w-full rounded-full bg-[#d1d7dc] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#a435f0] transition-all"
                    style={{ width: `${progressRate}%` }}
                  />
                </div>
                <p className="mt-1 text-xs text-[#6a6f73]">{progressRate}% 完了</p>
              </div>
            )}

            {lessons.length === 0 ? (
              <p className="text-sm text-[#6a6f73]">レッスンはまだありません。</p>
            ) : (
              <LessonList
                courseId={id}
                lessons={lessons}
                completedIds={completedIds}
                isLoggedIn={!!claims}
              />
            )}
          </div>

          {/* Right: Course card */}
          <div className="w-full lg:w-80 shrink-0">
            <div className="rounded-lg border border-[#d1d7dc] overflow-hidden shadow-sm sticky top-20">
              {course.thumbnail_url ? (
                <div className="relative aspect-video w-full">
                  <Image
                    src={course.thumbnail_url}
                    alt={course.title}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="flex aspect-video items-center justify-center bg-[#ede9fe]">
                  <span className="text-4xl">🎬</span>
                </div>
              )}
              <div className="p-4">
                <p className="text-xl font-extrabold text-[#1c1d1f]">無料</p>
                <p className="mt-2 text-sm text-[#6a6f73]">
                  全{lessons.length}本のレッスン
                </p>
                {!claims && (
                  <a
                    href="/login"
                    className="mt-4 block w-full rounded bg-[#a435f0] py-3 text-center text-sm font-bold text-white hover:bg-[#8710d8] transition-colors"
                  >
                    無料で始める
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
