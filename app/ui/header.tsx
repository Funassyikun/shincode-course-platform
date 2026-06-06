import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { signOut } from '@/app/lib/actions/auth'

export default async function Header() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()
  const isLoggedIn = !!data?.claims

  return (
    <header className="sticky top-0 z-50 border-b border-[#d1d7dc] bg-white">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
        {/* Logo */}
        <Link href="/" className="shrink-0 text-xl font-extrabold tracking-tight text-[#a435f0]">
          Fudemy
        </Link>

        {/* Divider */}
        <div className="hidden h-5 w-px bg-[#d1d7dc] sm:block" />

        {/* Nav */}
        <nav className="hidden items-center gap-5 text-sm font-medium text-[#1c1d1f] sm:flex">
          <Link href="/" className="hover:text-[#a435f0] transition-colors">
            コース
          </Link>
        </nav>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Auth */}
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <form action={signOut}>
              <button
                type="submit"
                className="rounded border border-[#1c1d1f] px-4 py-2 text-sm font-bold text-[#1c1d1f] hover:bg-[#f7f9fa] transition-colors"
              >
                ログアウト
              </button>
            </form>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded border border-[#1c1d1f] px-4 py-2 text-sm font-bold text-[#1c1d1f] hover:bg-[#f7f9fa] transition-colors"
              >
                ログイン
              </Link>
              <Link
                href="/login"
                className="rounded bg-[#a435f0] px-4 py-2 text-sm font-bold text-white hover:bg-[#8710d8] transition-colors"
              >
                無料で始める
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
