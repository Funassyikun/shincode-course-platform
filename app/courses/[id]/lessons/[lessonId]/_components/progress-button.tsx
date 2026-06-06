'use client'

import { useActionState } from 'react'
import { toggleLessonProgress } from '@/app/lib/actions/progress'

type Props = {
  courseId: string
  lessonId: string
  isCompleted: boolean
}

export function ProgressButton({ courseId, lessonId, isCompleted }: Props) {
  const action = toggleLessonProgress.bind(null, courseId, lessonId, isCompleted)
  const [, formAction, pending] = useActionState(action, null)

  return (
    <form action={formAction}>
      <button
        type="submit"
        disabled={pending}
        className={`flex items-center gap-2 rounded px-5 py-2.5 text-sm font-bold transition-colors disabled:opacity-50 ${
          isCompleted
            ? 'border border-[#a435f0] text-[#a435f0] hover:bg-[#f5eeff]'
            : 'bg-[#a435f0] text-white hover:bg-[#8710d8]'
        }`}
      >
        {pending ? (
          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : isCompleted ? (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        ) : null}
        {pending ? '更新中...' : isCompleted ? '視聴済み' : '視聴済みにする'}
      </button>
    </form>
  )
}
