# DB Schema — okazu

All tables live in Supabase (PostgreSQL). All major tables carry `community_id`.

## Tables

### communities
`id, name, created_at`

### profiles
`id (= auth.users.id), community_id, nickname, role, created_at`
- `nickname`: unique within community, max 10 chars
- `role`: `user` | `admin`
- Initial admin created directly in Supabase dashboard

### invite_codes
`id, community_id, code, expires_at, is_active, created_at`
- `expires_at` default: 7 days from creation
- Admin can change expiry, deactivate codes

### menus
`id, community_id, name, allergens[], is_custom, created_at`
- `allergens[]`: array of allergen name strings
- Preset allergens: 小麦, 卵, 乳製品, 落花生, えび, かに, そば, くるみ (+ free text)

### lunch_settings
`id, community_id, date, start_time, end_time, created_at`
- Set per day by admin; defines the window for registration and exchange

### okazu_registrations
`id, community_id, user_id, date, giving_menu_ids[], wanting_menu_ids[], preferred_time (time), preferred_place (max 30 chars), matched_at, created_at`
- `matched_at` set when a match is made; once set, record is immutable

### matches
`id, community_id, requester_id, responder_id, giving_registration_id, wanting_registration_id, matched_at, place`

### notifications
`id, user_id, type, message, is_read, created_at`
- App-internal only (no push/email)
- Sent to responder when a match is made
