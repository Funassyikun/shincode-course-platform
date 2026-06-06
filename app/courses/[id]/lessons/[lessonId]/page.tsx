import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { getLessonById, getLessonsByCourseId, getCompletedLessonIds } from '@/lib/data'
import { createClient } from '@/lib/supabase/server'
import { extractYouTubeId } from '@/lib/youtube'
import { YouTubeEmbed } from '@/app/ui/youtube-embed'
import { ProgressButton } from './_components/progress-button'

export default async function LessonPage({
  params,
}: {
  params: Promise<{ id: string; lessonId: string }>
}) {
  const { id, lessonId } = await params
  const [lesson, lessons] = await Promise.all([
    getLessonById(lessonId),
    getLessonsByCourseId(id),
  ])
  if (!lesson) notFound()

  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()
  const claims = data?.claims ?? null

  if (!lesson.is_free && !claims) {
    redirect(`/login?next=/courses/${id}/lessons/${lessonId}`)
  }

  let completedIds: string[] = []
  if (claims) {
    completedIds = await getCompletedLessonIds(
      claims.sub,
      lessons.map((l) => l.id)
    )
  }

  const isCompleted = completedIds.includes(lessonId)
  const videoId = extractYouTubeId(lesson.youtube_url)
  const currentIndex = lessons.findIndex((l) => l.id === lessonId)
  const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null
  const nextLesson = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null

  return (
    <div className="flex min-h-[calc(100vh-57px)] flex-col lg:flex-row">
      {/* Main content */}
      <main className="flex-1 min-w-0 bg-white">
        {/* Video */}
        <div className="bg-black">
          {videoId ? (
            <div className="mx-auto max-w-5xl">
              <YouTubeEmbed videoId={videoId} />
            </div>
          ) : (
            <div className="flex aspect-video max-w-5xl mx-auto items-center justify-center text-white/40">
              動画を読み込めませんでした
            </div>
          )}
        </div>

        {/* Info */}
        <div className="mx-auto max-w-5xl px-4 py-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs text-[#6a6f73] mb-1">
                第{currentIndex + 1}話
              </p>
              <h1 className="text-xl font-extrabold text-[#1c1d1f]">{lesson.title}</h1>
            </div>
            {claims && (
              <ProgressButton courseId={id} lessonId={lessonId} isCompleted={isCompleted} />
            )}
          </div>

          {/* Nav */}
          <div className="mt-8 flex items-center justify-between border-t border-[#d1d7dc] pt-4">
            {prevLesson ? (
              <Link
                href={`/courses/${id}/lessons/${prevLesson.id}`}
                className="flex items-center gap-2 text-sm font-medium text-[#a435f0] hover:underline"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                前のレッスン
              </Link>
            ) : <div />}
            <Link href={`/courses/${id}`} className="text-sm text-[#6a6f73] hover:text-[#a435f0]">
              コースに戻る
            </Link>
            {nextLesson ? (
              <Link
                href={`/courses/${id}/lessons/${nextLesson.id}`}
                className="flex items-center gap-2 text-sm font-medium text-[#a435f0] hover:underline"
              >
                次のレッスン
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ) : <div />}
          </div>
        </div>
      </main>

      {/* Sidebar: lesson index */}
      <aside className="hidden lg:flex w-72 shrink-0 flex-col border-l border-[#d1d7dc] bg-white">
        <div className="border-b border-[#d1d7dc] px-4 py-3">
          <h2 className="text-sm font-extrabold text-[#1c1d1f]">コースの内容</h2>
          {claims && (
            <p className="mt-0.5 text-xs text-[#6a6f73]">
              {completedIds.length} / {lessons.length} 完了
            </p>
          )}
        </div>
        <ol className="flex-1 overflow-y-auto divide-y divide-[#d1d7dc]">
          {lessons.map((l, i) => {
            const done = completedIds.includes(l.id)
            const isCurrent = l.id === lessonId
            const locked = !l.is_free && !claims
            return (
              <li key={l.id}>
                <Link
                  href={locked ? `/login?next=/courses/${id}/lessons/${l.id}` : `/courses/${id}/lessons/${l.id}`}
                  className={`flex items-center gap-3 px-4 py-3 text-xs transition-colors ${isCurrent ? 'bg-[#f5eeff] border-l-2 border-[#a435f0]' : 'hover:bg-[#f7f9fa]'}`}
                >
                  <span className={`shrink-0 ${done ? 'text-[#a435f0]' : 'text-[#6a6f73]'}`}>
                    {done ? '✓' : i + 1}
                  </span>
                  <span className={`flex-1 leading-snug ${isCurrent ? 'font-bold text-[#1c1d1f]' : 'text-[#1c1d1f]'} ${done ? 'line-through text-[#6a6f73]' : ''}`}>
                    {l.title}
                  </span>
                  {locked && (
                    <svg className="shrink-0 h-3 w-3 text-[#6a6f73]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  )}
                </Link>
              </li>
            )
          })}
        </ol>
      </aside>
    </div>
  )
}
