# Next.js Application

## Stack

- App Router
- Tailwind / Shadcn/ui
- `app/global.css` design tokens (toggle theme by adding/removing class `dark` from `layout.tsx` `<html>`)
- Vitest
- TypeScript
- Auth is a combination of cookies for routes and JWT for API requests (jwt good approach when apis are on another server)
- Zustand for state — `auth-store.ts` and `transactions-store.ts`
- Hooks — `use-auth.ts`

## Pages

- Auth
  - Login
  - Register
- Dashboard
  - Dashboard
  - Account
  - Profile
  - Transactions
    - `transactions/[id]`

## APIs

- Accounts
  - `accounts/[id]` _(API implemented but no UI)_
- Auth
  - Login _(generates mock JWT and creates `is-authenticated` cookie)_
  - Logout _(deletes cookie; mock JWT values cached on frontend removed by client-side action)_
  - Me _(auth convenience call)_
  - Register
- Dashboard
- Profile
- Transactions
  - `transactions/[id]` _(API and UI implemented)_
