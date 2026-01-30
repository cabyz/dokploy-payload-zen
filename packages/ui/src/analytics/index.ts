"use client"

import posthog from 'posthog-js'

/**
 * SOVEREIGN ANALYTICS (PostHog-powered)
 * Zero-drop conversion tracking for funnels and forms.
 * 
 * Usage:
 *   // In your root layout or _app.tsx
 *   import { initAnalytics, trackPageView } from '@wlf/ui/analytics'
 *   
 *   useEffect(() => {
 *     initAnalytics()
 *   }, [])
 *   
 *   // On route change
 *   useEffect(() => {
 *     trackPageView()
 *   }, [pathname])
 */

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com'

let isInitialized = false

/**
 * Initialize PostHog with aggressive autocapture.
 * Call once in your app's root layout.
 */
export function initAnalytics() {
    if (typeof window === 'undefined') return
    if (isInitialized) return
    if (!POSTHOG_KEY) {
        console.warn('[Analytics] No POSTHOG_KEY found, tracking disabled')
        return
    }

    posthog.init(POSTHOG_KEY, {
        api_host: POSTHOG_HOST,
        capture_pageview: false, // We handle manually for SPA routing
        persistence: 'localStorage',

        // Aggressive autocapture for conversion optimization
        autocapture: true,
        capture_performance: true,

        // Session recordings (opt-in - set mask to true for privacy)
        session_recording: {
            maskAllInputs: false, // Set true to mask form inputs
            recordCanvas: true,
        } as any,

        // Zero-latency
        advanced_disable_decide: false,
    })

    // Register global context
    posthog.register({
        platform: 'wlf-cms',
        environment: process.env.NODE_ENV,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    })

    isInitialized = true
}

/**
 * Track page views manually (for SPA routing).
 */
export function trackPageView(url?: string) {
    if (typeof window === 'undefined' || !POSTHOG_KEY) return
    posthog.capture('$pageview', {
        $current_url: url || window.location.href,
    })
}

/**
 * Track custom events with automatic enrichment.
 */
export function trackEvent(name: string, properties?: Record<string, any>) {
    if (typeof window === 'undefined' || !POSTHOG_KEY) return
    posthog.capture(name, {
        ...properties,
        $timestamp: new Date().toISOString(),
        current_url: window.location.href,
    })
}

/**
 * Identify a user (after form submission, login, etc.)
 */
export function identifyUser(id: string, email?: string, traits?: Record<string, any>) {
    if (typeof window === 'undefined' || !POSTHOG_KEY) return
    posthog.identify(id, {
        email,
        ...traits,
        last_seen: new Date().toISOString(),
    })
}

/**
 * Track form field interactions for funnel optimization.
 */
export function trackFormField(formId: string, fieldName: string, action: 'focus' | 'blur' | 'change') {
    if (typeof window === 'undefined' || !POSTHOG_KEY) return
    posthog.capture('form_interaction', {
        form_id: formId,
        field: fieldName,
        action,
    })
}

/**
 * Track conversion events (lead capture, purchase, etc.)
 */
export function trackConversion(type: 'lead' | 'signup' | 'purchase' | 'booking', properties?: Record<string, any>) {
    if (typeof window === 'undefined' || !POSTHOG_KEY) return
    posthog.capture(`conversion_${type}`, {
        ...properties,
        $timestamp: new Date().toISOString(),
    })
}

/**
 * Get feature flag value (for A/B testing)
 */
export function getFeatureFlag(flagKey: string): string | boolean | undefined {
    if (typeof window === 'undefined' || !POSTHOG_KEY) return undefined
    return posthog.getFeatureFlag(flagKey)
}

/**
 * Check if user is in experiment variant
 */
export function isInVariant(experimentKey: string, variantName: string): boolean {
    return getFeatureFlag(experimentKey) === variantName
}

// Re-export posthog for advanced usage
export { posthog }
