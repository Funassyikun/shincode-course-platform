'use server'

import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createLesson(courseId: string, formData: FormData) {
  const result = await requireAdmin()
  if (!result.authorized) redirect('/')

  const supabase = await createClient()
  const { data: existing } = await supabase
    .from('lessons')
    .select('order')
    .eq('course_id', courseId)
    .order('order', { ascending: false })
    .limit(1)
  const nextOrder = (existing?.[0]?.order ?? -1) + 1

  await supabase.from('lessons').insert({
    course_id: courseId,
    title: formData.get('title') as string,
    youtube_url: formData.get('youtube_url') as string,
    is_free: formData.get('is_free') === 'true',
    order: nextOrder,
  })

  revalidatePath(`/courses/${courseId}`)
  revalidatePath(`/admin/courses/${courseId}/lessons`)
  redirect(`/admin/courses/${courseId}/lessons`)
}

export async function updateLesson(courseId: string, lessonId: string, formData: FormData) {
  const result = await requireAdmin()
  if (!result.authorized) redirect('/')

  const supabase = await createClient()
  await supabase.from('lessons').update({
    title: formData.get('title') as string,
    youtube_url: formData.get('youtube_url') as string,
    is_free: formData.get('is_free') === 'true',
    order: Number(formData.get('order')),
  }).eq('id', lessonId)

  revalidatePath(`/courses/${courseId}`)
  revalidatePath(`/admin/courses/${courseId}/lessons`)
  redirect(`/admin/courses/${courseId}/lessons`)
}

export async function deleteLesson(courseId: string, lessonId: string) {
  const result = await requireAdmin()
  if (!result.authorized) redirect('/')

  const supabase = await createClient()
  await supabase.from('lessons').delete().eq('id', lessonId)

  revalidatePath(`/courses/${courseId}`)
  revalidatePath(`/admin/courses/${courseId}/lessons`)
}

export async function moveLessonUp(courseId: string, lessonId: string) {
  const result = await requireAdmin()
  if (!result.authorized) redirect('/')

  const supabase = await createClient()
  const { data: lessons } = await supabase
    .from('lessons')
    .select('id, order')
    .eq('course_id', courseId)
    .order('order', { ascending: true })
  if (!lessons) return

  const idx = lessons.findIndex((l) => l.id === lessonId)
  if (idx <= 0) return

  const current = lessons[idx]
  const above = lessons[idx - 1]
  await Promise.all([
    supabase.from('lessons').update({ order: above.order }).eq('id', current.id),
    supabase.from('lessons').update({ order: current.order }).eq('id', above.id),
  ])

  revalidatePath(`/admin/courses/${courseId}/lessons`)
}

export async function moveLessonDown(courseId: string, lessonId: string) {
  const result = await requireAdmin()
  if (!result.authorized) redirect('/')

  const supabase = await createClient()
  const { data: lessons } = await supabase
    .from('lessons')
    .select('id, order')
    .eq('course_id', courseId)
    .order('order', { ascending: true })
  if (!lessons) return

  const idx = lessons.findIndex((l) => l.id === lessonId)
  if (idx < 0 || idx >= lessons.length - 1) return

  const current = lessons[idx]
  const below = lessons[idx + 1]
  await Promise.all([
    supabase.from('lessons').update({ order: below.order }).eq('id', current.id),
    supabase.from('lessons').update({ order: current.order }).eq('id', below.id),
  ])

  revalidatePath(`/admin/courses/${courseId}/lessons`)
}
