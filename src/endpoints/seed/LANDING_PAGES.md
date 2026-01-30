# Landing Page Seed Data

## Overview

This directory contains seed data for three landing page templates that demonstrate all the new landing page blocks (Hero, FeatureGrid, FAQ, Testimonials). These pages are automatically created when you run the seed script.

## Landing Page Templates

### 1. SaaS Template (`/demo-saas`)
- **Hero**: Centered variant with gradient overlay
- **Features**: Bento layout with 6 features (lg, md, sm sizes)
- **Testimonials**: Carousel variant with glass cards
- **FAQ**: Double column layout with 6 questions

### 2. Agency Template (`/demo-agency`)
- **Hero**: Split variant with solid overlay
- **Features**: Grid layout with 6 services
- **Testimonials**: Featured variant with outline cards
- **FAQ**: Single column layout with 5 questions

### 3. Consulting Template (`/demo-consulting`)
- **Hero**: Full bleed variant with gradient overlay
- **Features**: List layout with 4 practice areas
- **Testimonials**: Grid variant with solid cards
- **FAQ**: Double column layout with 6 questions

## Running the Seed

### Via Admin Dashboard
1. Go to `/admin`
2. Click the "Seed your database" button in the before-dashboard component

### Via API Endpoint
```bash
curl -X POST http://localhost:3000/api/seed
```

### Via CLI (Local Development)
```bash
pnpm seed
```

## Customizing Seed Data

Each landing page template is in its own file:
- `landing-saas.ts` - B2B SaaS product
- `landing-agency.ts` - Creative/digital agency
- `landing-consulting.ts` - Professional services/consulting

### Template Structure

```typescript
export const landingSaas: (args: LandingSaasArgs) => RequiredDataFromCollectionSlug<'pages'> = ({
  heroImage,
  metaImage,
}) => ({
  title: 'Page Title',
  slug: 'url-slug',
  _status: 'published',
  hero: { type: 'none' },  // Using our custom blocks instead
  layout: [
    // Hero Block
    { blockType: 'hero', ... },
    // Feature Grid
    { blockType: 'featureGrid', ... },
    // Testimonials
    { blockType: 'testimonials', ... },
    // FAQ
    { blockType: 'faq', ... },
  ],
  meta: { ... },
})
```

## Block Variants Quick Reference

### Hero Block
| Variant | Best For |
|---------|----------|
| `centered` | Product launches, SaaS |
| `split` | Agency, visual-focused |
| `fullBleed` | Enterprise, impactful |

### Feature Grid Block
| Layout | Columns | Best For |
|--------|---------|----------|
| `bento` | 2-4 | Mixed content sizes |
| `grid` | 2-4 | Uniform features |
| `list` | 1-2 | Detailed explanations |

### Testimonials Block
| Variant | Best For |
|---------|----------|
| `carousel` | Many testimonials |
| `grid` | 4-6 testimonials |
| `featured` | 1 hero + 2-3 supporting |

### FAQ Block
| Layout | Best For |
|--------|----------|
| `single` | Fewer, detailed FAQs |
| `double` | Many FAQs (6+) |

## For Other Agents

If another agent is helping export components to this project, tell them:

1. **File Location**: Export components to:
   - UI primitives → `/packages/ui/src/components/{ComponentName}.tsx`
   - Block components → `/src/blocks/{BlockName}/Component.tsx`

2. **Required Information**:
   - Full file content
   - List of npm dependencies
   - Any TypeScript types/interfaces
   - Usage example

3. **Quick Command**: 
   ```bash
   # After adding a new component, regenerate types
   pnpm generate:types
   
   # Verify build
   pnpm build
   ```
