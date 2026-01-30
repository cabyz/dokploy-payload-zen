# 🏃 Sprint: Zero Tech Debt - WLF Split-Head Architecture

**Sprint Goal:** Achieve 0% technical debt by implementing proper monorepo tooling, shared packages, and automation based on the zen-test pattern.

**Definition of Done:**
- All shared code in `packages/`
- Single command deploys everything
- No duplicate dependencies
- Design tokens for consistent styling
- Storybook/Ladle for component preview
- Auto-deploy on push

---

## 📊 Current State → Target State

| Area | Current | Target |
|------|---------|--------|
| Packages | 2 (types, ui) | 4 (types, ui, design-tokens, config) |
| Deploy process | Manual SSH + Docker | One-click auto-deploy |
| Styling | Ad-hoc Tailwind | Token-based design system |
| Component preview | None | Ladle stories |
| Build orchestration | pnpm scripts | Turbo pipelines |

---

## 📋 Sprint Backlog

### Epic 1: Build Orchestration (2 pts)

#### STORY-001: Add Turborepo Configuration ✅ READY
**As a** developer  
**I want** turbo.json with proper pipelines  
**So that** builds are cached and parallelized  

**Acceptance Criteria:**
- [ ] turbo.json exists at root
- [ ] `turbo build` builds all packages then apps
- [ ] `turbo dev` starts all dev servers
- [ ] Build output is cached

**Tasks:**
- [ ] Create turbo.json
- [ ] Add turbo as devDependency
- [ ] Update package.json scripts

---

### Epic 2: Design Tokens Package (3 pts)

#### STORY-002: Create @wlf/design-tokens Package ✅ READY
**As a** developer  
**I want** all colors, spacing, radii in one package  
**So that** CMS and frontend have consistent styling  

**Acceptance Criteria:**
- [ ] packages/design-tokens/tokens.json exists
- [ ] base.css with CSS custom properties
- [ ] Both apps import from @wlf/design-tokens

**Tasks:**
- [ ] Create packages/design-tokens structure
- [ ] Port tokens from zen-test base.css
- [ ] Create Sovereign/Zen dark theme tokens
- [ ] Export CSS variables for Tailwind

---

### Epic 3: Shared UI Components (5 pts)

#### STORY-003: Port Core Primitives to @wlf/ui ✅ READY
**As a** developer  
**I want** button, input, badge, card in @wlf/ui  
**So that** I don't duplicate UI code  

**Acceptance Criteria:**
- [ ] Button component with variants
- [ ] Input component
- [ ] Card component
- [ ] Badge component
- [ ] All export from @wlf/ui

**Tasks:**
- [ ] Port button.tsx from zen-test
- [ ] Port input.tsx from zen-test
- [ ] Port card.tsx from zen-test
- [ ] Port badge.tsx from zen-test
- [ ] Update package.json exports

---

#### STORY-004: Add Ladle for Component Stories ✅ READY
**As a** developer  
**I want** Ladle storybook for UI preview  
**So that** I can develop components in isolation  

**Acceptance Criteria:**
- [ ] `pnpm ui:dev` starts Ladle
- [ ] Each component has a .stories.tsx file
- [ ] Stories show variants and states

**Tasks:**
- [ ] Add @ladle/react to packages/ui
- [ ] Create stories for existing components
- [ ] Add Ladle script to package.json

---

### Epic 4: Shared Config Package (2 pts)

#### STORY-005: Create @wlf/config Package ✅ READY
**As a** developer  
**I want** shared ESLint, TypeScript, Tailwind configs  
**So that** all apps have consistent linting/formatting  

**Acceptance Criteria:**
- [ ] packages/config/eslint.config.js
- [ ] packages/config/tailwind.config.js
- [ ] packages/config/tsconfig.json
- [ ] Apps extend from @wlf/config

**Tasks:**
- [ ] Create packages/config structure
- [ ] Extract shared ESLint config
- [ ] Extract shared Tailwind config
- [ ] Update apps to extend configs

---

### Epic 5: Auto-Deploy Pipeline (3 pts)

#### STORY-006: Dokploy Auto-Build on Push ✅ READY
**As a** developer  
**I want** Dokploy to auto-rebuild when I push to main  
**So that** I don't have to SSH and manually build  

**Acceptance Criteria:**
- [ ] Push to main triggers Dokploy rebuild
- [ ] No manual SSH required
- [ ] Build logs visible in Dokploy UI

**Tasks:**
- [ ] Set up GitHub webhook to Dokploy
- [ ] Configure Dokploy auto-deploy
- [ ] Test end-to-end deploy

---

#### STORY-007: Cloudflare Pages Deploy Hook ✅ READY
**As a** developer  
**I want** CMS publish to trigger frontend rebuild  
**So that** production stays in sync  

**Acceptance Criteria:**
- [ ] afterChange hook in Payload triggers Cloudflare
- [ ] Frontend rebuilds within 2 minutes
- [ ] Works for Pages collection

**Tasks:**
- [ ] Get Cloudflare deploy hook URL
- [ ] Add afterChange hook to Pages collection
- [ ] Test publish → rebuild flow

---

### Epic 6: Motion & Animation Library (2 pts)

#### STORY-008: Create @wlf/motion Package 🔮 NICE TO HAVE
**As a** developer  
**I want** shared animation presets and easings  
**So that** all animations feel consistent  

**Acceptance Criteria:**
- [ ] packages/motion/src/easings.ts
- [ ] packages/motion/src/animations.ts
- [ ] GSAP ScrollTrigger helpers
- [ ] Export for Framer Motion variants

---

## 📊 Sprint Summary

| Epic | Points | Priority |
|------|--------|----------|
| Build Orchestration | 2 | P0 |
| Design Tokens | 3 | P0 |
| Shared UI | 5 | P1 |
| Shared Config | 2 | P1 |
| Auto-Deploy | 3 | P0 |
| Motion Library | 2 | P2 |

**Total:** 17 points

---

## 🚀 Recommended Execution Order

1. **STORY-001** - Turbo (foundation for everything)
2. **STORY-002** - Design Tokens (enables consistent styling)
3. **STORY-006** - Dokploy Auto-Deploy (biggest time saver)
4. **STORY-003** - UI Primitives (button, card, etc.)
5. **STORY-005** - Shared Config (cleanup)
6. **STORY-007** - Cloudflare Hook (production sync)
7. **STORY-004** - Ladle (nice to have)
8. **STORY-008** - Motion (nice to have)

---

## 🎯 User Story: Zero Debt Experience

**As a** developer working on WLF  
**I want** the following experience:

```bash
# 1. Start dev mode (all apps + UI preview)
pnpm dev

# 2. Make changes to any component in packages/ui
# 3. See live updates in Ladle AND both apps

# 4. Commit and push
git add . && git commit -m "feat: new hero section" && git push

# 5. Auto-deploy happens:
#    - Dokploy detects push → rebuilds CMS
#    - Cloudflare detects push → rebuilds frontend

# 6. Done. No SSH, no manual builds.
```

---

**Ready to start? Pick the first story!**
