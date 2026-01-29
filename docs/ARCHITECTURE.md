# WLF Split-Head Architecture

## Overview

This project uses a **Split-Head Architecture** where:
- **CMS (Dokploy VPS)**: `cms.wlf.com.mx` - Payload Admin + REST API
- **Frontend (Cloudflare Pages)**: Static export consuming REST API

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    CLOUDFLARE PAGES (Edge)                       │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              apps/web (Static Export)                    │   │
│  │  • Pre-rendered HTML at build time                       │   │
│  │  • Fetches data via REST API during build                │   │
│  │  • No server-side runtime (pure static files)            │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ REST API (Build Time)
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DOKPLOY VPS                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │           Payload CMS (src/, root Next.js)               │   │
│  │  • /admin - Admin Panel                                   │   │
│  │  • /api/* - REST API                                      │   │
│  │  • /(frontend)/* - CMS Preview Frontend                   │   │
│  │  • MongoDB for persistence                                │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## Directory Structure

```
dokploy-hosted-fixed/
├── src/                          # CMS (Payload) - Deploys to Dokploy
│   ├── app/
│   │   ├── (frontend)/           # CMS Preview Frontend
│   │   ├── (payload)/            # Payload Admin Routes
│   │   └── my-route/             # Custom API Routes
│   ├── collections/              # Payload Collection Configs
│   ├── blocks/                   # Block Configs + Components
│   ├── fields/                   # Custom Field Configs
│   ├── endpoints/                # Custom Endpoints (incl. seed)
│   ├── payload.config.ts         # Main Payload Config
│   └── payload-types.ts          # Generated Types
│
├── apps/
│   └── web/                      # Frontend - Deploys to Cloudflare
│       ├── src/
│       │   ├── app/              # Next.js App Router
│       │   ├── blocks/           # Block Components (NO configs)
│       │   ├── components/       # UI Components
│       │   ├── heros/            # Hero Components
│       │   ├── lib/api.ts        # REST API Client
│       │   └── utilities/        # Helper Functions
│       ├── next.config.mjs       # Static Export Config
│       └── out/                  # Build Output
│
├── packages/
│   └── types/                    # Shared TypeScript Types
│       └── generated-types.ts    # Copied from payload-types.ts
│
└── pnpm-workspace.yaml           # Monorepo Config
```

## Key Architectural Decisions

### 1. Why Split-Head?

| Benefit | Explanation |
|---------|-------------|
| **Performance** | Static files served from Cloudflare edge (~50ms globally) |
| **SEO** | Pre-rendered HTML, perfect for search engines |
| **Cost** | No compute for frontend, just storage |
| **Reliability** | Static files can't crash or timeout |
| **Security** | No server vulnerabilities on frontend |

### 2. Data Fetching Strategy

**CMS (Dokploy):** Uses `getPayload()` for direct database access
```typescript
// src/app/(frontend)/[slug]/page.tsx
const payload = await getPayload({ config: configPromise })
const page = await payload.find({ collection: 'pages' })
```

**Frontend (Cloudflare):** Uses REST API via fetch
```typescript
// apps/web/src/lib/api.ts
const response = await fetch(`${CMS_URL}/api/pages`)
return response.json()
```

### 3. Static Export Constraints

Things that **DON'T WORK** in static export:
- `getPayload()` - No Node.js runtime
- `draftMode()` - No server-side state
- API Routes - No server to handle requests
- Rewrites - No server to proxy
- `revalidatePath()` - No server to invalidate

Things that **DO WORK**:
- `generateStaticParams()` - At build time only
- `fetch()` with `next: { revalidate }` - At build time only
- All React components - Pre-rendered to HTML
- CSS/JS - Bundled as static assets

## Critical Learnings

### 1. The "Component Entanglement Trap"

**Problem:** Original template components are deeply coupled to Payload:
```typescript
// Original - WON'T WORK on Edge
import { getPayload } from 'payload'
import configPromise from '@payload-config'
```

**Solution:** Replace ALL `getPayload()` with REST API:
```typescript
// Fixed - WORKS on Edge
import { getPageBySlug } from '@/lib/api'
const page = await getPageBySlug(slug)
```

### 2. Import Path Standardization

**Problem:** Mixed import paths break builds:
```typescript
// These all point to the same file but cause errors:
from 'src/payload-types'
from '../payload-types'  
from '@/payload-types'
```

**Solution:** Always use `@/payload-types` with proper tsconfig alias:
```json
// apps/web/tsconfig.json
{
  "paths": {
    "@/*": ["./src/*"],
    "@/payload-types": ["../../packages/types/generated-types"]
  }
}
```

### 3. Server-Only Components Must Be Removed

For `apps/web`, these components **cannot exist**:
- `AdminBar` - Uses `draftMode()`
- `LivePreviewListener` - WebSocket to CMS
- `PayloadRedirects` - Needs `getPayload()`

### 4. The Preview Paradox

**Issue:** Preview button in CMS Admin tries to open frontend, but frontend is static.

**Solution:** Use CMS's own frontend (`cms.wlf.com.mx`) for preview:
- CMS has the full original template with SSR
- Preview works there with live updates
- Production traffic goes to Cloudflare

### 5. generateStaticParams Must Return Non-Empty

For `output: 'export'`, dynamic routes MUST have at least one path:
```typescript
export async function generateStaticParams() {
  try {
    const pages = await getPages()
    return pages.docs.length > 0 
      ? pages.docs.map(p => ({ slug: p.slug }))
      : [{ slug: 'about' }]  // Fallback required!
  } catch {
    return [{ slug: 'about' }]  // Handle API failures
  }
}
```

## Webhook for Automatic Rebuilds

### Setup (Cloudflare Pages Deploy Hook)

1. Go to Cloudflare Dashboard → Pages → Your Project → Settings → Builds
2. Create Deploy Hook → Copy URL
3. In Payload, add afterChange hook to trigger rebuild:

```typescript
// src/collections/Pages.ts
{
  hooks: {
    afterChange: [
      async () => {
        await fetch(process.env.CLOUDFLARE_DEPLOY_HOOK_URL, {
          method: 'POST'
        })
      }
    ]
  }
}
```

## Known Issues & Solutions

### CMS White Page (Script Loading Failures)

**Cause:** Stale chunk hashes after deployment
**Solution:** 
1. Clear browser cache (Ctrl+Shift+R)
2. If persists, redeploy on Dokploy

### Seed Endpoint Returns "Action Forbidden"

**Cause:** Seed endpoint checks for admin authentication
**Solution:** 
1. Log into `/admin` first
2. Then navigate to `/next/seed` in same browser
3. Or create content manually in Admin

### Preview Says "Not Allowed"

**Cause:** Preview URL points to external Cloudflare domain
**Solution:** Configure `NEXT_PUBLIC_SERVER_URL` in Payload config to use CMS domain

## Environment Variables

### Dokploy (CMS)
```env
DATABASE_URI=mongodb://...
PAYLOAD_SECRET=your-secret-key
NEXT_PUBLIC_SERVER_URL=https://cms.wlf.com.mx
CLOUDFLARE_DEPLOY_HOOK_URL=https://api.cloudflare.com/...
```

### Cloudflare Pages (Frontend)
```env
CMS_URL=https://cms.wlf.com.mx
NODE_VERSION=20
```

## Git Tags (Rollback Points)

| Tag | Description |
|-----|-------------|
| `v1.0.0-before-splithead` | Working monolith before changes |
| `v1.1.0-monorepo-created` | Monorepo structure created |
| `v1.2.0-splithead-working` | Minimal proof of concept |
| `v1.3.0-full-template` | Full template with all components |

## Future Development Guidelines

### Adding New Components

1. Create component in `apps/web/src/components/`
2. Use REST API for any data fetching
3. Never import from `payload` package
4. Use `@/payload-types` for type imports

### Adding New Blocks

1. **CMS side** (`src/blocks/`): Config + Component
2. **Frontend side** (`apps/web/src/blocks/`): Component only
3. Update `RenderBlocks.tsx` in both locations

### Sharing Styles

Styles are currently duplicated. Options:
1. **packages/ui**: Shared shadcn/ui components
2. **packages/styles**: Shared Tailwind config
3. **CSS Variables**: Define in both `globals.css`

### Type Synchronization

After modifying collections:
```bash
pnpm generate:types  # Updates src/payload-types.ts
cp src/payload-types.ts packages/types/generated-types.ts
```
