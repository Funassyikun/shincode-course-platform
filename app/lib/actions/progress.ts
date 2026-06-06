'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function toggleLessonProgress(
  courseId: string,
  lessonId: string,
  isCompleted: boolean
) {
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()
  if (!data?.claims) redirect('/login')

  if (isCompleted) {
    await supabase
      .from('lesson_progress')
      .delete()
      .eq('user_id', data.claims.sub)
      .eq('lesson_id', lessonId)
  } else {
    await supabase
      .from('lesson_progress')
      .insert({ user_id: data.claims.sub, lesson_id: lessonId })
  }

  revalidatePath(`/courses/${courseId}`)
  revalidatePath(`/courses/${courseId}/lessons/${lessonId}`)
}
