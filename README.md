# Eagle Bank — Frontend Assessment

A responsive, accessible banking frontend for Eagle Bank. Built as a production-grade take-home assessment.

**Live demo:** <a href="https://eagle-bank-one.vercel.app" target="_blank" rel="noreferrer">https://eagle-bank-one.vercel.app</a>  
**Demo credentials:** `joe.burton@eaglebank.com` / any password

---

## Getting started

```bash
pnpm install
pnpm dev        # http://localhost:3000
pnpm test       # run vitest
pnpm build      # production build
```

---

## Architecture decisions

### Framework: Next.js 16 (App Router)

App Router was chosen over Pages Router for its first-class support for React Server Components, streaming, nested layouts, and colocated route handlers — all of which directly contribute to performance and code organisation. Route groups (`(auth)` and `(dashboard)`) keep auth and protected pages cleanly separated without polluting the URL structure.

### UI library: shadcn/ui + Tailwind CSS v4

shadcn/ui copies component source into the repo rather than hiding it behind a package. This means we own the components fully — they can be customised, audited, and extended without fighting a library's API surface. It also demonstrates design-system thinking at the token level (CSS custom properties in `globals.css`).

Tailwind CSS v4 brings native CSS-first configuration, which pairs cleanly with the CSS variable token strategy.

**Adding new shadcn/ui components**

Use the CLI to copy a component's source directly into `components/ui/`:

```bash
# Add a single component
npx shadcn@latest add dialog

# Add multiple at once
npx shadcn@latest add dialog sheet tooltip
```

The generated file lands at `components/ui/dialog.tsx` and is yours to modify. Import it like any other component:

```tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function ConfirmModal({ children }: { children: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
```

To extend an existing component with a new variant, edit the CVA config directly in the component file:

```tsx
// components/ui/badge.tsx
const badgeVariants = cva("...", {
  variants: {
    variant: {
      default: "...",
      success: "bg-green-100 text-green-700", // custom variant
      warning: "bg-yellow-100 text-yellow-700", // custom variant
    },
  },
});
```

### State management: Zustand

Two focused stores are used:

- `authStore` — user session, token, loading/error state, persisted via `zustand/middleware` to `localStorage`
- `transactionsStore` — transaction list, pagination, and filter state

Zustand was chosen over Context API for its minimal boilerplate, lack of provider wrapping, and straightforward devtools integration. RTK Query would be appropriate if we were scaling to many more data-fetching scenarios.

### Mock API: Next.js Route Handlers

All mock endpoints live in `app/api/` as proper Next.js Route Handlers. This mirrors a real backend integration: the same `fetch`-based `apiClient` would work against a real API with no page-level changes. Simulated network latency is added via `setTimeout` to enable realistic loading states.

### Auth: cookie + localStorage hybrid

The login Route Handler sets an `httpOnly` presence-flag cookie (`is-authenticated`) for middleware-based route protection — it contains no sensitive data. The actual Bearer token (a mock JWT) is persisted in Zustand/localStorage and sent as a `Bearer` header on all API requests. This mirrors production patterns where APIs may live on a separate server.

---

## Folder structure

```
eagle-bank/
├── app/
│   ├── (auth)/            # Login, register — shared brand layout
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/       # Protected pages — sidebar layout
│   │   └── dashboard/
│   │       ├── accounts/
│   │       ├── transactions/
│   │       │   └── [id]/      # Transaction detail page
│   │       └── profile/
│   ├── api/               # Mock Route Handlers
│   │   ├── auth/
│   │   ├── accounts/
│   │   ├── dashboard/
│   │   ├── transactions/
│   │   └── profile/
│   ├── layout.tsx          # Root layout
│   └── not-found.tsx       # 404 page
├── components/
│   ├── ui/                 # shadcn/ui owned components
│   ├── nav-sidebar.tsx
│   ├── mobile-nav.tsx      # Bottom tab bar for mobile
│   ├── mobile-header.tsx   # Top header bar for mobile
│   └── error-boundary.tsx
├── hooks/
│   └── use-auth.ts         # Login / register / logout logic
├── lib/
│   ├── api-client.ts       # Typed fetch wrapper
│   ├── mock-data.ts        # Seed data for all endpoints
│   └── utils.ts            # cn, formatCurrency, formatDate, etc.
├── stores/
│   ├── auth-store.ts
│   └── transactions-store.ts
├── types/
│   └── index.ts            # Shared TypeScript types
└── __tests__/              # Vitest test suites
    ├── api/
    ├── components/
    └── stores/
```

---

## Performance considerations

- **Route splitting:** Each page is a separate JS chunk via Next.js automatic code splitting.
- **`optimizePackageImports`:** `lucide-react` is listed in `next.config.ts` to tree-shake only used icons.
- **Skeleton loading states:** Every data-fetching page shows skeleton placeholders rather than a full-page spinner, maintaining layout stability (good CLS score).
- **`useCallback` on fetch functions:** Prevents unnecessary re-renders in the transactions page when filters change.
- **Image optimisation:** The `next/image` component is used for avatar images.
- **Minimal global state:** Only data that genuinely needs to be shared cross-component lives in Zustand; local component state handles the rest.

---

## Accessibility

- **Semantic HTML:** `<nav>`, `<main>`, `<aside>`, `<section>`, `<ul>`/`<li>` used appropriately throughout.
- **ARIA:** `aria-label`, `aria-current="page"`, `aria-busy`, `aria-invalid`, `aria-describedby`, `aria-live="polite"` applied on interactive and dynamic elements.
- **Focus management:** `:focus-visible` ring visible on all interactive elements; skip-to-main link can be added trivially.
- **Error messages:** Form validation errors are associated to inputs via `aria-describedby` and surfaced to screen readers via `role="alert"`.
- **Keyboard navigation:** All interactive elements are reachable and operable by keyboard; the nav sidebar is fully keyboard navigable with `aria-current` for current page.
- **Colour contrast:** Design tokens target WCAG AA contrast ratios (primary blue on white passes 4.5:1).
- **Radix UI primitives:** Select, Dialog, and other interactive primitives are built on Radix UI (via shadcn) which ships with ARIA and keyboard behaviour baked in.

---

## Testing strategy

Tests live in `__tests__/` and use **Vitest** + **Testing Library**.

| Area                          | What's tested                                                   |
| ----------------------------- | --------------------------------------------------------------- |
| `lib/utils.ts`                | Currency formatting, date formatting, masking, sign helpers     |
| `stores/auth-store`           | Login state, logout, token persistence, error/loading state     |
| `stores/transactions-store`   | Pagination, filters, reset                                      |
| `proxy.ts`                    | Route protection, redirects, auth cookie checks                 |
| `components/nav-sidebar`      | Rendering, active state, keyboard nav                           |
| `components/mobile-nav`       | Rendering, active route, links                                  |
| `components/mobile-header`    | Rendering, user display, logout                                 |
| `components/error-boundary`   | Error catch, fallback UI                                        |
| `components/ui/Button`        | Rendering, click handling, disabled state, asChild              |
| `components/ui/Badge`         | Variants, rendering                                             |
| `components/ui/Card`          | Rendering, composition                                          |
| `components/ui/Input`         | Rendering, value, disabled                                      |
| `components/ui/Label`         | Rendering, association                                          |
| `components/ui/Select`        | Rendering, options                                              |
| `components/ui/Skeleton`      | Rendering, animation class                                      |
| `api/auth`                    | Fetch contract — correct endpoint, method, body, error handling |
| `api/transactions/[id]`       | Valid id, 404, response shape                                   |

Run tests:

```bash
pnpm test              # watch mode
pnpm test:coverage     # generate coverage report
```

---

## Security considerations

- `httpOnly` presence-flag cookie (`is-authenticated`) — not accessible to JavaScript, mitigating XSS token theft; contains no sensitive data. Bearer token lives in Zustand/localStorage for API requests.
- `SameSite: lax` on the session cookie prevents CSRF.
- Form inputs use `noValidate` with Zod + React Hook Form — validation runs in JS with full error messaging rather than relying on native browser validation that can be bypassed.
- No sensitive data (account numbers) displayed in full — `maskAccountNumber` utility masks all but the last 4 digits.
- `Content-Type: application/json` header enforced on all API calls.

---

## Assessment spec checklist

### Authentication

- [x] Login page
- [x] Registration page
- [x] Store authentication state on the frontend (Zustand)
- [x] Protect authenticated routes (`proxy.ts`)
- [x] Persist session using `httpOnly` cookie + `localStorage`
- [x] Display validation and error states
- [x] Loading states during login/register
- [x] `POST /api/auth/register`
- [x] `POST /api/auth/login`
- [x] `POST /api/auth/logout`
- [x] `GET /api/auth/me`

### Dashboard

- [x] Welcome message with user name
- [x] Total account balance
- [x] Summary card: current balance
- [x] Summary card: monthly deposits
- [x] Summary card: monthly withdrawals
- [x] Recent transactions list
- [x] Quick actions section
- [x] Empty states
- [x] Responsive layout
- [x] `GET /api/dashboard`

### Accounts management

- [x] Savings account type
- [x] Credit account type
- [x] Account number displayed (masked)
- [x] Available balance
- [x] Account type label
- [x] Account status badge
- [x] Responsive card layout
- [x] `GET /api/accounts`
- [x] `GET /api/accounts/:id`

### Transactions

- [x] Transaction list
- [x] Filter by date range
- [x] Sort by date
- [x] Sort by amount
- [x] Pagination
- [x] Deposit / withdrawal / transfer types
- [x] `GET /api/transactions`
- [x] `GET /api/transactions/:id` (route handler implemented)
- [x] Transaction detail view/page

### User profile

- [x] View profile information
- [x] Edit full name
- [x] Edit email
- [x] Edit phone number
- [x] Edit address
- [x] Avatar upload (mock/frontend only)
- [x] Form validation
- [x] `GET /api/profile`
- [x] `PUT /api/profile`

### Error handling

- [x] API error states on all pages
- [x] Empty states
- [x] Skeleton loading indicators
- [x] Retry actions
- [x] 404 page
- [x] Global error boundary with fallback UI

### Design system & UI engineering

- [x] Consistent typography and spacing (CSS custom property tokens)
- [x] Reusable Button, Input, Label, Card, Badge, Select, Skeleton components
- [x] Shared theme/token strategy (`globals.css` CSS variables)
- [x] Accessible components via Radix UI primitives
- [x] Strong visual hierarchy
- [ ] Optimistic updates
- [ ] Modal/dialog component
- [ ] Design system documentation (bonus)
- [ ] Storybook integration (bonus)

### Performance & optimisation

- [x] Automatic route splitting (Next.js)
- [x] `optimizePackageImports` for `lucide-react` tree-shaking
- [x] Skeleton loading (stable layout, good CLS)
- [x] `useCallback` on fetch functions to prevent unnecessary re-renders
- [x] `next/image` for optimised image rendering
- [x] Minimal global state — local state used where appropriate
- [x] Bundle analysis script (`pnpm analyze`)
- [ ] React Suspense
- [ ] Lighthouse score documented
- [ ] Explicit caching strategy

### Accessibility

- [x] Semantic HTML (`<nav>`, `<main>`, `<aside>`, `<section>`, `<ul>`)
- [x] ARIA labels, `aria-current`, `aria-busy`, `aria-invalid`, `aria-describedby`, `aria-live`
- [x] `:focus-visible` ring on all interactive elements
- [x] Form errors associated to inputs via `aria-describedby`
- [x] Keyboard navigable sidebar and bottom tab bar
- [x] WCAG AA colour contrast on primary tokens
- [x] Screen reader basics (`role="alert"`, `role="status"`, `aria-hidden` on decorative elements)
- [x] `safe-area-inset-bottom` on mobile nav for notched devices
- [ ] Skip-to-main-content link

### Animations & micro-interactions

- [x] Page fade-in transition (`.page-enter`)
- [x] Hover and focus states on all interactive elements
- [x] Skeleton pulse animation
- [x] Active nav item scale on mobile tab bar
- [x] Button press scale (`active:scale-[0.98]`)
- [ ] Additional micro-interactions (e.g. form submission success animation)

### Engineering & collaboration standards

- [x] Clean code structure and separation of concerns
- [x] Typed throughout with TypeScript
- [x] Thoughtful abstraction (shared hooks, stores, utils, api-client)
- [x] Clear documentation
- [ ] Meaningful git commit history (ongoing)

### Testing

- [x] Auth store tests (login, logout, token persistence, error/loading state)
- [x] Transactions store tests (filters, pagination, reset)
- [x] Utility function tests (formatting, masking)
- [x] Proxy/middleware tests (route protection, redirects, cookie checks)
- [x] Nav sidebar, mobile nav, mobile header, error boundary component tests
- [x] UI component tests (Button, Badge, Card, Input, Label, Select, Skeleton)
- [x] API fetch contract tests (auth login)
- [x] Transaction detail API tests (valid id, 404, endpoint, response shape)
- [ ] Form validation unit tests (login/register Zod schemas)
- [ ] Page-level component tests (dashboard, accounts, transactions pages)

### README

- [x] Architecture decisions
- [x] Folder structure rationale
- [x] State management approach
- [x] Performance considerations
- [x] Accessibility considerations
- [x] How to run and test
- [x] Deployment URL
