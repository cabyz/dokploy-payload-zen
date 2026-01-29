# Questions for NotebookLM - Payload CMS + Split-Head Architecture

## Core Architecture Questions

1. **What is the "Split-Head" architecture and why is it beneficial for content-heavy websites?**
   - Separation of CMS (admin + API) from frontend (static pages)
   - Performance benefits of edge-deployed static files
   - SEO advantages of pre-rendered HTML

2. **How does data flow from CMS to Frontend in a split-head setup?**
   - Build-time REST API fetching
   - Static generation with generateStaticParams
   - No runtime server on frontend

3. **What are the limitations of Next.js static export (`output: 'export'`)?**
   - No API routes
   - No server-side rendering
   - No rewrites/redirects
   - No draft mode
   - No revalidatePath at runtime

## Payload CMS Specific Questions

4. **What is the difference between `getPayload()` and REST API fetching?**
   - getPayload = direct database access (server-only)
   - REST API = HTTP requests (works anywhere)
   - When to use each

5. **How do Payload blocks work and how are they rendered?**
   - Block configs define fields (CMS-side)
   - Block components render content (both sides)
   - RenderBlocks maps blockType to component

6. **What are Payload Globals and how are they different from Collections?**
   - Globals = singleton data (header, footer, settings)
   - Collections = multiple documents (pages, posts, products)
   - How to fetch each via API

7. **How does Payload's Live Preview work and why doesn't it work with static export?**
   - WebSocket connection to CMS
   - Requires server-side rendering
   - Alternative: Use CMS frontend for preview

## Monorepo & Code Organization

8. **How to structure a pnpm monorepo for split-head Payload?**
   - apps/cms (or root src/)
   - apps/web (frontend)
   - packages/types (shared types)
   - pnpm-workspace.yaml configuration

9. **How to share types between CMS and Frontend?**
   - Generate with `payload generate:types`
   - Copy to shared package
   - Configure tsconfig paths

10. **What code should NOT be copied to the frontend?**
    - Payload config files (`@payload-config`)
    - Server-only utilities (getPayload wrappers)
    - Admin components (AdminBar, LivePreview)
    - Collection/Block configs

## Deployment Questions

11. **How to deploy Payload CMS on Dokploy?**
    - Dockerfile configuration
    - Environment variables
    - MongoDB setup
    - Memory considerations (NODE_OPTIONS)

12. **How to deploy static frontend on Cloudflare Pages?**
    - Build command: `pnpm build`
    - Output directory: `out/`
    - Environment variables (CMS_URL)
    - Auto-rebuild on git push

13. **How to set up automatic rebuilds when CMS content changes?**
    - Cloudflare Deploy Hooks
    - Payload afterChange hooks
    - Webhook security

## Component Development

14. **How to create a new block that works in both CMS and Frontend?**
    - Config in CMS only
    - Component in both
    - Register in RenderBlocks
    - REST API considerations

15. **How to use shadcn/ui components in the frontend?**
    - Installation process
    - Component structure
    - Tailwind configuration
    - Class variance authority (cva)

16. **How to validate API responses with Zod?**
    - Schema definition
    - SafeParse vs parse
    - Type inference
    - Error handling

## Performance & SEO

17. **Why is static export better for SEO than SSR?**
    - Pre-rendered HTML
    - Faster Time to First Byte (TTFB)
    - No server delays
    - CDN caching

18. **How to optimize images in a static export setup?**
    - CMS-side image processing
    - Image size variants
    - srcset for responsive images
    - WebP format

19. **How to handle forms in a static frontend?**
    - Form submissions via API call to CMS
    - CORS configuration
    - Error handling
    - Success feedback

## Troubleshooting

20. **Common build errors and how to fix them:**
    - "Cannot find module '@payload-config'" → Remove server file
    - "generateStaticParams must return array" → Add fallback paths
    - "Module not found: @/payload-types" → Fix tsconfig paths
    - Build OOM → Add NODE_OPTIONS=--max-old-space-size=4096

21. **How to debug REST API issues:**
    - Test endpoints directly with curl
    - Check CORS headers
    - Verify CMS is running
    - Check environment variables

22. **How to fix "white page" issues on CMS:**
    - Clear browser cache
    - Check console for script errors
    - Verify deployment completed
    - Check chunk hash mismatches

## Advanced Topics

23. **How to implement preview mode for content editors?**
    - Use CMS frontend for preview (has SSR)
    - Configure preview URL in Payload
    - Draft mode considerations

24. **How to handle authentication in split-head setup?**
    - User auth via CMS API
    - JWT tokens for API calls
    - Secure content fetching

25. **How to implement search functionality?**
    - Payload Search plugin
    - Client-side search
    - Algolia/MeiliSearch integration

## Key Learnings to Emphasize

1. **The Edge Runtime Paradox**: Cloudflare Pages uses V8, not Node.js. No require(), no Buffer (without polyfills), no Payload SDK.

2. **Component Entanglement**: Original templates deeply couple components to Payload. Must systematically replace all getPayload() calls.

3. **Import Path Consistency**: Mixed paths (`src/`, `../`, `@/`) cause build failures. Standardize on `@/` with proper tsconfig.

4. **Fallback Static Params**: Dynamic routes MUST return at least one path for static export.

5. **Two Frontends Strategy**: CMS frontend for editing/preview, Cloudflare frontend for production traffic.
