# PayloadCMS Modular Funnel Builder - Development Specification

> **Version:** 1.0.0  
> **Target:** dokploy-payload-zen (v1.4.0-whitescreenfix)  
> **Architecture:** Split-Head Monorepo (CMS on Dokploy, Frontend on Cloudflare Pages)

---

## 🎯 Project Objective

Build a **ClickFunnels/GHL-style modular funnel builder** using PayloadCMS v3 with a tokenized, component-based design system. The system should enable non-technical users to create multi-step conversion funnels by composing pre-built blocks.

---

## 📦 Existing Assets to Leverage

### From `sovereign-cms` (Rich Deck System):
```
/blocks/Decks/
├── HeroSlide.ts          # Hero with logo, headline, CTA
├── PricingSlide.ts       # Pricing tiers with features
├── ComparisonSlide.ts    # Side-by-side comparison
├── InsightSlide.ts       # Stats and insights
├── GuaranteeSlide.ts     # Trust indicators
├── TeamSlide.ts          # Team members
├── TableSlide.ts         # Financial/data tables
└── EcosystemSlide.ts     # Hub-spoke visualizations
```

### From `wlf.com.mx-cms` (Forms + Pages):
```
/blocks/Form/config.ts    # Form block with rich text intro
/collections/Pages/       # Full page collection with draft/publish
/collections/Posts/       # Blog posts with categories
```

### Design System Pattern (Reusable Field):
```typescript
const BackgroundField: Field = {
  name: 'background',
  type: 'group',
  fields: [
    { name: 'type', type: 'select', options: ['color', 'gradient', 'image'] },
    { name: 'color', type: 'text', condition: type === 'color' },
    { name: 'gradientFrom', type: 'text', condition: type === 'gradient' },
    { name: 'gradientTo', type: 'text', condition: type === 'gradient' },
    { name: 'image', type: 'upload', relationTo: 'media', condition: type === 'image' },
  ],
}
```

---

## 🏗️ Architecture Requirements

### Collections to Create

| Collection | Purpose | Priority |
|------------|---------|----------|
| **Funnels** | Multi-step conversion flows (like ClickFunnels) | 🔴 High |
| **FunnelSteps** | Individual pages within a funnel | 🔴 High |
| **Forms** | Already exists via `@payloadcms/plugin-form-builder` | ✅ Exists |
| **Services** | Location-based service pages (e.g., "/plomero-en-monterrey") | 🟡 Medium |
| **Jobs** | Job listings (optionally sync to ERPNext) | 🟢 Low |

### Blocks to Create

#### Conversion Blocks (High Priority)
| Block | Purpose | Fields |
|-------|---------|--------|
| `HeroSection` | Above-fold attention grabber | headline, subheadline, cta, backgroundImage |
| `LeadCaptureForm` | Email/phone capture | form (relationship), introText, thankYouMessage |
| `TestimonialCarousel` | Social proof | testimonials[], autoPlay, theme |
| `PricingTable` | ✅ Already exists! | Extend with: ctaUrl, highlightedPlan |
| `FaqAccordion` | Objection handling | faqs[], showAll |
| `GuaranteeCard` | Risk reversal | title, points[], icon |
| `CountdownTimer` | Urgency creation | endDate, expiredMessage |
| `VideoEmbed` | VSL/explainer | url, autoPlay, thumbnail |

#### Funnel-Specific Blocks
| Block | Purpose | Fields |
|-------|---------|--------|
| `StepProgress` | Shows funnel progress | currentStep, totalSteps, labels[] |
| `OrderBump` | Upsell checkbox | product, discountPercent, description |
| `OrderSummary` | Cart/checkout summary | showItems, showTotal, taxRate |
| `ExitIntent` | Modal on exit | headline, offer, ctaLabel |

#### Location/Service Blocks
| Block | Purpose | Fields |
|-------|---------|--------|
| `LocalHero` | "Plomero en {city}" | citySlug, serviceSlug, headline, ctaPhone |
| `AreaMap` | Google Maps embed | coordinates, zoom, markers[] |
| `LocalTestimonials` | City-specific reviews | city (relationship), testimonials[] |

---

## 🔄 Funnel Collection Schema

```typescript
// collections/Funnels.ts
export const Funnels: CollectionConfig = {
  slug: 'funnels',
  admin: {
    useAsTitle: 'name',
    group: 'Marketing',
    preview: (doc) => `/funnel/${doc.slug}?preview=true`,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'status', type: 'select', options: ['draft', 'live', 'archived'] },
    { 
      name: 'steps', 
      type: 'relationship', 
      relationTo: 'funnel-steps',
      hasMany: true,
      admin: { description: 'Ordered list of funnel pages' }
    },
    { name: 'conversionGoal', type: 'select', options: ['lead', 'sale', 'booking'] },
    { 
      name: 'tracking', 
      type: 'group',
      fields: [
        { name: 'facebookPixel', type: 'text' },
        { name: 'googleAnalytics', type: 'text' },
        { name: 'customScript', type: 'code', admin: { language: 'javascript' } },
      ]
    },
  ],
}
```

```typescript
// collections/FunnelSteps.ts
export const FunnelSteps: CollectionConfig = {
  slug: 'funnel-steps',
  admin: {
    useAsTitle: 'title',
    group: 'Marketing',
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true },
    { name: 'stepType', type: 'select', options: ['optin', 'sales', 'checkout', 'upsell', 'thankyou'] },
    {
      name: 'layout',
      type: 'blocks',
      blocks: [
        HeroSection,
        LeadCaptureForm,
        PricingTable,
        VideoEmbed,
        TestimonialCarousel,
        FaqAccordion,
        GuaranteeCard,
        CountdownTimer,
        StepProgress,
        OrderBump,
        OrderSummary,
      ],
    },
    { name: 'nextStep', type: 'relationship', relationTo: 'funnel-steps' },
    { name: 'skipCondition', type: 'code', admin: { language: 'javascript' } },
  ],
}
```

---

## 🎨 Design System Tokens

All blocks should use these reusable field groups:

```typescript
// fields/designTokens.ts

export const SpacingField: Field = {
  name: 'spacing',
  type: 'select',
  options: ['none', 'sm', 'md', 'lg', 'xl'],
  defaultValue: 'md',
}

export const BackgroundField: Field = {
  name: 'background',
  type: 'group',
  fields: [
    { name: 'type', type: 'select', options: ['transparent', 'color', 'gradient', 'image'] },
    { name: 'color', type: 'text', admin: { condition: (_, s) => s?.type === 'color' } },
    { name: 'gradientFrom', type: 'text', admin: { condition: (_, s) => s?.type === 'gradient' } },
    { name: 'gradientTo', type: 'text', admin: { condition: (_, s) => s?.type === 'gradient' } },
    { name: 'image', type: 'upload', relationTo: 'media', admin: { condition: (_, s) => s?.type === 'image' } },
  ],
}

export const CtaField: Field = {
  name: 'cta',
  type: 'group',
  fields: [
    { name: 'label', type: 'text', defaultValue: 'Get Started' },
    { name: 'url', type: 'text' },
    { name: 'style', type: 'select', options: ['primary', 'secondary', 'outline', 'ghost'] },
    { name: 'size', type: 'select', options: ['sm', 'md', 'lg'] },
    { name: 'icon', type: 'text', admin: { description: 'Lucide icon name' } },
  ],
}
```

---

## 🔌 ERPNext Integration (Jobs - Optional)

If connecting to ERPNext for job listings:

```typescript
// collections/Jobs.ts
export const Jobs: CollectionConfig = {
  slug: 'jobs',
  admin: {
    group: 'HR',
  },
  hooks: {
    afterChange: [
      async ({ doc, operation }) => {
        if (operation === 'create' || operation === 'update') {
          // Sync to ERPNext Job Opening
          await syncToERPNext('Job Opening', {
            job_title: doc.title,
            description: doc.description,
            designation: doc.designation,
            status: doc.status === 'published' ? 'Open' : 'Closed',
          })
        }
      }
    ]
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true },
    { name: 'designation', type: 'text' },
    { name: 'department', type: 'select', options: ['Engineering', 'Sales', 'Marketing', 'Operations'] },
    { name: 'location', type: 'text' },
    { name: 'type', type: 'select', options: ['full-time', 'part-time', 'contract'] },
    { name: 'description', type: 'richText' },
    { name: 'requirements', type: 'richText' },
    { name: 'applicationForm', type: 'relationship', relationTo: 'forms' },
    { name: 'erpnextId', type: 'text', admin: { readOnly: true } },
  ],
}
```

---

## 🌍 Location-Based Services (SEO Pages)

For creating pages like `/plomero-en-monterrey`:

```typescript
// collections/Services.ts
export const Services: CollectionConfig = {
  slug: 'services',
  fields: [
    { name: 'name', type: 'text', required: true }, // "Plomería"
    { name: 'slug', type: 'text', required: true }, // "plomero"
    { name: 'description', type: 'richText' },
    { name: 'icon', type: 'text' },
    { 
      name: 'locations', 
      type: 'relationship', 
      relationTo: 'locations',
      hasMany: true,
    },
  ],
}

// collections/Locations.ts  
export const Locations: CollectionConfig = {
  slug: 'locations',
  fields: [
    { name: 'city', type: 'text', required: true }, // "Monterrey"
    { name: 'slug', type: 'text', required: true }, // "monterrey"
    { name: 'state', type: 'text' },
    { name: 'country', type: 'text', defaultValue: 'Mexico' },
    { name: 'coordinates', type: 'point' },
    { name: 'phoneNumber', type: 'text' },
    { name: 'address', type: 'textarea' },
  ],
}

// collections/ServicePages.ts (Generated SEO Pages)
export const ServicePages: CollectionConfig = {
  slug: 'service-pages',
  admin: {
    useAsTitle: 'title',
    group: 'SEO',
  },
  fields: [
    { name: 'title', type: 'text' }, // "Plomero en Monterrey"
    { name: 'slug', type: 'text' }, // "plomero-en-monterrey"
    { name: 'service', type: 'relationship', relationTo: 'services' },
    { name: 'location', type: 'relationship', relationTo: 'locations' },
    { name: 'metaDescription', type: 'textarea' },
    {
      name: 'layout',
      type: 'blocks',
      blocks: [LocalHero, LocalTestimonials, AreaMap, Pricing, LeadCaptureForm],
    },
  ],
}
```

---

## 📋 Implementation Priority

### Phase 1: Core Funnel Infrastructure (Week 1)
1. [ ] Create `Funnels` and `FunnelSteps` collections
2. [ ] Create conversion blocks: `HeroSection`, `LeadCaptureForm`, `VideoEmbed`
3. [ ] Create design token fields (`BackgroundField`, `CtaField`, `SpacingField`)
4. [ ] Wire up to existing Pages collection as an alternative layout

### Phase 2: Conversion Elements (Week 2)
1. [ ] Create `TestimonialCarousel`, `FaqAccordion`, `GuaranteeCard`
2. [ ] Create `CountdownTimer`, `StepProgress`
3. [ ] Extend `PricingTable` with CTA links
4. [ ] Add exit-intent modal block

### Phase 3: Location SEO (Week 3)
1. [ ] Create `Services`, `Locations`, `ServicePages` collections
2. [ ] Create `LocalHero`, `AreaMap`, `LocalTestimonials` blocks
3. [ ] Auto-generate slugs like `/plomero-en-monterrey`

### Phase 4: Blog & Jobs (Week 4)
1. [ ] Extend Posts collection with author, categories, tags
2. [ ] Create Jobs collection with ERPNext sync hook
3. [ ] Add application form relationship

---

## 🚀 Getting Started Command

```bash
# Create new block
touch src/blocks/HeroSection/config.ts
touch src/blocks/HeroSection/Component.tsx

# Generate types after adding block
pnpm generate:types

# Add to RenderBlocks.tsx
```

---

## 📝 Block Template

```typescript
// src/blocks/HeroSection/config.ts
import type { Block } from 'payload'
import { BackgroundField, CtaField } from '@/fields/designTokens'

export const HeroSection: Block = {
  slug: 'heroSection',
  interfaceName: 'HeroSectionBlock',
  labels: {
    singular: 'Hero Section',
    plural: 'Hero Sections',
  },
  fields: [
    { name: 'headline', type: 'text', required: true },
    { name: 'subheadline', type: 'text' },
    { name: 'media', type: 'upload', relationTo: 'media' },
    CtaField,
    BackgroundField,
  ],
}
```

---

## 🎯 Success Criteria

1. **Non-technical users** can create funnels by drag-and-drop blocks
2. **All blocks** use consistent design tokens (spacing, colors, CTAs)
3. **Funnels** track conversions via pixel/analytics integration
4. **Location pages** auto-generate SEO-optimized URLs
5. **Jobs** optionally sync bidirectionally with ERPNext

---

*Generated from analysis of cabyz/sovereign-cms, cabyz/wlf.com.mx-cms, and cabyz/wlf-payload repositories.*
