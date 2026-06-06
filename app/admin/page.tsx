import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function AdminPage() {
  const supabase = await createClient()
  const { count: courseCount } = await supabase.from('courses').select('*', { count: 'exact', head: true })
  const { count: lessonCount } = await supabase.from('lessons').select('*', { count: 'exact', head: true })

  return (
    <div className="px-8 py-8">
      <h1 className="mb-6 text-2xl font-extrabold text-[#1c1d1f]">ダッシュボード</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 max-w-xl">
        <div className="rounded-lg border border-[#d1d7dc] bg-white p-5 shadow-sm">
          <p className="text-sm text-[#6a6f73]">コース数</p>
          <p className="mt-1 text-3xl font-extrabold text-[#1c1d1f]">{courseCount ?? 0}</p>
          <Link href="/admin/courses" className="mt-3 inline-block text-xs font-medium text-[#a435f0] hover:underline">
            コース管理 →
          </Link>
        </div>
        <div className="rounded-lg border border-[#d1d7dc] bg-white p-5 shadow-sm">
          <p className="text-sm text-[#6a6f73]">レッスン数</p>
          <p className="mt-1 text-3xl font-extrabold text-[#1c1d1f]">{lessonCount ?? 0}</p>
        </div>
      </div>
    </div>
  )
}
