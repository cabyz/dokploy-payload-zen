# 🧪 QA Checklist - Session 2026-01-30

## Quick Verification Commands

```bash
# 1. TypeScript compiles
pnpm exec tsc --noEmit

# 2. Build CMS
pnpm build

# 3. Build all (Turbo)
pnpm build:all

# 4. Check package exports
node -e "console.log(Object.keys(require('./packages/ui/package.json').exports))"
```

## Component Checklist

### @wlf/ui Package

| Component | File Exists | Exports | Import Test |
|-----------|-------------|---------|-------------|
| SmoothScrollProvider | ✅ | ✅ | `import {} from '@wlf/ui/smooth-scroll'` |
| ScrollReveal | ✅ | ✅ | `import {} from '@wlf/ui/scroll-reveal'` |
| SovereignSection | ✅ | ✅ | `import {} from '@wlf/ui/section'` |
| Button | ✅ | ✅ | `import {} from '@wlf/ui/button'` |
| Card | ✅ | ✅ | `import {} from '@wlf/ui/card'` |
| Surface | ✅ | ✅ | `import {} from '@wlf/ui/surface'` |
| ZenGrid/ZenItem | ✅ | ✅ | `import {} from '@wlf/ui/zen-grid'` |
| DynamicIsland | ✅ | ✅ | `import {} from '@wlf/ui/dynamic-island'` |
| Spotlight | ✅ | ✅ | `import {} from '@wlf/ui/spotlight'` |
| Motion | ✅ | ✅ | `import {} from '@wlf/ui/motion'` |
| Analytics | ✅ | ✅ | `import {} from '@wlf/ui/analytics'` |
| TrackedComponents | ✅ | ✅ | `import {} from '@wlf/ui/analytics/tracked'` |

### Server-Side Analytics

| Function | Location | Status |
|----------|----------|--------|
| serverAnalytics | src/lib/analytics.ts | ✅ |
| trackServerEvent | src/lib/analytics.ts | ✅ |
| trackLeadConversion | src/lib/analytics.ts | ✅ |
| sendToMetaCAPI | src/lib/analytics.ts | ✅ |

### Design Tokens

| File | Status |
|------|--------|
| packages/design-tokens/tokens.json | ✅ |
| packages/design-tokens/src/base.css | ✅ |
| packages/design-tokens/src/index.ts | ✅ |

## Integration Tests (Manual)

### Test 1: Analytics Initialization
```tsx
// In apps/web/src/app/layout.tsx or frontend layout
import { initAnalytics, trackPageView } from '@wlf/ui/analytics'

useEffect(() => {
  initAnalytics()
}, [])

useEffect(() => {
  trackPageView()
}, [pathname])
```

### Test 2: Tracked Form
```tsx
import { TrackedForm, TrackedInput, TrackedButton } from '@wlf/ui/analytics/tracked'

<TrackedForm trackName="test_form" formId="qa-test">
  <TrackedInput trackName="email" formId="qa-test" placeholder="Email" />
  <TrackedButton trackName="submit">Submit</TrackedButton>
</TrackedForm>
```

### Test 3: Motion Variants
```tsx
import { EASING, VARIANTS, transition } from '@wlf/ui/motion'

<motion.div
  initial="hidden"
  animate="visible"
  variants={VARIANTS.heroObject}
>
  Hero content
</motion.div>
```

### Test 4: ZenGrid Layout
```tsx
import { ZenGrid, ZenItem } from '@wlf/ui/zen-grid'

<ZenGrid cols={3} gap="md">
  <ZenItem colSpan={2} elevation="glass">Wide</ZenItem>
  <ZenItem elevation="raised">Narrow</ZenItem>
</ZenGrid>
```

## Dokploy Deployment Verification

After push to main:
1. SSH to Dokploy: `ssh root@143.198.49.232`
2. Check service: `docker service ls | grep payload`
3. Check logs: `docker service logs payload-cms-uk3xw9 --tail 20`
4. Verify UI: `curl -s https://cms.wlf.com.mx/admin | head -20`

## Known Issues (Non-Blocking)

1. **Peer dependency warnings**: lucide-react and react-hook-form expect React 18, we have React 19. Works fine.
2. **CSS lint warnings**: @theme and @apply are Tailwind v4 directives, IDE doesn't recognize them.
3. **Build time**: Still ~6 mins on Dokploy (see optimization notes below).

## PostHog Setup Required

For analytics to work in production, add these env vars:
```
NEXT_PUBLIC_POSTHOG_KEY=phc_xxx
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```
