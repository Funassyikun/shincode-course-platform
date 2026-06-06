# 02 DB セットアップ・RLS

## 概要

Supabase 上にテーブルを作成し、Row Level Security（RLS）ポリシーを設定する。

---

## ToDo

### テーブル作成

- [x] `courses` テーブルを作成
- [x] `lessons` テーブルを作成
- [x] `lesson_progress` テーブルを作成

### RLS 設定

- [x] 全テーブルの RLS を有効化
- [x] `courses`：全員が SELECT 可能なポリシーを追加
- [x] `lessons`：全員が SELECT 可能なポリシーを追加
- [x] `lesson_progress`：本人のみ SELECT 可能なポリシーを追加
- [x] `lesson_progress`：本人のみ INSERT / DELETE 可能なポリシーを追加

### 確認

- [x] Supabase ダッシュボードでテーブルが正しく作成されているか確認
- [x] `auth.users` が自動管理されていることを確認（自前テーブル不要）

---

## SQL

### `courses` テーブル

```sql
create table courses (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  description   text,
  thumbnail_url text,
  created_at    timestamp with time zone default now()
);

alter table courses enable row level security;

create policy "courses_select_all"
  on courses for select
  to public
  using (true);
```

### `lessons` テーブル

```sql
create table lessons (
  id          uuid primary key default gen_random_uuid(),
  course_id   uuid references courses(id) on delete cascade,
  title       text not null,
  youtube_url text not null,
  "order"     integer not null default 0,
  is_free     boolean not null default false,
  created_at  timestamp with time zone default now()
);

alter table lessons enable row level security;

create policy "lessons_select_all"
  on lessons for select
  to public
  using (true);
```

> `order` は予約語のため、カラム名はダブルクォートで囲む。

### `lesson_progress` テーブル

```sql
create table lesson_progress (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid references auth.users(id) on delete cascade,
  lesson_id    uuid references lessons(id) on delete cascade,
  completed_at timestamp with time zone default now(),
  unique(user_id, lesson_id)
);

alter table lesson_progress enable row level security;

create policy "lesson_progress_select_own"
  on lesson_progress for select
  to authenticated
  using (auth.uid() = user_id);

create policy "lesson_progress_insert_own"
  on lesson_progress for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "lesson_progress_delete_own"
  on lesson_progress for delete
  to authenticated
  using (auth.uid() = user_id);
```

## RLS 方針まとめ

| テーブル | SELECT | INSERT / UPDATE / DELETE |
|---|---|---|
| `courses` | 全員（public） | サーバーサイドで管理者チェック済み `service_role` を使用 |
| `lessons` | 全員（public） | 同上 |
| `lesson_progress` | 本人のみ（`auth.uid() = user_id`） | 本人のみ |
