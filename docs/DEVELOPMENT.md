# WLF Development Guide

## Quick Start

### Local Development

```bash
# Start CMS (with admin panel + preview)
pnpm dev  # Runs at http://localhost:3000

# Start Frontend (static build preview)
cd apps/web && pnpm dev  # Runs at http://localhost:3000
```

### Building

```bash
# CMS (Dokploy) - Uses original Next.js build
pnpm build

# Frontend (Cloudflare) - Static export
cd apps/web && pnpm build  # Creates out/ directory
```

## Creating Custom Collections

### Step 1: Define Collection Config

```typescript
// src/collections/Products.ts
import type { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'name',
  },
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
      name: 'description',
      type: 'richText',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
  ],
}
```

### Step 2: Register in Payload Config

```typescript
// src/payload.config.ts
import { Products } from './collections/Products'

export default buildConfig({
  collections: [
    // ... existing
    Products,
  ],
})
```

### Step 3: Generate Types

```bash
pnpm generate:types
cp src/payload-types.ts packages/types/generated-types.ts
```

### Step 4: Add API Fetcher (Frontend)

```typescript
// apps/web/src/lib/api.ts
export async function getProducts(options?: FetchOptions) {
  return fetchFromCMS<PaginatedResponse<any>>('products', options)
}

export async function getProduct(slug: string, options?: FetchOptions) {
  const result = await fetchFromCMS<PaginatedResponse<any>>(
    `products?where[slug][equals]=${slug}`,
    options
  )
  return result.docs[0] || null
}
```

### Step 5: Create Frontend Page

```typescript
// apps/web/src/app/products/page.tsx
import { getProducts } from '@/lib/api'

export default async function ProductsPage() {
  const products = await getProducts({ revalidate: 60 })
  
  return (
    <div className="container py-16">
      <h1>Products</h1>
      <div className="grid grid-cols-3 gap-6">
        {products.docs.map((product: any) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
```

## Creating Custom Blocks

### Step 1: Define Block Config (CMS)

```typescript
// src/blocks/Pricing/config.ts
import type { Block } from 'payload'

export const PricingBlock: Block = {
  slug: 'pricing',
  labels: {
    singular: 'Pricing Table',
    plural: 'Pricing Tables',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'plans',
      type: 'array',
      fields: [
        { name: 'name', type: 'text' },
        { name: 'price', type: 'number' },
        { name: 'features', type: 'array', fields: [{ name: 'feature', type: 'text' }] },
      ],
    },
  ],
}
```

### Step 2: Create Component (Both CMS & Frontend)

```typescript
// src/blocks/Pricing/Component.tsx
// AND
// apps/web/src/blocks/Pricing/Component.tsx

import React from 'react'
import { cn } from '@/utilities/ui'

type PricingProps = {
  title: string
  plans: Array<{
    name: string
    price: number
    features: Array<{ feature: string }>
  }>
}

export const PricingBlock: React.FC<PricingProps> = ({ title, plans }) => {
  return (
    <section className="py-16 container">
      <h2 className="text-3xl font-bold text-center mb-12">{title}</h2>
      <div className="grid md:grid-cols-3 gap-8">
        {plans.map((plan, i) => (
          <div key={i} className="border rounded-xl p-8">
            <h3 className="text-xl font-semibold">{plan.name}</h3>
            <p className="text-4xl font-bold my-4">${plan.price}</p>
            <ul className="space-y-2">
              {plan.features.map((f, j) => (
                <li key={j}>✓ {f.feature}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
```

### Step 3: Register in RenderBlocks (Both)

```typescript
// src/blocks/RenderBlocks.tsx
// AND
// apps/web/src/blocks/RenderBlocks.tsx

import { PricingBlock } from './Pricing/Component'

const blockComponents = {
  // ... existing
  pricing: PricingBlock,
}
```

## Adding shadcn/ui Components

### Install shadcn/ui

```bash
cd apps/web
npx shadcn@latest init
```

### Add Components

```bash
npx shadcn@latest add button card dialog
```

### Use in Your Components

```typescript
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
```

## Using Zod for Validation

### API Response Validation

```typescript
// apps/web/src/lib/schemas.ts
import { z } from 'zod'

export const PageSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  hero: z.object({
    type: z.string(),
    richText: z.any().optional(),
  }).optional(),
  layout: z.array(z.any()).optional(),
})

export type Page = z.infer<typeof PageSchema>
```

### Validated Fetcher

```typescript
// apps/web/src/lib/api.ts
import { PageSchema } from './schemas'

export async function getPageBySlugValidated(slug: string) {
  const result = await fetchFromCMS<PaginatedResponse<unknown>>(
    `pages?where[slug][equals]=${slug}`
  )
  const parsed = PageSchema.safeParse(result.docs[0])
  if (!parsed.success) {
    console.error('Invalid page data:', parsed.error)
    return null
  }
  return parsed.data
}
```

## Form Handling

### Create Form Collection (CMS)

Forms are handled by `@payloadcms/plugin-form-builder`:
1. Go to Admin → Forms
2. Create a form with fields
3. Form submissions go to Form Submissions collection

### Render Form (Frontend)

The `FormBlock` component handles form rendering and submission.
API calls go to `https://cms.wlf.com.mx/api/form-submissions`.

## Webhook Setup for Auto-Rebuild

### 1. Get Cloudflare Deploy Hook URL

1. Cloudflare Dashboard → Pages → Your Project
2. Settings → Builds & deployments
3. Deploy hooks → Add hook
4. Copy the URL

### 2. Add to Dokploy Environment

```env
CLOUDFLARE_DEPLOY_HOOK_URL=https://api.cloudflare.com/client/v4/pages/...
```

### 3. Create Revalidation Hook

```typescript
// src/hooks/revalidateOnChange.ts
export const triggerRebuild = async () => {
  const hookUrl = process.env.CLOUDFLARE_DEPLOY_HOOK_URL
  if (!hookUrl) return
  
  try {
    await fetch(hookUrl, { method: 'POST' })
    console.log('Cloudflare rebuild triggered')
  } catch (error) {
    console.error('Failed to trigger rebuild:', error)
  }
}
```

### 4. Add to Collections

```typescript
// src/collections/Pages.ts
import { triggerRebuild } from '../hooks/revalidateOnChange'

export const Pages: CollectionConfig = {
  // ...
  hooks: {
    afterChange: [
      async () => {
        await triggerRebuild()
      }
    ],
    afterDelete: [
      async () => {
        await triggerRebuild()
      }
    ],
  },
}
```

## Performance Tips

### 1. Reduce Bundle Size

```typescript
// apps/web/next.config.mjs
const nextConfig = {
  output: 'export',
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
}
```

### 2. Image Optimization

Since we can't use Next.js Image optimization with static export:
```tsx
// Use CMS-side optimization
<img 
  src={`${CMS_URL}${image.sizes?.thumbnail?.url || image.url}`}
  alt={image.alt}
/>
```

### 3. Lazy Load Heavy Components

```tsx
import dynamic from 'next/dynamic'

const HeavyChart = dynamic(() => import('./Chart'), {
  loading: () => <div>Loading...</div>,
  ssr: false,
})
```

## Troubleshooting

### Build Fails with "@payload-config" Error

**Cause:** Server-only file in frontend
**Fix:** Delete the file or remove the import

### "generateStaticParams" Error

**Cause:** Empty return from generateStaticParams
**Fix:** Always return at least one fallback path

### CMS Shows White Page

**Cause:** JavaScript chunk hash mismatch
**Fix:** Hard refresh (Ctrl+Shift+R) or redeploy

### API Returns Empty

**Cause:** No content in CMS
**Fix:** Create content in Admin panel
