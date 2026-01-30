// @wlf/design-tokens - Sovereign/Zen Aesthetic
// Import the CSS in your app's root layout

// Re-export tokens for programmatic access
import tokensJson from '../tokens.json'

// Type-safe color accessor
export const colors = tokensJson.colors
export const radii = tokensJson.radii
export const spacing = tokensJson.spacing
export const shadows = tokensJson.shadows
export const easing = tokensJson.easing
export const typography = tokensJson.typography
export const animation = tokensJson.animation

// Full tokens object
export const tokens = tokensJson

// CSS custom property helpers
export const cssVar = (name: string) => `var(--${name})`
export const ease = (type: keyof typeof tokensJson.easing) => tokensJson.easing[type]

