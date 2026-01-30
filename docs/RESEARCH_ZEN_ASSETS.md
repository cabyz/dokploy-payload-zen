# 🔬 Zen-Test Codebase Research - Assets to Port

**Research Date:** 2026-01-30  
**Source:** `/root/zen/research/zen-test`  
**Target:** `/root/zen/payloads/dokploy-hosted-fixed`

---

## 🎯 Executive Summary

The zen-test codebase contains a mature, Series-A grade design system with premium UI components, motion primitives, and marketing assets. These can accelerate WLF development significantly.

---

## 📦 High-Value Assets Discovered

### 1. Motion System (`packages/ui/src/motion.ts`) ⭐⭐⭐⭐⭐

**What it is:** Centralized animation/easing library for Framer Motion

**Contains:**
```typescript
EASING = {
  snappy: [0.2, 0, 0, 1]      // Apple spring curve
  apple: [0.16, 1, 0.3, 1]    // Invisible fluid easing
  soft: [0.4, 0, 0.2, 1]      // Gentle deceleration
  sovereign: [0.23, 1, 0.32, 1] // Signature Zen curve
}

VARIANTS = {
  heroObject: { ... }  // Page entry animation
  item: { ... }        // Staggered list items
}

transition() // Helper function
```

**Priority:** P0 - Should port immediately

---

### 2. Surface Primitive (`packages/ui/src/primitives.tsx`) ⭐⭐⭐⭐⭐

**What it is:** The fundamental building block replacing ad-hoc divs

**Variants:**
- **shape:** rectangle, squircle, pill, circle, brand-squircle
- **size:** xs, sm, md, lg, xl, 2xl, full
- **elevation:** none, flat, raised, glass, ghost, brand-gradient
- **intent:** neutral, primary, magic, loading

**Why it's valuable:** Single component for all containers = consistency

---

### 3. ZenGrid Layout (`packages/ui/src/layout.tsx`) ⭐⭐⭐⭐

**What it is:** Automatic bento-grid layout system

```tsx
<ZenGrid cols={3} gap="md">
  <ZenItem colSpan={2} rowSpan={1} elevation="glass">
    Hero content
  </ZenItem>
  <ZenItem colSpan={1} elevation="raised">
    Sidebar
  </ZenItem>
</ZenGrid>
```

**Why it's valuable:** Instant bento layouts for landing pages

---

### 4. Dynamic Island (`packages/ui/src/sovereign/dynamic-island.tsx`) ⭐⭐⭐⭐

**What it is:** Apple-style morphing notification component

**States:** idle, loading, success, error, expanded

**Why it's valuable:** Premium notification UX for forms, actions

---

### 5. Spotlight Effect (`packages/ui/src/spotlight.tsx`) ⭐⭐⭐⭐

**What it is:** Mouse-following radial gradient highlight

**Why it's valuable:** Premium hover effect for cards/sections

---

### 6. Atomic Command Menu (`packages/ui/src/command-menu.tsx`) ⭐⭐⭐⭐

**What it is:** Full-featured command palette with:
- Grouped items by category
- Keyboard shortcuts
- Zod schema validation
- AnimatePresence transitions
- Glass blur aesthetic

**Why it's valuable:** Add ⌘K command palette to any app

---

### 7. Marketing Components (`apps/marketing/app/components/`) ⭐⭐⭐

| Component | Description |
|-----------|-------------|
| `21st-navbar.tsx` | Premium navigation bar |
| `spline-canvas.tsx` | 3D Spline integration |
| `orbit-model.tsx` | 3D orbit visualization |
| `portfolio-carousel.tsx` | Portfolio showcase |

---

## 📊 Port Priority Matrix

| Asset | Complexity | Impact | Priority |
|-------|------------|--------|----------|
| motion.ts | Low | High | **P0** |
| primitives.tsx (Surface) | Medium | High | **P0** |
| layout.tsx (ZenGrid) | Medium | High | **P1** |
| dynamic-island.tsx | Medium | Medium | **P1** |
| spotlight.tsx | Low | Medium | **P2** |
| command-menu.tsx | High | Medium | **P2** |

---

## 🎯 Recommended Next Tasks (SCRUM)

### STORY-009: Port Motion System to @wlf/ui
**Points:** 2  
**Priority:** P0

```
As a developer
I want shared motion easings and variants
So that all animations feel consistent

Tasks:
- [ ] Create packages/ui/src/motion.ts
- [ ] Export EASING, VARIANTS, transition()
- [ ] Update package.json exports
```

### STORY-010: Port Surface Primitive to @wlf/ui
**Points:** 3  
**Priority:** P0

```
As a developer
I want a Surface component with shape/elevation variants
So that I have consistent container styling

Tasks:
- [ ] Create packages/ui/src/components/Surface.tsx
- [ ] Port all variants from primitives.tsx
- [ ] Add export to package.json
```

### STORY-011: Port ZenGrid Layout System
**Points:** 3  
**Priority:** P1

```
As a developer
I want a bento-grid layout system
So that I can quickly create landing page layouts

Tasks:
- [ ] Create packages/ui/src/components/ZenGrid.tsx
- [ ] Create packages/ui/src/components/ZenItem.tsx
- [ ] Port all colSpan/rowSpan variants
```

### STORY-012: Port Dynamic Island
**Points:** 3  
**Priority:** P1

```
As a developer
I want an Apple-style notification component
So that form submissions feel premium

Tasks:
- [ ] Create packages/ui/src/components/DynamicIsland.tsx
- [ ] Port all states (idle, loading, success, error, expanded)
```

### STORY-013: Port Spotlight Effect
**Points:** 2  
**Priority:** P2

```
As a developer
I want a mouse-following spotlight effect
So that cards have premium hover interactions

Tasks:
- [ ] Create packages/ui/src/components/Spotlight.tsx
- [ ] Port useSpring/useTransform mouse tracking
```

---

## 📁 Files to Port (Quick Reference)

```bash
# SOURCE → TARGET

# Motion
zen-test/packages/ui/src/motion.ts → dokploy-hosted-fixed/packages/ui/src/motion.ts

# Primitives
zen-test/packages/ui/src/primitives.tsx → dokploy-hosted-fixed/packages/ui/src/components/Surface.tsx

# Layout
zen-test/packages/ui/src/layout.tsx → dokploy-hosted-fixed/packages/ui/src/components/ZenGrid.tsx

# Effects
zen-test/packages/ui/src/sovereign/dynamic-island.tsx → dokploy-hosted-fixed/packages/ui/src/components/DynamicIsland.tsx
zen-test/packages/ui/src/spotlight.tsx → dokploy-hosted-fixed/packages/ui/src/components/Spotlight.tsx
```

---

## 🧪 Other Research Folders to Explore

| Folder | Contents | Priority |
|--------|----------|----------|
| `/root/zen/research/zen-cms` | Another CMS variant | Medium |
| `/root/zen/research/zen-test/apps/styleguide` | Component docs | Low |
| `/root/zen/research/zen-test/packages/db` | Database utils | Medium |
| `/root/zen/research/zen-test/packages/jobs` | Background jobs | Low |
| `/root/zen/research/zen-test/99_Intelligence` | AI/Research docs | Medium |

---

## ✅ Immediate Action Plan

1. **Port motion.ts** (5 min)
2. **Port Surface primitive** (10 min)
3. **Port ZenGrid** (10 min)
4. **Commit + push** (auto-deploy)
5. **Test in WLF CMS**

**Estimated time to add all P0/P1 assets: 45 minutes**

---

## 💡 Additional Insights

### Design Tokens Already Aligned

The `base.css` we ported already includes:
- `--ease-sovereign: cubic-bezier(0.23, 1, 0.32, 1)`
- Glass panel styles
- Kinetic animations

This means motion.ts will integrate seamlessly!

### TypeScript Compatibility

All zen-test components use:
- class-variance-authority (we have it)
- framer-motion/motion (we have it)
- lucide-react (we have it)

**No additional dependencies needed!**
