# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## 作業ルール

- `docs/` 配下の各ファイルには ToDo チェックリストがある。タスクが完了したら必ず `- [ ]` を `- [x]` に更新すること。

---

## 進捗状況

| docs | タイトル | 状態 |
|---|---|---|
| 01 | 環境構築・初期設定 | ✅ 完了 |
| 02 | DB セットアップ・RLS | ✅ 完了 |
| 03 | 認証基盤（Supabase Auth） | ✅ 完了 |
| 04 | ログインページ | ✅ 完了 |
| 05 | コース一覧ページ | ✅ 完了 |
| 06 | コース詳細ページ | ✅ 完了 |
| 07 | レッスン視聴ページ | ✅ 完了 |
| 08 | 視聴進捗トラッキング | ✅ 完了 |
| 09 | 管理者ガード | ✅ 完了 |
| 10 | 管理者 コース管理 | ✅ 完了 |
| 11 | 管理者 レッスン管理 | ✅ 完了 |

---

## プロジェクト概要

YouTube動画を活用したUdemy風オンライン講座プラットフォーム。  
ターゲットはAIを使ってプログラム開発をしたいエンジニア・非エンジニア両方。  
UIはシンプルで直感的に操作できることを重視する。

---

## 技術スタック

| レイヤー | 技術 |
|---|---|
| フロントエンド | Next.js 16.2.6（App Router、Turbopack デフォルト） |
| スタイリング | Tailwind CSS v4（CSS-first、`tailwind.config.js` なし） |
| 言語 | TypeScript 5（strict モード、`@/*` はリポジトリルートへのエイリアス） |
| ランタイム | React 19.2.4 |
| 認証 | Supabase Auth（Google OAuth のみ） |
| データベース | Supabase（PostgreSQL） |
| 動画配信 | YouTube 埋め込み（iframe） |
| ホスティング | Vercel |

---

## コマンド

```bash
npm run dev       # 開発サーバー起動（Turbopack、.next/dev/ へ出力）
npm run build     # 本番ビルド（Turbopack デフォルト）
npm run start     # 本番サーバー起動
npm run lint      # ESLint 実行（eslint CLI を直接使用）
npx next typegen  # PageProps / LayoutProps / RouteContext 型ヘルパー生成
```

> `next lint` コマンドは v16 で削除済み。`npm run lint`（eslint CLI）を使う。`next build` はリントを実行しなくなった。

---

## 機能要件

### ユーザー向け機能

| 機能 | 詳細 |
|---|---|
| コース一覧ページ | 公開中のコースをカード形式で一覧表示 |
| コース詳細ページ | コースの説明・レッスン一覧・進捗率を表示 |
| レッスン視聴ページ | YouTube 動画を埋め込みで再生 |
| 視聴進捗トラッキング | レッスンごとに「視聴済み」を記録し、コースの進捗率（例：3/10本完了）を表示 |

### アクセス制御

| レッスン | 未ログインユーザー | ログイン済みユーザー |
|---|---|---|
| 第1話（`is_free = true`） | 視聴可 | 視聴可 |
| 第2話以降（`is_free = false`） | `/login` へリダイレクト | 視聴可 |

### 認証

- Supabase Auth を使用
- Google ソーシャルログインのみ対応
- 新規登録・ログインは同一フロー（Google アカウントで自動登録）

### 管理者向け機能

- アクセス制御：ログイン中ユーザーのメールアドレスが環境変数 `ADMIN_EMAIL` と一致する場合のみ `/admin` にアクセス可
- コース管理：コースの追加・編集・削除
- レッスン管理：レッスン（動画）の追加・編集・削除・並び順変更

---

## 画面一覧

| 画面名 | URL | 認証要否 |
|---|---|---|
| コース一覧 | `/` | 不要 |
| コース詳細 | `/courses/[id]` | 不要 |
| レッスン視聴 | `/courses/[id]/lessons/[lessonId]` | 第2話以降は必要 |
| ログイン | `/login` | 不要 |
| 管理者トップ | `/admin` | 管理者のみ |
| コース管理 | `/admin/courses` | 管理者のみ |
| レッスン管理 | `/admin/courses/[id]/lessons` | 管理者のみ |

---

## データベース設計

### `courses` テーブル

```sql
create table courses (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  description   text,
  thumbnail_url text,
  created_at    timestamp with time zone default now()
);
```

### `lessons` テーブル

```sql
create table lessons (
  id          uuid primary key default gen_random_uuid(),
  course_id   uuid references courses(id) on delete cascade,
  title       text not null,
  youtube_url text not null,
  order       integer not null default 0,
  is_free     boolean not null default false,
  created_at  timestamp with time zone default now()
);
```

### `lesson_progress` テーブル

```sql
create table lesson_progress (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid references auth.users(id) on delete cascade,
  lesson_id    uuid references lessons(id) on delete cascade,
  completed_at timestamp with time zone default now(),
  unique(user_id, lesson_id)
);
```

`auth.users` は Supabase Auth が自動管理するため自前テーブル不要。

### RLS 方針

| テーブル | 読み取り | 書き込み |
|---|---|---|
| `courses` | 全員 | 管理者のみ（サーバーサイドで制御） |
| `lessons` | 全員 | 管理者のみ（サーバーサイドで制御） |
| `lesson_progress` | 本人のみ | 本人のみ |

---

## 環境変数

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ADMIN_EMAIL=your-admin@example.com
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## MVP スコープ

### ✅ 含む
- コース・レッスンの閲覧
- Google ログイン（Supabase Auth）
- 視聴進捗トラッキング
- 管理者によるコース・レッスンの CRUD

### ❌ 含まない（後フェーズ）
- 課金・決済機能
- メール通知
- コメント・レビュー機能
- 複数管理者ロール
- 分析・ダッシュボード

---

## Supabase Auth（@supabase/ssr）実装ルール

### パッケージ

```bash
npm install @supabase/supabase-js @supabase/ssr
```

### 環境変数

```env
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>         # 旧形式（2026年末まで有効）
# 新形式（推奨）
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

> 新形式の Publishable Key は Supabase ダッシュボード → Settings → API Keys から取得。

### クライアントユーティリティ

**`lib/supabase/client.ts`** — Client Component 用（ブラウザ）

```ts
import { createBrowserClient } from '@supabase/ssr'

export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
```

`createBrowserClient` はシングルトンなので、コンポーネントごとに呼んでよい。

**`lib/supabase/server.ts`** — Server Component / Server Action / Route Handler 用

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
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Server Component からの呼び出しでは set が無効になる場合がある（無視してよい）
          }
        },
      },
    }
  )
}
```

サーバーサイドのクライアントはリクエストごとに新規生成する（軽量なので問題ない）。

### `proxy.ts`（Next.js 16 では `middleware.ts` → `proxy.ts`）

セッションのリフレッシュをリクエストごとに行う。**これがないとサーバー側でセッションが更新されない。**

```ts
// proxy.ts（プロジェクトルート）
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

  // トークンをリフレッシュし、Server Component に渡す
  await supabase.auth.getClaims()

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
```

### ⚠️ 認証チェックは必ず `getClaims()` を使う

```ts
// ❌ 絶対に使わない（JWT を検証しない。Cookie を偽造できる）
const { data: { session } } = await supabase.auth.getSession()

// ✅ 必ずこちらを使う（公開鍵で JWT 署名を毎回検証する）
const { data: { claims }, error } = await supabase.auth.getClaims()
if (error || !claims) redirect('/login')
const userId = claims.sub
```

### 各コンテキストでの使い分け

| コンテキスト | 使うクライアント |
|---|---|
| Server Component | `lib/supabase/server.ts` の `createClient()` を `await` |
| Server Action | 同上 |
| Route Handler | 同上 |
| Client Component | `lib/supabase/client.ts` の `createClient()` |
| `proxy.ts` | 直接 `createServerClient` を呼ぶ（上記参照） |

### Google OAuth の設定

Supabase ダッシュボード → Authentication → Providers → Google を有効化し、  
`NEXT_PUBLIC_SITE_URL` を Redirect URL に設定する。

```ts
// ログインボタンの Server Action
'use server'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function signInWithGoogle() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  })
  if (data.url) redirect(data.url)
}
```

OAuth コールバック用の Route Handler（`app/auth/callback/route.ts`）でコードをセッションに交換する:

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

---

## Next.js App Router ベストプラクティス

### Server Component を優先する

layout・page はデフォルトで Server Component。以下が必要な場合だけ `'use client'` を付ける。

| Client Component が必要な場合 | Server Component を使う場合 |
|---|---|
| `useState` / イベントハンドラ | DB・API からのデータ取得 |
| `useEffect` などライフサイクル | 秘密鍵・トークンを使う処理 |
| `localStorage` / `window` などブラウザ API | JS バンドルを減らしたい箇所 |
| カスタムフック | 初期 HTML を高速に返したい箇所 |

`'use client'` は**ツリーの末端（リーフ）に限定する**。大きなレイアウトに付けると、その配下が全てクライアントバンドルに含まれる。

```tsx
// ❌ Layout 全体を Client Component にしない
'use client'
export default function Layout({ children }) { ... }

// ✅ インタラクティブな部分だけ切り出す
// app/ui/search.tsx
'use client'
export default function Search() { ... }

// app/layout.tsx（Server Component のまま）
import Search from './ui/search'
export default function Layout({ children }) {
  return <><Search />{children}</>
}
```

### Server Component を Client Component の children に渡す

Client Component の内部に Server Component を直接 import するとエラーになる。  
`children` prop 経由で渡すパターンを使う。

```tsx
// ✅ Server Component を children として渡す
// app/ui/modal.tsx（Client Component）
'use client'
export default function Modal({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>
}

// app/page.tsx（Server Component）
import Modal from './ui/modal'
import Cart from './ui/cart'   // Server Component
export default function Page() {
  return <Modal><Cart /></Modal>
}
```

### データ取得は Server Component で行う

```tsx
// ✅ Server Component で直接 DB クエリ
export default async function Page() {
  const courses = await supabase.from('courses').select('*')
  return <CourseList courses={courses.data} />
}
```

**独立したリクエストは並列化する**（`await` を直列に書くとウォーターフォールになる）:

```tsx
// ❌ 直列（遅い）
const course = await getCourse(id)
const lessons = await getLessons(id)

// ✅ 並列
const [course, lessons] = await Promise.all([getCourse(id), getLessons(id)])
```

**同一リクエスト内で同じデータを複数箇所で使う場合** は `React.cache` でメモ化する:

```ts
// app/lib/data.ts
import { cache } from 'react'
export const getUser = cache(async (id: string) => {
  const { data } = await supabase.from('auth.users').select('*').eq('id', id).single()
  return data
})
```

### ストリーミングで UX を改善する

遅いデータ取得がある場合、ページ全体をブロックしない。

```tsx
// app/courses/[id]/page.tsx
import { Suspense } from 'react'
import LessonList from './_components/lesson-list'

export default function Page() {
  return (
    <>
      <CourseHeader />   {/* すぐに表示 */}
      <Suspense fallback={<LessonListSkeleton />}>
        <LessonList />   {/* データが来たらストリーム */}
      </Suspense>
    </>
  )
}
```

ルートセグメント全体のローディングは `loading.tsx` を使う。  
`cookies()` / `headers()` にアクセスするコンポーネントは `<Suspense>` でラップする（ランタイム API はプリレンダリングをブロックするため）。

### Server Actions でデータを変更する

```ts
// app/lib/actions.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createCourse(formData: FormData) {
  // 1. 必ず認証・認可チェック
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email !== process.env.ADMIN_EMAIL) {
    throw new Error('Unauthorized')
  }

  // 2. データ変更
  await supabase.from('courses').insert({ title: formData.get('title') })

  // 3. キャッシュ無効化（redirect の前に呼ぶ）
  revalidatePath('/admin/courses')

  // 4. redirect は最後（例外を throw するので以降のコードは実行されない）
  redirect('/admin/courses')
}
```

ペンディング状態の表示には `useActionState` を使う:

```tsx
'use client'
import { useActionState } from 'react'
import { createCourse } from '@/app/lib/actions'

export function CourseForm() {
  const [state, action, pending] = useActionState(createCourse, null)
  return (
    <form action={action}>
      <button type="submit" disabled={pending}>
        {pending ? '保存中...' : 'コースを作成'}
      </button>
    </form>
  )
}
```

### サーバー専用コードの漏洩を防ぐ

DB クライアントや秘密鍵を含むファイルには `import 'server-only'` を先頭に置く。  
Client Component に誤って import するとビルド時エラーになる。

```ts
// app/lib/supabase/server.ts
import 'server-only'
import { createServerClient } from '@supabase/ssr'
// ...
```

### ナビゲーション

```tsx
// ページ遷移リンク → next/link の <Link> を使う（<a> タグは使わない）
import Link from 'next/link'
<Link href="/courses">コース一覧</Link>

// Client Component でのプログラム遷移
'use client'
import { useRouter } from 'next/navigation'
const router = useRouter()
router.push('/login')

// Server Action / Server Component でのリダイレクト
import { redirect } from 'next/navigation'
redirect('/login')
```

### Context Provider は Client Component でラップする

React Context は Server Component では使えない。Provider は Client Component にして、できるだけツリーの深い位置に置く。

```tsx
// app/providers/theme-provider.tsx
'use client'
import { createContext } from 'react'
export const ThemeContext = createContext({})
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <ThemeContext.Provider value="dark">{children}</ThemeContext.Provider>
}

// app/layout.tsx（Server Component）
import { ThemeProvider } from './providers/theme-provider'
export default function RootLayout({ children }) {
  return <html><body><ThemeProvider>{children}</ThemeProvider></body></html>
}
```

### ディレクトリ構成の慣習

```
app/
  lib/
    actions.ts      # Server Actions（'use server' ファイル単位）
    data.ts         # データ取得関数（server-only）
    supabase/
      server.ts     # サーバー用 Supabase クライアント
      client.ts     # クライアント用 Supabase クライアント
  ui/               # 共有コンポーネント
  (routes)/         # ルートグループ（URL に影響しない整理用）
  [route]/
    _components/    # そのルート専用コンポーネント（_ で非ルート化）
    page.tsx
    loading.tsx
    error.tsx
```

---

## Next.js 16 の破壊的変更（要注意）

コードを書く前に `node_modules/next/dist/docs/` の該当ドキュメントを確認すること。

### 非同期 Request API（同期アクセス完全廃止）

`cookies()`、`headers()`、`draftMode()`、`params`、`searchParams` は **async のみ**。v15 の同期互換シムは削除済み。

```tsx
// page.tsx
export default async function Page({ params }: PageProps<'/courses/[id]'>) {
  const { id } = await params
  const query  = await searchParams
}

// route handler
import { cookies, headers } from 'next/headers'
const cookieStore = await cookies()
```

`npx next typegen` で `PageProps<'/path'>` / `LayoutProps` / `RouteContext` 型ヘルパーを生成できる。

### `middleware` → `proxy`

`middleware.ts` と `middleware` named export は非推奨。`proxy.ts` にリネームし `export function proxy` を使う。`edge` ランタイムは `proxy` では**非対応**（Node.js のみ）。

### Turbopack デフォルト化

`next dev` / `next build` は両方 Turbopack を使用。`next.config.ts` にカスタム `webpack` 設定があると `next build` が**失敗**する。`turbopack:` キーはトップレベルに移動（`experimental.turbopack` は廃止）。

### キャッシュ API

```ts
// revalidateTag は第2引数（cacheLife プロファイル）が必須
revalidateTag('courses', 'max')

// 安定版に昇格（unstable_ プレフィックス不要）
import { cacheLife, cacheTag } from 'next/cache'
```

### PPR（Partial Prerendering）

`experimental.ppr` / `experimental_ppr` ルートセグメント設定は削除。代わりに `next.config.ts` で `cacheComponents: true` を使う。

### Parallel Routes

`@slot` フォルダにはすべて明示的な `default.tsx` が必要。ないとビルドが失敗する。

### 削除された API

- `serverRuntimeConfig` / `publicRuntimeConfig` → 環境変数（`NEXT_PUBLIC_` プレフィックス）を使う
- AMP サポート（`next/amp`、`useAmp`）
- `next lint` コマンド
- `size` / `First Load JS` ビルド出力メトリクス

---

## Tailwind CSS v4

`tailwind.config.js` は存在しない。設定は CSS の `@theme` で行う。

```css
/* globals.css */
@import "tailwindcss";

@theme inline {
  --color-brand: #0070f3;
  --font-sans: var(--font-geist-sans);
}
```

PostCSS は `@tailwindcss/postcss`（`postcss.config.mjs` 設定済み）。  
Sass のチルダインポート（`~package/…`）は Turbopack 非対応 → `package/…` と書く。

---

## ESLint

ESLint v9 フラット設定（`eslint.config.mjs`）。レガシーの `.eslintrc` 形式は使用しない。
