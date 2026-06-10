# Eagle Bank — Frontend Assessment

A responsive, accessible banking frontend for Eagle Bank. Built as a production-grade take-home assessment.

**Live demo:** https://eagle-bank-one.vercel.app  
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

### Framework: Next.js 15 (App Router)

App Router was chosen over Pages Router for its first-class support for React Server Components, streaming, nested layouts, and colocated route handlers — all of which directly contribute to performance and code organisation. Route groups (`(auth)` and `(dashboard)`) keep auth and protected pages cleanly separated without polluting the URL structure.

### UI library: shadcn/ui + Tailwind CSS v4

shadcn/ui copies component source into the repo rather than hiding it behind a package. This means we own the components fully — they can be customised, audited, and extended without fighting a library's API surface. It also demonstrates design-system thinking at the token level (CSS custom properties in `globals.css`).

Tailwind CSS v4 brings native CSS-first configuration, which pairs cleanly with the CSS variable token strategy.

### State management: Zustand

Two focused stores are used:

- `authStore` — user session, token, loading/error state, persisted via `zustand/middleware` to `localStorage`
- `transactionsStore` — transaction list, pagination, and filter state

Zustand was chosen over Context API for its minimal boilerplate, lack of provider wrapping, and straightforward devtools integration. RTK Query would be appropriate if we were scaling to many more data-fetching scenarios.

### Mock API: Next.js Route Handlers

All mock endpoints live in `app/api/` as proper Next.js Route Handlers. This mirrors a real backend integration: the same `fetch`-based `apiClient` would work against a real API with no page-level changes. Simulated network latency is added via `setTimeout` to enable realistic loading states.

### Auth: cookie + localStorage hybrid

The Route Handler sets an `httpOnly` cookie (`eagle-bank-token`) for middleware-based route protection, while Zustand persists the token in `localStorage` for client-side auth checks. This is consistent with common production patterns.

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

| Area                        | What's tested                                                   |
| --------------------------- | --------------------------------------------------------------- |
| `lib/utils.ts`              | Currency formatting, date formatting, masking, sign helpers     |
| `stores/auth-store`         | Login state, logout, token persistence, error/loading state     |
| `stores/transactions-store` | Pagination, filters, reset                                      |
| `components/ui/Button`      | Rendering, click handling, disabled state, asChild              |
| `api/auth`                  | Fetch contract — correct endpoint, method, body, error handling |

Run tests:

```bash
pnpm test              # watch mode
pnpm test:coverage     # generate coverage report
```

---

## Security considerations

- Auth token stored in `httpOnly` cookie — not accessible to JavaScript, mitigating XSS token theft.
- `SameSite: lax` on the session cookie prevents CSRF.
- Form inputs use `noValidate` with Zod + React Hook Form — validation runs in JS with full error messaging rather than relying on native browser validation that can be bypassed.
- No sensitive data (account numbers) displayed in full — `maskAccountNumber` utility masks all but the last 4 digits.
- `Content-Type: application/json` header enforced on all API calls.
