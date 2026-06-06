# Business Logic — okazu

## Registration & Exchange Window
- Open: time admin sets `lunch_settings` for the day → `lunch_settings.end_time`
- Both okazu registration and exchange requests follow the same window
- After `matched_at` is set on an `okazu_registration`, that record is locked (no edit/delete)

## Account Registration Flow
1. Email + password signup → confirmation email sent
2. Unverified users stuck on "check your email" screen (resend button only)
3. After email verification → enter invite code → set nickname → home

## Exchange / Matching Flow
1. User A registers giving_menu_ids, wanting_menu_ids, preferred_time, preferred_place
2. User B browses same-day registrations (other users only)
3. User B taps User A → exchange is instant (承認不要), match recorded in `matches`
4. `okazu_registrations.matched_at` set on both sides
5. Notification sent to User A (responder)
6. User A's registration removed from the live list (Supabase Realtime)

## One-to-many matching
- One user can match with multiple people on the same day

## Admin-only actions
- Issue/modify/deactivate invite codes
- Add/delete menus, set allergens
- Set daily `lunch_settings`
- View all registrations and exchange status for the day
- Force-remove users, change roles (user ↔ admin)

## Nickname uniqueness
- Unique within a community (not globally)

## Invite code
- Required at registration after email verification
- Codes have expiry (`expires_at`) and active flag (`is_active`)
