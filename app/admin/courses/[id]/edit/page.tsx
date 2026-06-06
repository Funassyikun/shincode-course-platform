import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCourseById } from '@/lib/data'
import { updateCourse } from '@/app/lib/actions/courses'

export default async function EditCoursePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const course = await getCourseById(id)
  if (!course) notFound()

  const action = updateCourse.bind(null, id)

  return (
    <div className="px-8 py-8 max-w-2xl">
      <div className="mb-6 flex items-center gap-3">
        <Link href="/admin/courses" className="text-sm text-[#6a6f73] hover:text-[#a435f0]">← コース管理</Link>
        <span className="text-[#d1d7dc]">/</span>
        <h1 className="text-xl font-extrabold text-[#1c1d1f]">コース編集</h1>
      </div>

      <div className="rounded-lg border border-[#d1d7dc] bg-white p-6 shadow-sm">
        <form action={action} className="flex flex-col gap-5">
          <div>
            <label className="block mb-1.5 text-sm font-bold text-[#1c1d1f]">
              タイトル <span className="text-red-500">*</span>
            </label>
            <input
              name="title"
              required
              defaultValue={course.title}
              className="w-full rounded border border-[#d1d7dc] px-3 py-2 text-sm text-[#1c1d1f] focus:border-[#a435f0] focus:outline-none focus:ring-1 focus:ring-[#a435f0]"
            />
          </div>
          <div>
            <label className="block mb-1.5 text-sm font-bold text-[#1c1d1f]">説明</label>
            <textarea
              name="description"
              rows={4}
              defaultValue={course.description ?? ''}
              className="w-full rounded border border-[#d1d7dc] px-3 py-2 text-sm text-[#1c1d1f] focus:border-[#a435f0] focus:outline-none focus:ring-1 focus:ring-[#a435f0] resize-none"
            />
          </div>
          <div>
            <label className="block mb-1.5 text-sm font-bold text-[#1c1d1f]">サムネイル URL</label>
            <input
              name="thumbnail_url"
              type="url"
              defaultValue={course.thumbnail_url ?? ''}
              className="w-full rounded border border-[#d1d7dc] px-3 py-2 text-sm text-[#1c1d1f] focus:border-[#a435f0] focus:outline-none focus:ring-1 focus:ring-[#a435f0]"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="rounded bg-[#a435f0] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#8710d8] transition-colors"
            >
              保存する
            </button>
            <Link
              href="/admin/courses"
              className="rounded border border-[#d1d7dc] px-5 py-2.5 text-sm font-bold text-[#1c1d1f] hover:bg-[#f7f9fa] transition-colors"
            >
              キャンセル
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
