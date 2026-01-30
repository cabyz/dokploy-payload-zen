# 🔬 Technology & Dependency Gap Analysis

**Research Date:** 2026-01-30  
**Comparing:** zen-test (Series A clonar.ai) vs dokploy-hosted-fixed (WLF)

---

## 📊 Executive Summary

| Category | zen-test | WLF Current | Priority |
|----------|----------|-------------|----------|
| **Analytics** | PostHog (client + server) | None | 🔴 P0 |
| **Tracked Components** | TrackedButton/Link/Input | None | 🔴 P0 |
| **Auth** | Clerk | None | 🟡 P2 |
| **CMS** | Keystatic (Git-based) | Payload CMS | ✅ Better |
| **OG Images** | Satori + Resvg | None | 🟡 P2 |
| **Radix Completeness** | 16 primitives | 4 primitives | 🟡 P1 |
| **Tailwind Version** | v4 | v3 | 🟢 P3 |

---

## 🔴 URGENT: Missing Conversion Infrastructure

### 1. PostHog Analytics (Zero-Drop Tracking)

**What zen-test has:**
```typescript
// Client-side: posthog-js
import posthog from 'posthog-js'
posthog.init(KEY, {
  autocapture: true,
  capture_performance: true,
  session_recording: { maskAllInputs: false, recordCanvas: true }
})

// Server-side: posthog-node
import { PostHog } from 'posthog-node'
const analytics = new PostHog(KEY, { host })
analytics.capture({ distinctId, event, properties })
```

**Why it matters:**
- Session recordings = see exactly where users drop off
- Autocapture = track every click without code
- Form tracking = know which fields cause abandonment
- Funnels = build visual conversion funnels

**WLF Action:** Add `posthog-js` to frontend, `posthog-node` to CMS

---

### 2. Tracked Conversion Components (Found in zen-test)

```typescript
// packages/ui/src/analytics.tsx SRC_AVAILABLE

TrackedButton - Auto-reports clicks to PostHog
TrackedLink - Tracks link destinations  
TrackedInput - Monitors focus/blur for form drop-off
```

**Why it matters:**
- Zero-code tracking on conversion elements
- Hiring funnels: know which fields cause drop-offs
- Form funnels: optimize field order based on data

**WLF Action:** Port `@wlf/ui/analytics` with tracked components

---

## 📋 Dependency Diff (zen-test has, WLF doesn't)

### High-Priority (Conversion/Growth)

| Package | Purpose | Port? |
|---------|---------|-------|
| `posthog-js` ^1.160.0 | Client analytics | ✅ YES |
| `posthog-node` | Server analytics | ✅ YES |
| `satori` ^0.18.3 | Dynamic OG images | 🟡 Later |
| `@resvg/resvg-js` | SVG→PNG for OG | 🟡 Later |

### Medium-Priority (UI Completeness)

| Package | Purpose | Port? |
|---------|---------|-------|
| `@radix-ui/react-accordion` | FAQ sections | ✅ YES |
| `@radix-ui/react-dialog` | Modals | ✅ YES |
| `@radix-ui/react-tabs` | Tab layouts | ✅ YES |
| `@radix-ui/react-tooltip` | Help tooltips | ✅ YES |
| `@radix-ui/react-popover` | Floating panels | 🟡 Maybe |
| `@radix-ui/react-dropdown-menu` | Menus | 🟡 Maybe |
| `@radix-ui/react-switch` | Toggle switches | 🟡 Maybe |
| `@radix-ui/react-avatar` | User avatars | ❌ No |
| `@radix-ui/react-collapsible` | Expandable | ❌ No |
| `@radix-ui/react-radio-group` | Radio inputs | ❌ No |
| `@radix-ui/react-scroll-area` | Custom scrollbars | ❌ No |
| `@radix-ui/react-separator` | Visual dividers | ❌ No |

### Low-Priority (Other)

| Package | Purpose | Port? |
|---------|---------|-------|
| `@clerk/react-router` | Auth | ❌ Skip (use Payload auth) |
| `@keystatic/core` | Git CMS | ❌ Skip (have Payload) |
| `isbot` | Bot detection | 🟡 Maybe |
| `tw-animate-css` | Extra animations | ❌ Skip |

---

## 🎯 Conversion Components Priority List

Based on funnel_implementation_patterns.md, these blocks are critical:

### Must-Have for Hiring Funnels

| Block | Description | Status |
|-------|-------------|--------|
| **FormBlock** | Multi-field form with validation | ❌ Need |
| **FAQAccordion** | Common questions | ❌ Need |
| **TestimonialGrid** | Social proof | ❌ Need |
| **TeamGrid** | Show who they'd work with | ❌ Need |
| **ProgressSteps** | Show funnel progress (Step 1/3) | ❌ Need |

### Must-Have for Sales Funnels

| Block | Description | Status |
|-------|-------------|--------|
| **PricingTable** | Compare plans | ❌ Need |
| **ComparisonTable** | Us vs Them | ❌ Need |
| **CountdownTimer** | Urgency/scarcity | ❌ Need |
| **StickyOptIn** | Fixed bottom CTA | ❌ Need |
| **ExitModal** | Intent-based popup | ❌ Need |

---

## 🧠 Server-Side Tracking Architecture (Meta CAPI)

For maximum conversion tracking accuracy, implement this pattern:

```
┌──────────────────┐     ┌──────────────────┐
│  Frontend        │────▶│  PostHog Cloud   │
│  (posthog-js)    │     │  (Client Events) │
└──────────────────┘     └────────┬─────────┘
         │                        │
         │ Form Submit            │ Real-time sync
         ▼                        ▼
┌──────────────────┐     ┌──────────────────┐
│  CMS API         │────▶│  Meta CAPI       │
│  (afterChange)   │     │  (Server Events) │
└──────────────────┘     └──────────────────┘
```

### Implementation Pattern (Future)

```typescript
// src/collections/Leads.ts - afterChange hook
afterChange: async ({ doc, operation }) => {
  if (operation === 'create') {
    // 1. Track in PostHog (server-side)
    await analytics.capture({
      distinctId: doc.email,
      event: 'lead_created',
      properties: { source: doc.source }
    })
    
    // 2. Send to Meta CAPI (first-party server-side)
    await fetch('https://graph.facebook.com/v18.0/PIXEL_ID/events', {
      method: 'POST',
      body: JSON.stringify({
        data: [{
          event_name: 'Lead',
          event_time: Math.floor(Date.now() / 1000),
          user_data: { em: hashEmail(doc.email) },
          custom_data: { source: doc.source }
        }]
      })
    })
  }
}
```

**Why Server-Side:**
- iOS 14.5+ blocks client-side pixels
- Ad blockers don't affect server events
- 100% event delivery (no dropped pixels)
- Pass Event Match Quality tests

---

## 🧪 A/B Testing on Static Pages (PostHog)

**Yes, it's possible!** PostHog supports client-side experiments on static pages:

```typescript
// On static Cloudflare page
import posthog from 'posthog-js'

// Check feature flag
if (posthog.getFeatureFlag('hero-variant') === 'control') {
  // Show default hero
} else {
  // Show variant hero
}
```

**How it works:**
1. PostHog JS loads and checks user's assigned variant
2. Stores assignment in localStorage (persists)
3. Renders appropriate variant client-side
4. Tracks conversion events by variant

**Best for:**
- Hero copy testing
- CTA button color/text
- Pricing page layouts
- Form designs

**NOT best for SEO-critical content** (renders client-side)

---

## 📦 Immediate Port List

### Batch 1: Analytics Foundation (15 min)

```bash
# Add to @wlf/ui
pnpm --filter @wlf/ui add posthog-js

# Add to root CMS (for server-side)
pnpm add posthog-node
```

Files to create:
1. `packages/ui/src/analytics/index.ts` - Client init + helpers
2. `packages/ui/src/analytics/TrackedButton.tsx`
3. `packages/ui/src/analytics/TrackedLink.tsx`
4. `packages/ui/src/analytics/TrackedInput.tsx`
5. `src/lib/analytics.ts` - Server-side PostHog

### Batch 2: Radix Primitives (10 min)

```bash
# Add to @wlf/ui
pnpm --filter @wlf/ui add @radix-ui/react-accordion @radix-ui/react-dialog @radix-ui/react-tabs @radix-ui/react-tooltip
```

Files to create:
1. `packages/ui/src/components/Accordion.tsx`
2. `packages/ui/src/components/Dialog.tsx`
3. `packages/ui/src/components/Tabs.tsx`
4. `packages/ui/src/components/Tooltip.tsx`

### Batch 3: Conversion Blocks (30 min)

```bash
# In CMS
mkdir -p src/blocks/FAQ src/blocks/Testimonials src/blocks/Pricing
```

Files to create:
1. `src/blocks/FAQ/config.ts` + `Component.tsx`
2. `src/blocks/Testimonials/config.ts` + `Component.tsx`
3. `src/blocks/Pricing/config.ts` + `Component.tsx`
4. `src/blocks/FormBlock/config.ts` + `Component.tsx`

---

## 📈 Funnel Optimization Priority

Based on your stated needs:

| Priority | Funnel Type | Blocks Needed |
|----------|-------------|---------------|
| **P0** | Hiring Funnel | FormBlock, FAQ, TeamGrid, ProgressSteps |
| **P0** | Lead Gen | FormBlock, StickyOptIn, Testimonials |
| **P1** | Sales | Pricing, Comparison, Countdown, ExitModal |
| **P2** | Content | Blog, Portfolio, CaseStudy |

---

## ✅ Next Steps (SCRUM Order)

1. **STORY-014: Port Analytics System** (3 pts) - PostHog client+server
2. **STORY-015: Port Tracked Components** (2 pts) - TrackedButton/Link/Input
3. **STORY-016: Add Radix Primitives** (3 pts) - Accordion, Dialog, Tabs, Tooltip
4. **STORY-017: FormBlock with Validation** (5 pts) - react-hook-form + Zod
5. **STORY-018: FAQ Accordion Block** (2 pts) - With schema
6. **STORY-019: Testimonials Block** (3 pts) - Grid + carousel variants
7. **STORY-020: Pricing Block** (3 pts) - With comparison variant

**Total: 21 pts (~4 hours focused work)**
