# WLF Payload CMS - Git History & Evolution

> **Last Updated:** 2026-01-29  
> **Repository:** `https://github.com/cabyz/dokploy-payload-zen.git`

---

## Quick Reference

```bash
# View full history
git log --oneline --all --graph

# View specific commit
git show --stat <commit-hash>

# Rollback to stable version
git checkout v1.3.0-full-template
```

---

## Complete Commit Timeline

| Commit | Tag | Date (UTC) | Summary |
|--------|-----|------------|---------|
| `4a302e0` | - | Jan 29, 2026 | **Initial Import** - Full PayloadCMS template |
| `014ca6d` | `v1.0.0-before-splithead` | Jan 29 04:37 | **R2 Storage** - Cloudflare R2 integration |
| `d551b69` | - | Jan 29 04:47 | **Split-Head Prep** - CORS, LivePreview URL |
| `9c83455` | `v1.1.0-monorepo-created` | Jan 29 | **Monorepo** - Created apps/cms, apps/web |
| `4bfcd5c` | - | Jan 29 | **Fix** - Sync pnpm-lock (tsx, zod, storage-s3) |
| `ccee6c4` | - | Jan 29 | **Fix** - ESLint errors in apps/web |
| `75fe4ed` | - | Jan 29 | **Fix** - Static export for Cloudflare Pages |
| `cbb49bf` | - | Jan 29 | **Fix** - Restore root build for Dokploy |
| `0a18ce7` | `v1.2.0-splithead-working` | Jan 29 | **Minimal Proof** - Split-head verified |
| `b922e9e` | `v1.3.0-full-template` | Jan 29 08:42 | **Full Frontend** - All components ported |
| `9956136` | - | Jan 29 | **Docs** - Architecture, Development guides |
| `4e47d74` | **HEAD** | Jan 29 15:22 | **Pricing Block** - First custom block |

---

## Detailed Commit Breakdown

### 1. Initial Import (`4a302e0`)

**Files Changed:** 208 files (+23,765 lines)

The initial import of the PayloadCMS v3 template. This is the `nlvcodes/dokploy-hosted-example` template with Dockerfile configured for Dokploy deployment.

**Key Components:**
- `src/collections/` - Pages, Posts, Media, Users, Categories
- `src/blocks/` - ArchiveBlock, Banner, CallToAction, Code, Content, Form, MediaBlock
- `src/heros/` - HighImpact, MediumImpact, LowImpact, PostHero
- `src/components/` - UI components (Card, Link, Pagination, RichText, etc.)
- `src/endpoints/seed/` - Demo content seeder
- `Dockerfile` - Multi-stage build for standalone Next.js

**Critical Files:**
```
Dockerfile                    # Multi-stage Alpine build
next.config.js               # Standalone output mode
src/payload.config.ts        # Main Payload configuration
src/payload-types.ts         # Generated TypeScript types
package.json                 # Dependencies and scripts
```

---

### 2. R2 Storage Integration (`014ca6d`) - `v1.0.0-before-splithead`

**Files Changed:** 4 files (+78 lines)

Added Cloudflare R2 storage adapter to replace local file storage.

**Changes:**
- Added `@payloadcms/storage-s3` package
- Updated `payload.config.ts` with conditional R2 storage plugin
- Added R2 domain patterns to `next.config.js` for image optimization
- Set `disablePayloadAccessControl: true` (fixes Edit View crash per NotebookLM)
- Updated `.env.example` with R2 credential templates

**Environment Variables Added:**
```env
R2_BUCKET=your-bucket-name
R2_ACCESS_KEY_ID=your-key-id
R2_SECRET_ACCESS_KEY=your-secret
R2_ACCOUNT_ID=your-cloudflare-account-id
R2_PUBLIC_ENDPOINT=https://media.yourdomain.com
```

---

### 3. Split-Head Architecture Prep (`d551b69`)

**Files Changed:** 4 files (+180 lines)

Prepared the CMS for Split-Head deployment (separate frontend on Cloudflare Pages).

**Changes:**
- Added CORS configuration for `FRONTEND_URL`
- Added dynamic LivePreview URL targeting Cloudflare Pages
- Created `scripts/schema-audit.ts` for type synchronization
- Added `zod` and `tsx` dependencies

**New Scripts:**
```json
{
  "schema:audit": "tsx scripts/schema-audit.ts"
}
```

---

### 4. Monorepo Restructure (`9c83455`) - `v1.1.0-monorepo-created`

**Files Changed:** 185 files (+15,314 lines)

Major restructure into pnpm monorepo with separate workspaces.

**New Structure:**
```
dokploy-hosted-fixed/
├── apps/
│   ├── cms/                  # PayloadCMS backend (Dokploy)
│   │   └── src/              # Full CMS code
│   └── web/                  # Static frontend (Cloudflare Pages)
│       └── src/
│           ├── app/          # Next.js app router
│           ├── lib/api.ts    # REST API client
│           └── components/   # Decoupled components
├── packages/
│   └── types/
│       └── generated-types.ts  # Shared PayloadCMS types
└── pnpm-workspace.yaml
```

**Key Decisions:**
- Root `src/` kept for Dokploy compatibility (monolith fallback)
- `apps/web` uses static export (`output: 'export'`)
- Shared types via `packages/types`

---

### 5. ESLint & Sync Fixes (`4bfcd5c`, `ccee6c4`)

**Purpose:** Resolve build errors in the new monorepo structure.

**Fixes Applied:**
- Synchronized `pnpm-lock.yaml` after adding tsx, zod, storage-s3
- Fixed ESLint errors: proper `next/link` usage, TypeScript types
- Removed `a` tag wrapping for `Link` components

---

### 6. Static Export Configuration (`75fe4ed`)

**Purpose:** Configure `apps/web` for Cloudflare Pages static export.

**Changes to `apps/web/next.config.mjs`:**
```javascript
const nextConfig = {
  output: 'export',           // Static HTML/CSS/JS only
  trailingSlash: true,        // Required for static hosting
  images: {
    unoptimized: true         // Next.js Image not available in static
  }
}
```

---

### 7. Root Build Restoration (`cbb49bf`)

**Purpose:** Ensure Dokploy can still build from root (not from `apps/cms`).

**Rationale:** Dokploy was configured to build from repository root using original `src/` directory. This commit ensures the monorepo structure doesn't break existing deployment.

---

### 8. Minimal Proof of Concept (`0a18ce7`) - `v1.2.0-splithead-working`

**Purpose:** Verify Split-Head architecture works end-to-end.

**Proof Points:**
- CMS API accessible at `https://cms.wlf.com.mx/api/pages`
- Frontend fetches via REST API at build time
- Static HTML generated successfully
- Both builds pass independently

---

### 9. Full Template Port (`b922e9e`) - `v1.3.0-full-template`

**Files Changed:** 135 files (+4,922 lines)

Ported all original template components to the static frontend.

**Components Ported:**
- All blocks (ArchiveBlock, Banner, CallToAction, Code, Content, Form, MediaBlock)
- All heros (HighImpact, MediumImpact, LowImpact, PostHero)
- All UI components (Card, Pagination, RichText, Media, etc.)
- All providers (Theme, HeaderTheme)

**Key Refactoring:**
1. **Replaced `getPayload()`** - All direct DB calls replaced with REST API fetching
2. **Removed Server-Only Components** - AdminBar, LivePreviewListener, PayloadRedirects deleted
3. **Fixed Import Paths** - All `@/payload-types` point to shared package
4. **Added Fallback Static Params** - Prevents empty generateStaticParams errors

**Critical File: `apps/web/src/lib/api.ts`**
```typescript
const CMS_URL = process.env.CMS_URL || 'https://cms.wlf.com.mx'

export async function fetchFromCMS<T>(endpoint: string, options = {}) {
  const response = await fetch(`${CMS_URL}/api/${endpoint}`, {
    next: { revalidate: 60 },
    ...options
  })
  return response.json() as T
}
```

---

### 10. Documentation (`9956136`)

**Files Added:**
- `docs/ARCHITECTURE.md` - Split-Head architecture explanation
- `docs/DEVELOPMENT.md` - How to develop locally
- `docs/NOTEBOOKLM_QUESTIONS.md` - Research questions for debugging

---

### 11. Pricing Block (`4e47d74`) - **CURRENT HEAD**

**Files Changed:** 25 files (+1,039 lines)

First custom block created using the documented pattern.

**New Files:**
```
src/blocks/Pricing/config.ts        # Payload block config
src/blocks/Pricing/Component.tsx    # CMS component
apps/web/src/blocks/Pricing/Component.tsx  # Frontend component
docs/CUSTOM_BLOCKS.md               # Block creation guide
```

**Block Features:**
- Title and subtitle (RichText)
- Array of pricing plans (name, price, period, features, CTA, highlighted)
- Responsive grid layout
- "Most Popular" badge for highlighted plans

---

## Architecture Diagrams

### Before Split-Head (Monolith)
```
┌────────────────────────────────────┐
│          DOKPLOY VPS               │
│  ┌──────────────────────────────┐  │
│  │     Next.js + Payload        │  │
│  │  ┌────────┐  ┌────────────┐  │  │
│  │  │ /admin │  │ /(frontend)│  │  │
│  │  │ /api   │  │ /posts     │  │  │
│  │  └────────┘  └────────────┘  │  │
│  │                              │  │
│  │         MongoDB              │  │
│  └──────────────────────────────┘  │
└────────────────────────────────────┘
```

### After Split-Head (Current)
```
┌─────────────────────────────────────────────────────────────────┐
│                    CLOUDFLARE PAGES (Edge)                       │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │              apps/web (Static Export)                    │    │
│  │  • Pre-rendered HTML at build time                       │    │
│  │  • Fetches data via REST API during build                │    │
│  │  • No server-side runtime (pure static files)            │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ REST API (Build Time)
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DOKPLOY VPS                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │           Payload CMS (src/, root Next.js)               │    │
│  │  • /admin - Admin Panel                                   │    │
│  │  • /api/* - REST API                                      │    │
│  │  • /(frontend)/* - CMS Preview Frontend                   │    │
│  │  • MongoDB for persistence                                │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

---

## Git Tags (Rollback Points)

| Tag | Commit | Use Case |
|-----|--------|----------|
| `v1.0.0-before-splithead` | `014ca6d` | Rollback to pre-monorepo monolith |
| `v1.1.0-monorepo-created` | `9c83455` | Base monorepo without frontend |
| `v1.2.0-splithead-working` | `0a18ce7` | Minimal proof, good for debugging |
| `v1.3.0-full-template` | `b922e9e` | Full frontend before customization |

---

## Known Issues by Commit

### Current (`4e47d74`)
- ⚠️ **White Screen Flickering** - Stale chunk caching
- ⚠️ **Missing `.dockerignore`** - Local `.next` leaks into Docker build
- ⚠️ **No Cache Headers** - Cloudflare caches HTML with old chunks

### Historical (Fixed)
- ✅ ESLint errors in apps/web (fixed in `ccee6c4`)
- ✅ Static export config (fixed in `75fe4ed`)
- ✅ Root build compatibility (fixed in `cbb49bf`)

---

## Commands for Common Operations

```bash
# Create new tag after major change
git tag -a v1.4.0-feature-name -m "Description"
git push --tags

# View changes between versions
git diff v1.2.0-splithead-working v1.3.0-full-template --stat

# Rollback to previous stable
git checkout v1.3.0-full-template
git checkout -b rollback-branch

# Cherry-pick specific fix
git cherry-pick <commit-hash>
```

---

*This document is the authoritative source for understanding the project's evolution. Update it whenever significant changes are made.*
