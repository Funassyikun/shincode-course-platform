# 03 認証基盤（Supabase Auth）

## 概要

Google OAuth による認証フローを構築する。  
Supabase Auth の SSR 対応クライアント、セッション管理 proxy、OAuth コールバックを実装する。

---

## ToDo

### Supabase ダッシュボード設定

- [x] Authentication → Providers → Google を有効化
- [x] Google Cloud Console で OAuth クライアント ID / シークレットを取得
- [x] Supabase の Redirect URL を Google Cloud Console の許可リストに追加
- [x] `NEXT_PUBLIC_SITE_URL` を Supabase の Site URL に設定

### Supabase クライアント実装（01 で未済の場合）

- [x] `lib/supabase/client.ts` 作成
- [x] `lib/supabase/server.ts` 作成（`import 'server-only'` を先頭に）

### proxy.ts（セッション管理）

- [x] `proxy.ts` をプロジェクトルートに作成
- [x] `getClaims()` でトークンをリフレッシュ
- [x] matcher に静的ファイルを除外するパターンを設定

### OAuth コールバック

- [x] `app/auth/callback/route.ts` を作成
- [x] `code` を受け取り `exchangeCodeForSession` でセッションに交換
- [x] `next` クエリパラメータを使ってリダイレクト先を制御

---

## 実装メモ

### `lib/supabase/server.ts`

```ts
import 'server-only'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export const createClient = async () => {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch { /* Server Component からの呼び出しは無視 */ }
        },
      },
    }
  )
}
```

### `proxy.ts`

```ts
import { createServerClient, parseCookieHeader } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request: { headers: request.headers } })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return parseCookieHeader(request.headers.get('cookie') ?? '')
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  await supabase.auth.getClaims() // トークンリフレッシュ

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
```

### `app/auth/callback/route.ts`

```ts
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    await supabase.auth.exchangeCodeForSession(code)
  }

  return NextResponse.redirect(new URL(next, request.url))
}
```

### 認証チェックのルール

```ts
// ❌ 使わない（JWT 未検証、Cookie 偽造リスク）
const { data: { session } } = await supabase.auth.getSession()

// ✅ 使う（JWT 署名を公開鍵で毎回検証）
const { data: { claims }, error } = await supabase.auth.getClaims()
if (error || !claims) redirect('/login')
```
