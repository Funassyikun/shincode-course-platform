import { redirect } from 'next/navigation'
import Link from 'next/link'
import { requireAdmin } from '@/lib/auth'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const result = await requireAdmin()
  if (!result.authorized) {
    result.reason === 'unauthenticated' ? redirect('/login') : redirect('/')
  }

  return (
    <div className="flex min-h-[calc(100vh-57px)]">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 border-r border-[#d1d7dc] bg-white">
        <div className="px-4 py-5 border-b border-[#d1d7dc]">
          <p className="text-xs font-bold uppercase tracking-widest text-[#6a6f73]">管理者パネル</p>
        </div>
        <nav className="px-2 py-3 flex flex-col gap-1">
          <Link href="/admin" className="flex items-center gap-2 rounded px-3 py-2 text-sm font-medium text-[#1c1d1f] hover:bg-[#f7f9fa] transition-colors">
            <span>🏠</span> ダッシュボード
          </Link>
          <Link href="/admin/courses" className="flex items-center gap-2 rounded px-3 py-2 text-sm font-medium text-[#1c1d1f] hover:bg-[#f7f9fa] transition-colors">
            <span>📚</span> コース管理
          </Link>
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0 bg-[#f7f9fa]">
        {children}
      </div>
    </div>
  )
}
