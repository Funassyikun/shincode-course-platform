import 'server-only'
import { createClient } from '@/lib/supabase/server'

export async function requireAdmin() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()

  if (!data?.claims) {
    return { authorized: false, reason: 'unauthenticated' } as const
  }

  const email = data.claims.email as string | undefined
  if (email !== process.env.ADMIN_EMAIL) {
    return { authorized: false, reason: 'forbidden' } as const
  }

  return { authorized: true, userId: data.claims.sub, email } as const
}
