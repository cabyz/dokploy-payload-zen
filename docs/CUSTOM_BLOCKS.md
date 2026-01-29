# WLF Custom Block & Component Development

## The Safe Pattern for Creating New Blocks

Every block has TWO parts:
1. **Config** (CMS only): `src/blocks/[BlockName]/config.ts`
2. **Component** (Both CMS & Frontend): 
   - `src/blocks/[BlockName]/Component.tsx`
   - `apps/web/src/blocks/[BlockName]/Component.tsx`

---

## Example: Creating a "Pricing" Block

### Step 1: Create Config (src/blocks/Pricing/config.ts)

```typescript
import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const PricingBlock: Block = {
  slug: 'pricing',
  interfaceName: 'PricingBlock',
  labels: {
    singular: 'Pricing Section',
    plural: 'Pricing Sections',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'Our Pricing',
    },
    {
      name: 'subtitle',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          HeadingFeature({ enabledHeadingSizes: ['h2', 'h3'] }),
          FixedToolbarFeature(),
          InlineToolbarFeature(),
        ],
      }),
    },
    {
      name: 'plans',
      type: 'array',
      minRows: 1,
      maxRows: 4,
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'price',
          type: 'number',
          required: true,
        },
        {
          name: 'period',
          type: 'select',
          options: [
            { label: 'Monthly', value: 'monthly' },
            { label: 'Yearly', value: 'yearly' },
            { label: 'One-time', value: 'onetime' },
          ],
          defaultValue: 'monthly',
        },
        {
          name: 'features',
          type: 'array',
          fields: [
            {
              name: 'feature',
              type: 'text',
            },
          ],
        },
        {
          name: 'cta',
          type: 'group',
          fields: [
            {
              name: 'label',
              type: 'text',
              defaultValue: 'Get Started',
            },
            {
              name: 'url',
              type: 'text',
            },
          ],
        },
        {
          name: 'highlighted',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Highlight this plan as "Popular"',
          },
        },
      ],
    },
  ],
}
```

### Step 2: Create Component (src/blocks/Pricing/Component.tsx)

```tsx
import React from 'react'
import type { PricingBlock as PricingBlockProps } from '@/payload-types'
import RichText from '@/components/RichText'
import { cn } from '@/utilities/ui'

export const PricingBlockComponent: React.FC<PricingBlockProps> = ({
  title,
  subtitle,
  plans,
}) => {
  return (
    <section className="py-24 container">
      <div className="text-center mb-16">
        {title && <h2 className="text-4xl font-bold mb-4">{title}</h2>}
        {subtitle && <RichText data={subtitle} enableGutter={false} />}
      </div>
      
      <div className={cn(
        'grid gap-8',
        plans?.length === 1 && 'max-w-md mx-auto',
        plans?.length === 2 && 'md:grid-cols-2 max-w-3xl mx-auto',
        plans?.length === 3 && 'md:grid-cols-3',
        plans?.length === 4 && 'md:grid-cols-2 lg:grid-cols-4',
      )}>
        {plans?.map((plan, i) => (
          <div
            key={i}
            className={cn(
              'rounded-2xl p-8 border transition-all',
              plan.highlighted
                ? 'bg-primary text-primary-foreground border-primary scale-105'
                : 'bg-card border-border hover:border-primary/50'
            )}
          >
            {plan.highlighted && (
              <span className="text-xs font-semibold uppercase tracking-wider mb-4 block">
                Most Popular
              </span>
            )}
            
            <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
            
            <div className="mb-6">
              <span className="text-5xl font-bold">${plan.price}</span>
              <span className="text-muted-foreground">
                {plan.period === 'monthly' && '/mo'}
                {plan.period === 'yearly' && '/yr'}
              </span>
            </div>
            
            <ul className="space-y-3 mb-8">
              {plan.features?.map((f, j) => (
                <li key={j} className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  {f.feature}
                </li>
              ))}
            </ul>
            
            {plan.cta?.url && (
              <a
                href={plan.cta.url}
                className={cn(
                  'block text-center py-3 px-6 rounded-lg font-semibold transition-all',
                  plan.highlighted
                    ? 'bg-white text-primary hover:bg-gray-100'
                    : 'bg-primary text-primary-foreground hover:bg-primary/90'
                )}
              >
                {plan.cta.label}
              </a>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
```

### Step 3: Register in Pages Collection

```typescript
// src/collections/Pages/index.ts
import { PricingBlock } from '../../blocks/Pricing/config'

// Add to blocks array:
blocks: [CallToAction, Content, MediaBlock, Archive, FormBlock, PricingBlock],
```

### Step 4: Register in RenderBlocks (CMS)

```typescript
// src/blocks/RenderBlocks.tsx
import { PricingBlockComponent } from './Pricing/Component'

const blockComponents = {
  // ... existing
  pricing: PricingBlockComponent,
}
```

### Step 5: Copy Component to Frontend & Register

```bash
# Copy the component
cp -r src/blocks/Pricing apps/web/src/blocks/
rm apps/web/src/blocks/Pricing/config.ts  # Remove config from frontend
```

```typescript
// apps/web/src/blocks/RenderBlocks.tsx
import { PricingBlockComponent } from './Pricing/Component'

const blockComponents = {
  // ... existing
  pricing: PricingBlockComponent,
}
```

### Step 6: Generate Types

```bash
pnpm generate:types
cp src/payload-types.ts packages/types/generated-types.ts
```

---

## Ready-to-Use Block Templates

### Hero Section Block

```typescript
// src/blocks/HeroSection/config.ts
export const HeroSection: Block = {
  slug: 'heroSection',
  interfaceName: 'HeroSectionBlock',
  fields: [
    { name: 'headline', type: 'text', required: true },
    { name: 'subheadline', type: 'textarea' },
    { name: 'backgroundImage', type: 'upload', relationTo: 'media' },
    { name: 'ctaButton', type: 'group', fields: [
      { name: 'label', type: 'text' },
      { name: 'url', type: 'text' },
    ]},
    { name: 'alignment', type: 'select', options: ['left', 'center', 'right'], defaultValue: 'center' },
  ],
}
```

### Features Grid Block

```typescript
// src/blocks/FeaturesGrid/config.ts
export const FeaturesGrid: Block = {
  slug: 'featuresGrid',
  interfaceName: 'FeaturesGridBlock',
  fields: [
    { name: 'title', type: 'text' },
    { name: 'features', type: 'array', fields: [
      { name: 'icon', type: 'select', options: ['star', 'shield', 'zap', 'heart', 'check'] },
      { name: 'title', type: 'text', required: true },
      { name: 'description', type: 'textarea' },
    ]},
    { name: 'columns', type: 'select', options: ['2', '3', '4'], defaultValue: '3' },
  ],
}
```

### Testimonials Block

```typescript
// src/blocks/Testimonials/config.ts
export const Testimonials: Block = {
  slug: 'testimonials',
  interfaceName: 'TestimonialsBlock',
  fields: [
    { name: 'title', type: 'text', defaultValue: 'What Our Customers Say' },
    { name: 'testimonials', type: 'array', fields: [
      { name: 'quote', type: 'textarea', required: true },
      { name: 'author', type: 'text', required: true },
      { name: 'role', type: 'text' },
      { name: 'avatar', type: 'upload', relationTo: 'media' },
      { name: 'rating', type: 'number', min: 1, max: 5 },
    ]},
    { name: 'style', type: 'select', options: ['cards', 'carousel', 'simple'], defaultValue: 'cards' },
  ],
}
```

### FAQ Block

```typescript
// src/blocks/FAQ/config.ts
export const FAQ: Block = {
  slug: 'faq',
  interfaceName: 'FAQBlock',
  fields: [
    { name: 'title', type: 'text', defaultValue: 'Frequently Asked Questions' },
    { name: 'items', type: 'array', fields: [
      { name: 'question', type: 'text', required: true },
      { name: 'answer', type: 'richText', editor: lexicalEditor() },
    ]},
    { name: 'style', type: 'select', options: ['accordion', 'grid'], defaultValue: 'accordion' },
  ],
}
```

---

## Creating Funnel Collections

### Lead Magnet / Signup Collection

```typescript
// src/collections/Leads.ts
import type { CollectionConfig } from 'payload'

export const Leads: CollectionConfig = {
  slug: 'leads',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'source', 'createdAt'],
  },
  fields: [
    { name: 'email', type: 'email', required: true },
    { name: 'name', type: 'text' },
    { name: 'phone', type: 'text' },
    { name: 'source', type: 'select', options: [
      { label: 'Landing Page', value: 'landing' },
      { label: 'Blog', value: 'blog' },
      { label: 'Referral', value: 'referral' },
    ]},
    { name: 'leadMagnet', type: 'text', admin: { description: 'Which free resource they signed up for' }},
    { name: 'status', type: 'select', defaultValue: 'new', options: [
      { label: 'New', value: 'new' },
      { label: 'Contacted', value: 'contacted' },
      { label: 'Qualified', value: 'qualified' },
      { label: 'Converted', value: 'converted' },
    ]},
    { name: 'notes', type: 'textarea' },
  ],
  timestamps: true,
}
```

### Products/Services Collection (for Funnels)

```typescript
// src/collections/Products.ts
export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'price', type: 'number', required: true },
    { name: 'comparePrice', type: 'number', admin: { description: 'Crossed-out original price' }},
    { name: 'description', type: 'richText' },
    { name: 'features', type: 'array', fields: [
      { name: 'feature', type: 'text' },
    ]},
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'ctaLabel', type: 'text', defaultValue: 'Buy Now' },
    { name: 'ctaUrl', type: 'text' },
    { name: 'category', type: 'relationship', relationTo: 'categories' },
  ],
}
```

---

## Design System Integration

### Tailwind CSS Variables (apps/web/src/app/globals.css)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 221.2 83.2% 53.3%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 222.2 47.4% 11.2%;
    /* ... rest of dark mode */
  }
}
```

### Using Custom Fonts

```css
/* apps/web/src/app/globals.css */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

body {
  font-family: 'Inter', var(--font-geist-sans), system-ui, sans-serif;
}
```

---

## Safe Development Workflow

### 1. ALWAYS generate types after modifying collections/blocks
```bash
pnpm generate:types
cp src/payload-types.ts packages/types/generated-types.ts
```

### 2. Test CMS build first
```bash
pnpm build  # This should pass
```

### 3. Then test frontend build
```bash
cd apps/web && pnpm build  # This should pass
```

### 4. Commit with meaningful messages
```bash
git add -A
git commit -m "feat: add Pricing block"
git push
```

### 5. Tag milestones
```bash
git tag -a v1.4.0-pricing-block -m "Added Pricing block"
git push --tags
```
