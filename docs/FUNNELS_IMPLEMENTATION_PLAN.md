# 🎯 Funnels Collection - Implementation Plan

**Date:** 2026-01-30  
**Risk Level:** MEDIUM-HIGH (New collection = Database schema change)  
**Checkpoint:** `checkpoint-stable-v1.2.0` (before this change)

---

## ⚠️ CRITICAL SAFETY PROTOCOLS

### Recovery Commands (Memorize These)
```bash
# If ANYTHING breaks after adding collection:
git checkout checkpoint-stable-v1.2.0 -- src/collections/
git checkout checkpoint-stable-v1.2.0 -- src/payload.config.ts

# Full rollback:
git reset --hard checkpoint-stable-v1.2.0
git push origin main --force  # Last resort
```

### What CAN Break
1. **MongoDB Schema Mismatch**: Adding a collection creates a new MongoDB collection
2. **Import Errors**: If any import path is wrong, the whole CMS crashes
3. **Type Generation**: Payload generates types - if schema is invalid, types break

### What WON'T Break (Safe Operations)
1. Adding new files that aren't imported yet
2. Creating block configs before registering them
3. Creating components before using them

---

## 🏗️ Architecture Decision: URL Pattern

### Options Analyzed

| Pattern | Pros | Cons | Examples |
|---------|------|------|----------|
| `/funnels/[slug]` | Clear internally | Reveals marketing intent | ClickFunnels, GHL |
| `/lp/[slug]` | Short, common | Looks "techy" | Many startups |
| `/go/[slug]` | Short, action-oriented | Looks "redirect-y" | link.bio style |
| **`/p/[slug]`** | Minimal, professional | Could conflict | Modern SaaS |
| **`/[slug]`** | Clean, no prefix | **BEST UX** | Apple, Stripe |

### RECOMMENDATION: Use the existing `Pages` collection

**Why NOT create a separate Funnels collection:**
1. **Database risk**: Zero new schema = zero risk
2. **Payload already supports this**: Pages can have different "templates"
3. **URL is clean**: `/victor` not `/funnels/victor`
4. **Same blocks work everywhere**: Hero, Pricing, Form blocks

**The "Funnel" is just a Page with:**
- A specific template/layout pattern
- Multi-step form blocks
- Conversion tracking enabled

---

## 📋 Recommended Approach: "Funnel Mode" on Pages

Instead of a new collection, add a **page type** field to Pages:

```typescript
// Add to src/collections/Pages/index.ts
{
  name: 'pageType',
  type: 'select',
  defaultValue: 'standard',
  options: [
    { label: 'Standard Page', value: 'standard' },
    { label: 'Landing Page (Funnel)', value: 'funnel' },
    { label: 'Blog Post Style', value: 'editorial' },
  ],
  admin: {
    position: 'sidebar',
    description: 'Affects available blocks and layout options',
  },
}
```

**Benefits:**
- ✅ No new MongoDB collection
- ✅ Clean URLs: `/victor`, `/pricing`, `/demo`
- ✅ Same SEO, same revalidation hooks
- ✅ Can filter in admin: "Show me all Funnel pages"

---

## 📝 If We MUST Have Separate Collection (Future)

If business logic requires true separation, here's the safe pattern:

### Collection Name: `Experiences`
**Why:** Generic, premium, doesn't reveal intent
**URL:** `/x/[slug]` or just use `Pages` redirect

```typescript
// src/collections/Experiences/index.ts
import type { CollectionConfig } from 'payload'

export const Experiences: CollectionConfig = {
  slug: 'experiences',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'conversion', 'updatedAt'],
    group: 'Marketing', // Separate admin group
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    {
      name: 'conversion',
      type: 'select',
      options: ['lead', 'booking', 'sale', 'application'],
      required: true,
    },
    {
      name: 'steps',
      type: 'array',
      fields: [
        { name: 'stepTitle', type: 'text', required: true },
        { name: 'layout', type: 'blocks', blocks: [...] },
      ],
    },
  ],
}
```

---

## 🧠 Smart Forms Architecture

For Typeform-style multi-step forms with real-time calculations:

### Option A: Form Builder Block (Recommended)

```typescript
// src/blocks/SmartForm/config.ts
export const SmartFormBlock: Block = {
  slug: 'smartForm',
  interfaceName: 'SmartFormBlock',
  fields: [
    {
      name: 'formType',
      type: 'select',
      options: [
        { label: 'Multi-Step (Typeform style)', value: 'multistep' },
        { label: 'Single Page', value: 'single' },
        { label: 'Calculator', value: 'calculator' },
      ],
    },
    {
      name: 'steps',
      type: 'array',
      admin: { condition: (_, s) => s?.formType === 'multistep' },
      fields: [
        { name: 'stepTitle', type: 'text' },
        { name: 'fields', type: 'blocks', blocks: [TextField, SelectField, NumberField] },
      ],
    },
    {
      name: 'calculatorConfig',
      type: 'group',
      admin: { condition: (_, s) => s?.formType === 'calculator' },
      fields: [
        { name: 'formula', type: 'code', language: 'javascript' },
        { name: 'outputLabel', type: 'text' },
      ],
    },
    { name: 'submitAction', type: 'select', options: ['store_lead', 'redirect', 'show_result'] },
    { name: 'redirectUrl', type: 'text', admin: { condition: (_, s) => s?.submitAction === 'redirect' } },
  ],
}
```

### Option B: External Form Tool + Embed

Simpler option: Use Notion/Typeform/Tally embed block, track conversions via webhooks.

---

## ✅ Immediate Next Steps (Safe Actions)

### Phase 1: Blocks Only (ZERO DB Risk)
1. Create `src/blocks/Hero/config.ts` + `Component.tsx`
2. Create `src/blocks/FAQ/config.ts` + `Component.tsx`
3. Create `src/blocks/SmartForm/config.ts` base structure
4. **Test build before registering blocks**

### Phase 2: Register Blocks in Pages (LOW Risk)
```typescript
// In Pages collection, add blocks to layout array
blocks: [...existingBlocks, HeroBlock, FAQBlock, SmartFormBlock]
```

### Phase 3: Add PageType Field (LOW Risk)
```typescript
// Add pageType select to Pages sidebar
```

### Phase 4: Create Leads Collection (MEDIUM Risk - New DB Collection)
```typescript
// Only after Phase 1-3 are stable and tested
```

---

## 🎨 Landing Page Design System

For the visual/design work (zero DB risk):

### Color Tokens Already Available
```css
/* packages/design-tokens/src/base.css */
--sovereign-bg: #09090b;
--sovereign-surface: #18181b;
--accent-primary: #8b5cf6;
--accent-secondary: #ec4899;
```

### Layout Components Ready
- `Surface` - Container with glass/gradient variants
- `ZenGrid` - Bento layouts
- `SovereignSection` - Consistent padding/spacing
- `Spotlight` - Hover glow effect
- `ScrollReveal` - Entrance animations

### What to Build for Landing Pages
1. **Hero variants**: Full-screen, split, video background
2. **Social proof bar**: Logos, testimonials
3. **Feature grid**: With icons and animations
4. **CTA sections**: Sticky, floating, inline

---

## 🚦 Go/No-Go Checklist

Before adding ANY collection:
- [ ] Current build passes (`pnpm build`)
- [ ] Checkpoint tag created
- [ ] Collection file created but NOT imported
- [ ] Build tested with collection imported
- [ ] Single test document created in admin
- [ ] Verify DB didn't break existing data
- [ ] Commit with clear message

**Current Status:** ✅ Ready to proceed with Phase 1 (Blocks Only)
