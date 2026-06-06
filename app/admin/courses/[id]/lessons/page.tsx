import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCourseById, getLessonsByCourseId } from '@/lib/data'
import { deleteLesson, moveLessonUp, moveLessonDown } from '@/app/lib/actions/lessons'

export default async function AdminLessonsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [course, lessons] = await Promise.all([getCourseById(id), getLessonsByCourseId(id)])
  if (!course) notFound()

  return (
    <div className="px-8 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/courses" className="text-sm text-[#6a6f73] hover:text-[#a435f0]">← コース管理</Link>
          <span className="text-[#d1d7dc]">/</span>
          <h1 className="text-xl font-extrabold text-[#1c1d1f]">
            {course.title} のレッスン
          </h1>
        </div>
        <Link
          href={`/admin/courses/${id}/lessons/new`}
          className="rounded bg-[#a435f0] px-4 py-2 text-sm font-bold text-white hover:bg-[#8710d8] transition-colors"
        >
          + レッスン追加
        </Link>
      </div>

      {lessons.length > 0 ? (
        <div className="rounded-lg border border-[#d1d7dc] bg-white overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead className="border-b border-[#d1d7dc] bg-[#f7f9fa]">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-[#6a6f73]">順序</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-[#6a6f73]">タイトル</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-[#6a6f73]">無料</th>
                <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider text-[#6a6f73]">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#d1d7dc]">
              {lessons.map((lesson, i) => (
                <tr key={lesson.id} className="hover:bg-[#f7f9fa] transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <span className="w-6 text-center text-[#6a6f73] font-medium">{i + 1}</span>
                      <div className="flex flex-col gap-0.5">
                        <form action={moveLessonUp.bind(null, id, lesson.id)}>
                          <button type="submit" disabled={i === 0} className="block text-xs text-[#6a6f73] hover:text-[#a435f0] disabled:opacity-30 disabled:cursor-not-allowed leading-none">▲</button>
                        </form>
                        <form action={moveLessonDown.bind(null, id, lesson.id)}>
                          <button type="submit" disabled={i === lessons.length - 1} className="block text-xs text-[#6a6f73] hover:text-[#a435f0] disabled:opacity-30 disabled:cursor-not-allowed leading-none">▼</button>
                        </form>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium text-[#1c1d1f]">{lesson.title}</td>
                  <td className="px-4 py-3">
                    {lesson.is_free ? (
                      <span className="inline-flex items-center rounded-full bg-[#eafaf1] px-2 py-0.5 text-xs font-medium text-[#1d8348]">無料</span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-[#fef9e7] px-2 py-0.5 text-xs font-medium text-[#b7950b]">有料</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/courses/${id}/lessons/${lesson.id}/edit`}
                        className="rounded border border-[#d1d7dc] px-3 py-1.5 text-xs font-medium text-[#1c1d1f] hover:bg-[#f7f9fa] transition-colors"
                      >
                        編集
                      </Link>
                      <form action={deleteLesson.bind(null, id, lesson.id)}>
                        <button
                          type="submit"
                          className="rounded border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
                          onClick={(e) => { if (!confirm('このレッスンを削除しますか？')) e.preventDefault() }}
                        >
                          削除
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="rounded-lg border border-[#d1d7dc] bg-white py-16 text-center">
          <p className="text-[#6a6f73]">レッスンがありません。追加してください。</p>
        </div>
      )}
    </div>
  )
}
