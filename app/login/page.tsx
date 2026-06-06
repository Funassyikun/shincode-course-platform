import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { signInWithGoogle } from '@/app/lib/actions/auth'
import { LoginButton } from './_components/login-button'
export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams

  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()
  if (data?.claims) redirect('/')

  return (
    <main className="flex min-h-[calc(100vh-57px)] items-center justify-center bg-[#f7f9fa] px-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="rounded-lg border border-[#d1d7dc] bg-white px-8 py-10 shadow-sm">
          <h1 className="mb-1 text-center text-2xl font-extrabold text-[#1c1d1f]">
            ログイン
          </h1>
          <p className="mb-8 text-center text-sm text-[#6a6f73]">
            ShinCode アカウントにログイン
          </p>

          <form action={signInWithGoogle.bind(null, next)}>
            <LoginButton />
          </form>

          <div className="mt-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-[#d1d7dc]" />
            <span className="text-xs text-[#6a6f73]">または</span>
            <div className="h-px flex-1 bg-[#d1d7dc]" />
          </div>

          <p className="mt-6 text-center text-xs text-[#6a6f73]">
            ログインすることで、
            <span className="text-[#a435f0]">利用規約</span>および
            <span className="text-[#a435f0]">プライバシーポリシー</span>
            に同意したものとみなします。
          </p>
        </div>

        <p className="mt-4 text-center text-sm text-[#6a6f73]">
          初めての方も同じボタンから無料で登録できます。
        </p>
      </div>
    </main>
  )
}
