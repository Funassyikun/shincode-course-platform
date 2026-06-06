import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { deleteCourse } from '@/app/lib/actions/courses'

export default async function AdminCoursesPage() {
  const supabase = await createClient()
  const { data: courses } = await supabase
    .from('courses')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="px-8 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-[#1c1d1f]">コース管理</h1>
        <Link
          href="/admin/courses/new"
          className="rounded bg-[#a435f0] px-4 py-2 text-sm font-bold text-white hover:bg-[#8710d8] transition-colors"
        >
          + 新規コース作成
        </Link>
      </div>

      {courses && courses.length > 0 ? (
        <div className="rounded-lg border border-[#d1d7dc] bg-white overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead className="border-b border-[#d1d7dc] bg-[#f7f9fa]">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-[#6a6f73]">コース</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-[#6a6f73]">作成日</th>
                <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider text-[#6a6f73]">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#d1d7dc]">
              {courses.map((course) => (
                <tr key={course.id} className="hover:bg-[#f7f9fa] transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-16 shrink-0 overflow-hidden rounded bg-[#ede9fe]">
                        {course.thumbnail_url ? (
                          <Image src={course.thumbnail_url} alt={course.title} fill className="object-cover" />
                        ) : (
                          <div className="flex h-full items-center justify-center text-base">🎬</div>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-[#1c1d1f]">{course.title}</p>
                        {course.description && (
                          <p className="text-xs text-[#6a6f73] line-clamp-1">{course.description}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[#6a6f73] whitespace-nowrap">
                    {new Date(course.created_at).toLocaleDateString('ja-JP')}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/courses/${course.id}/lessons`}
                        className="rounded border border-[#d1d7dc] px-3 py-1.5 text-xs font-medium text-[#1c1d1f] hover:bg-[#f7f9fa] transition-colors"
                      >
                        レッスン
                      </Link>
                      <Link
                        href={`/admin/courses/${course.id}/edit`}
                        className="rounded border border-[#d1d7dc] px-3 py-1.5 text-xs font-medium text-[#1c1d1f] hover:bg-[#f7f9fa] transition-colors"
                      >
                        編集
                      </Link>
                      <form action={deleteCourse.bind(null, course.id)}>
                        <button
                          type="submit"
                          className="rounded border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
                          onClick={(e) => { if (!confirm('このコースを削除しますか？')) e.preventDefault() }}
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
          <p className="text-[#6a6f73]">コースがありません。新規作成してください。</p>
        </div>
      )}
    </div>
  )
}
