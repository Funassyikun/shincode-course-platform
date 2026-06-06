'use server'

import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createCourse(formData: FormData) {
  const result = await requireAdmin()
  if (!result.authorized) redirect('/')

  const supabase = await createClient()
  await supabase.from('courses').insert({
    title: formData.get('title') as string,
    description: (formData.get('description') as string) || null,
    thumbnail_url: (formData.get('thumbnail_url') as string) || null,
  })

  revalidatePath('/')
  revalidatePath('/admin/courses')
  redirect('/admin/courses')
}

export async function updateCourse(id: string, formData: FormData) {
  const result = await requireAdmin()
  if (!result.authorized) redirect('/')

  const supabase = await createClient()
  await supabase.from('courses').update({
    title: formData.get('title') as string,
    description: (formData.get('description') as string) || null,
    thumbnail_url: (formData.get('thumbnail_url') as string) || null,
  }).eq('id', id)

  revalidatePath('/')
  revalidatePath('/admin/courses')
  revalidatePath(`/courses/${id}`)
  redirect('/admin/courses')
}

export async function deleteCourse(id: string) {
  const result = await requireAdmin()
  if (!result.authorized) redirect('/')

  const supabase = await createClient()
  await supabase.from('courses').delete().eq('id', id)

  revalidatePath('/')
  revalidatePath('/admin/courses')
}
