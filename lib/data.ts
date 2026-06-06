import 'server-only'
import { createClient } from '@/lib/supabase/server'

export async function getCourses() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('courses')
    .select('id, title, description, thumbnail_url, created_at')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function getCourseById(id: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('courses')
    .select('*')
    .eq('id', id)
    .single()
  return data
}

export async function getLessonsByCourseId(courseId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('lessons')
    .select('id, title, order, is_free')
    .eq('course_id', courseId)
    .order('order', { ascending: true })
  if (error) throw error
  return data
}

export async function getLessonById(lessonId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('lessons')
    .select('*')
    .eq('id', lessonId)
    .single()
  return data
}

export async function getCompletedLessonIds(userId: string, lessonIds: string[]) {
  if (lessonIds.length === 0) return []
  const supabase = await createClient()
  const { data } = await supabase
    .from('lesson_progress')
    .select('lesson_id')
    .eq('user_id', userId)
    .in('lesson_id', lessonIds)
  return data?.map((r) => r.lesson_id) ?? []
}
