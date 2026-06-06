import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getLessonById } from '@/lib/data'
import { updateLesson } from '@/app/lib/actions/lessons'

export default async function EditLessonPage({
  params,
}: {
  params: Promise<{ id: string; lessonId: string }>
}) {
  const { id, lessonId } = await params
  const lesson = await getLessonById(lessonId)
  if (!lesson) notFound()

  const action = updateLesson.bind(null, id, lessonId)

  return (
    <div className="px-8 py-8 max-w-2xl">
      <div className="mb-6 flex items-center gap-3">
        <Link href={`/admin/courses/${id}/lessons`} className="text-sm text-[#6a6f73] hover:text-[#a435f0]">← レッスン管理</Link>
        <span className="text-[#d1d7dc]">/</span>
        <h1 className="text-xl font-extrabold text-[#1c1d1f]">レッスン編集</h1>
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
              defaultValue={lesson.title}
              className="w-full rounded border border-[#d1d7dc] px-3 py-2 text-sm text-[#1c1d1f] focus:border-[#a435f0] focus:outline-none focus:ring-1 focus:ring-[#a435f0]"
            />
          </div>
          <div>
            <label className="block mb-1.5 text-sm font-bold text-[#1c1d1f]">
              YouTube URL <span className="text-red-500">*</span>
            </label>
            <input
              name="youtube_url"
              required
              type="url"
              defaultValue={lesson.youtube_url}
              className="w-full rounded border border-[#d1d7dc] px-3 py-2 text-sm text-[#1c1d1f] focus:border-[#a435f0] focus:outline-none focus:ring-1 focus:ring-[#a435f0]"
            />
          </div>
          <div>
            <label className="block mb-1.5 text-sm font-bold text-[#1c1d1f]">公開設定</label>
            <select
              name="is_free"
              defaultValue={lesson.is_free ? 'true' : 'false'}
              className="w-full rounded border border-[#d1d7dc] px-3 py-2 text-sm text-[#1c1d1f] focus:border-[#a435f0] focus:outline-none focus:ring-1 focus:ring-[#a435f0]"
            >
              <option value="false">有料（ログイン必須）</option>
              <option value="true">無料（誰でも視聴可）</option>
            </select>
          </div>
          <div>
            <label className="block mb-1.5 text-sm font-bold text-[#1c1d1f]">並び順</label>
            <input
              name="order"
              type="number"
              min={0}
              defaultValue={lesson.order}
              className="w-32 rounded border border-[#d1d7dc] px-3 py-2 text-sm text-[#1c1d1f] focus:border-[#a435f0] focus:outline-none focus:ring-1 focus:ring-[#a435f0]"
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
              href={`/admin/courses/${id}/lessons`}
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
