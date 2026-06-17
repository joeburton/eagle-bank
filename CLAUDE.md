# CLAUDE.md — Eagle Bank

This file gives Claude context for working on the Eagle Bank project. Read it at the start of every session.

---

## What this project is

Eagle Bank is a production-grade banking frontend built as a take-home assessment for a **UI Front End Developer (AVP)** role at Barclays (Knutsford / Manchester). The brief asked for a responsive, accessible, performant banking platform that demonstrates scalable frontend engineering, design system thinking, secure coding, and collaboration readiness.

The assessment is evaluated across these weighted categories:

| Category | Weight |
|---|---|
| Frontend Architecture | 20% |
| Testing Quality | 15% |
| Responsive & Accessible Design | 15% |
| Design System Thinking | 10% |
| Performance Optimisation | 10% |
| Production Readiness | 10% |
| Code Maintainability | 10% |
| Webpack / Vite Performance | 5% |
| Documentation & Communication | 5% |

---

## Stack

- **Next.js 16** — App Router, React Server Components, Route Handlers for mock APIs
- **TypeScript** — strict throughout
- **Tailwind CSS v4** — CSS-first config, utility classes
- **shadcn/ui** — component source copied into repo (`components/ui/`), owned and modifiable
- **Zustand** — `auth-store.ts` and `transactions-store.ts`
- **Vitest + Testing Library** — unit tests in `__tests__/`
- **pnpm** — package manager

---

## Commands

```bash
pnpm install         # install dependencies
pnpm dev             # dev server at http://localhost:3000
pnpm test            # vitest in watch mode
pnpm test:coverage   # coverage report
pnpm build           # production build
pnpm analyze         # bundle analysis (runs ANALYZE=true next build)
```

Demo credentials: `joe.burton@eaglebank.com` / any password  
Live URL: https://eagle-bank-one.vercel.app

---

## Project structure

```
app/
  (auth)/            # Login, Register — shared brand layout
  (dashboard)/       # Protected pages — sidebar layout
    dashboard/
      accounts/
      transactions/[id]/
      profile/
  api/               # Mock Route Handlers (auth, accounts, dashboard, transactions, profile)
  layout.tsx
  not-found.tsx
components/
  ui/                # shadcn/ui owned components — edit freely
  nav-sidebar.tsx
  mobile-nav.tsx     # Bottom tab bar for mobile
  mobile-header.tsx  # Top header bar for mobile
  error-boundary.tsx
hooks/
  use-auth.ts        # Login / register / logout logic
lib/
  api-client.ts      # Typed fetch wrapper
  mock-data.ts       # Seed data for all endpoints
  utils.ts           # cn, formatCurrency, formatDate, maskAccountNumber, etc.
stores/
  auth-store.ts      # User session, token, loading/error — persisted to localStorage
  transactions-store.ts  # Transaction list, pagination, filters
types/
  index.ts           # Shared TypeScript types
__tests__/
  api/
  components/
  stores/
docs/
  Frontend_Take_Home_Test_25-May.docx   # Original assessment brief
  Job Description - UI Front End Developer 1 (2).docx  # Target role spec
```

---

## Architecture decisions

### Auth: cookie + localStorage hybrid
The login route handler sets an `httpOnly` presence-flag cookie (`is-authenticated`) for middleware-based route protection — it contains no sensitive data. The actual Bearer token (a mock JWT) is persisted in Zustand/localStorage and sent as a `Bearer` header on all API requests. This mirrors production patterns where APIs may live on a separate server (JWT is appropriate in that scenario).

### Mock APIs as real Route Handlers
All endpoints live in `app/api/` as proper Next.js Route Handlers with simulated latency via `setTimeout`. The same `apiClient` fetch wrapper would work against a real backend with no page-level changes.

### shadcn/ui — we own the components
Components are copied into `components/ui/`, not imported from a package. Customise them directly. Add new ones with:
```bash
npx shadcn@latest add <component-name>
```

### State: two Zustand stores
- `authStore` — session, token, loading/error state
- `transactionsStore` — list, pagination, filters
Only genuinely shared cross-component data lives here; local state handles the rest.

### Design tokens
CSS custom properties are defined in `app/globals.css`. Toggle dark mode by adding/removing the `dark` class on the `<html>` element in `layout.tsx`.

---

## Theme / dark mode

Toggle dark mode by adding or removing the `dark` class on `<html>` in `app/layout.tsx`. All tokens are defined as CSS variables in `app/globals.css`.

---

## Adding shadcn/ui components

```bash
npx shadcn@latest add dialog
```

The file lands at `components/ui/dialog.tsx`. To add a custom variant, edit the CVA config directly in the component file.

---

## Testing

Tests use **Vitest + Testing Library**. Current coverage:

| Area | What's tested |
|---|---|
| `lib/utils.ts` | Currency/date formatting, masking, sign helpers |
| `stores/auth-store` | Login, logout, token persistence, error/loading state |
| `stores/transactions-store` | Pagination, filters, reset |
| `proxy.ts` | Route protection, redirects, auth cookie checks |
| `components/nav-sidebar` | Rendering, active state, keyboard nav |
| `components/mobile-nav` | Rendering, active route, links |
| `components/mobile-header` | Rendering, user display, logout |
| `components/error-boundary` | Error catch, fallback UI |
| `components/ui/Button` | Rendering, click, disabled, asChild |
| `components/ui/Badge` | Variants, rendering |
| `components/ui/Card` | Rendering, composition |
| `components/ui/Input` | Rendering, value, disabled |
| `components/ui/Label` | Rendering, association |
| `components/ui/Select` | Rendering, options |
| `components/ui/Skeleton` | Rendering, animation class |
| `api/auth` | Fetch contract — endpoint, method, body, error handling |
| `api/transactions/[id]` | Valid id, 404, response shape |

---

## What's complete vs outstanding

### Complete
- Full auth flow (login, register, logout, route protection)
- Dashboard with summary cards and recent transactions
- Accounts page (savings + credit, masked numbers, status badges)
- Transactions list with date/amount filters, pagination, detail page
- User profile view and edit (name, email, phone, address, avatar mock)
- Error states, empty states, skeleton loaders, retry actions, 404 page, error boundary
- Design tokens, responsive layout, dark mode support
- Accessibility: semantic HTML, ARIA attributes, focus management, keyboard nav, WCAG AA contrast
- Page transitions, hover/focus states, skeleton pulse, button press scale
- Core unit tests (stores, utils, button, API contracts)

### Not yet done (potential areas to improve)
- Optimistic updates
- Modal/dialog component — `@radix-ui/react-dialog` is installed but no `components/ui/dialog.tsx` has been scaffolded yet
- Form validation unit tests (login/register Zod schemas)
- Page-level component tests (dashboard, accounts, transactions pages)
- React Suspense integration
- Skip-to-main-content link
- Lighthouse score documented
- Storybook / design system documentation
- Explicit caching strategy

---

## Key engineering values this project demonstrates

From the job description — the role expects:
- Modern frontend frameworks experience (Next.js App Router)
- Responsive & accessible design
- Performance optimisation
- Design system thinking
- Animation & micro-interactions
- Backend integration knowledge (mock API layer that mirrors real integration patterns)
- Secure coding practices (httpOnly cookies, SameSite, input validation, masked account numbers)
- Cross-functional collaboration readiness (clean code, meaningful commits, thorough README)

Barclays values in scope: **Respect, Integrity, Service, Excellence, Stewardship**. The Barclays Mindset: **Empower, Challenge, Drive**.

---

## Security practices in place

- `httpOnly` presence-flag cookie (`is-authenticated`) — not accessible to JS (XSS mitigation); contains no sensitive data
- `SameSite: lax` — CSRF protection
- Zod + React Hook Form — JS validation, not bypassable native browser validation
- `maskAccountNumber` — account numbers never displayed in full
- `Content-Type: application/json` enforced on all API calls

---

## Notes on the codebase

- `accounts/[id]` API is implemented but has no UI page yet
- `proxy.ts` handles route protection middleware
- `use-auth.ts` hook encapsulates all auth actions — prefer using it over calling stores directly
- `lib/mock-data.ts` is the single source of truth for all seed data
