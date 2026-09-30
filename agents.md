# NivoLeads — AI Agent & Developer Guidelines (agents.md)

## 1. Role & Context
You are working on **NivoLeads**, a production-grade B2B business directory application built on **Next.js 14 App Router, TypeScript, Tailwind CSS, Prisma, and MySQL**.

---

## 2. Mandatory Rules & Behavioral Boundaries

### 2.1 Security & Secret Protection
- **NEVER commit secrets or credentials**: Never hardcode API keys, Razorpay secrets, database passwords, or JWT secrets into source files, markdown documents, seed files, or comments.
- **Strict `.env` isolation**: All sensitive configurations must be read exclusively from `process.env`.
- **Database Safety**: Never execute destructive commands (`DROP TABLE`, `TRUNCATE`, unconstrained `DELETE`) on production databases. Always check dependencies before modifying schemas.

### 2.2 Preserving Business Logic Invariants
1. **Sequential Contact Allocation**: When modifying quote calculation or purchase fulfillment, preserve the guarantee that customers never receive duplicate contacts across multiple orders in the same category.
2. **Server-Side Pricing**: Prices and discounts must ALWAYS be calculated on the server side from database pricing rules. Never accept client-submitted prices or amounts.
3. **Contact Access Protection**: Contact data must only be served through authenticated, paginated API endpoints (`/api/purchases/:id/contacts`) for completed, verified purchases. Never implement raw export or bulk dump endpoints.

### 2.3 UI/UX & Design Consistency
- **Aesthetic Excellence**: All pages must maintain rich, modern aesthetics with vibrant brand colors, clean typography, responsive layouts, and smooth micro-interactions.
- **Dark Mode Support**: Always test both light and dark themes. Use semantic CSS variables (`var(--bg-page)`, `var(--bg-card)`, `var(--border-card)`, `var(--text-main)`, etc.) instead of hardcoded `bg-white` or `text-slate-900`.
- **Button Protection**: Ensure `.btn-primary` retains `forced-color-adjust: none;` and explicit `#2563EB` background styling to prevent browser dark-mode inverters from washing out buttons.

---

## 3. Workflow for Making Changes

1. **Investigate First**: Read relevant files and understand existing patterns before editing.
2. **Type Safety**: Run `npx tsc --noEmit` to verify type integrity after every TypeScript edit.
3. **Clean Code**: Follow established project conventions in `codestyle.md`.
4. **Git Hygiene**: When committing, write descriptive commit messages that accurately reflect the scope and rationale of the changes.
