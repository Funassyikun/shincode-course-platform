import Link from 'next/link'

type Lesson = {
  id: string
  title: string
  order: number
  is_free: boolean
}

type Props = {
  courseId: string
  lessons: Lesson[]
  completedIds: string[]
  isLoggedIn: boolean
}

export function LessonList({ courseId, lessons, completedIds, isLoggedIn }: Props) {
  return (
    <ol className="divide-y divide-[#d1d7dc] border border-[#d1d7dc] rounded-lg overflow-hidden">
      {lessons.map((lesson, i) => {
        const isCompleted = completedIds.includes(lesson.id)
        const isLocked = !lesson.is_free && !isLoggedIn

        return (
          <li key={lesson.id}>
            <Link
              href={isLocked ? `/login?next=/courses/${courseId}/lessons/${lesson.id}` : `/courses/${courseId}/lessons/${lesson.id}`}
              className="flex items-center gap-3 px-4 py-3 bg-white hover:bg-[#f7f9fa] transition-colors group"
            >
              {/* 完了チェック or 番号 */}
              <div className="shrink-0 w-6 h-6 flex items-center justify-center">
                {isCompleted ? (
                  <div className="w-5 h-5 rounded-full bg-[#a435f0] flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                ) : (
                  <span className="text-xs text-[#6a6f73] font-medium">{i + 1}</span>
                )}
              </div>

              {/* タイトル */}
              <span className={`flex-1 text-sm ${isCompleted ? 'text-[#6a6f73] line-through' : 'text-[#1c1d1f] group-hover:text-[#a435f0]'} transition-colors`}>
                {lesson.title}
              </span>

              {/* バッジ */}
              <div className="shrink-0 flex items-center gap-2">
                {lesson.is_free && (
                  <span className="text-xs font-medium text-[#1d8348] bg-[#eafaf1] px-2 py-0.5 rounded">
                    無料
                  </span>
                )}
                {isLocked && (
                  <svg className="w-4 h-4 text-[#6a6f73]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                )}
              </div>
            </Link>
          </li>
        )
      })}
    </ol>
  )
}
