import { PostHog } from 'posthog-node'

/**
 * SERVER-SIDE ANALYTICS (PostHog Node)
 * For use in Payload hooks, API routes, and server actions.
 * 
 * This enables:
 * 1. Reliable tracking that bypasses ad blockers
 * 2. Meta Conversion API integration pattern
 * 3. Offline event processing
 * 
 * Usage:
 *   import { serverAnalytics, trackServerEvent } from '@/lib/analytics'
 *   
 *   // In a Payload afterChange hook:
 *   afterChange: async ({ doc }) => {
 *     await trackServerEvent(doc.email, 'lead_created', { source: doc.source })
 *   }
 */

const POSTHOG_KEY = process.env.POSTHOG_SERVER_KEY || process.env.NEXT_PUBLIC_POSTHOG_KEY
const POSTHOG_HOST = process.env.POSTHOG_HOST || 'https://app.posthog.com'

// Singleton instance
export const serverAnalytics = POSTHOG_KEY
    ? new PostHog(POSTHOG_KEY, { host: POSTHOG_HOST })
    : null

/**
 * Track server-side event (bypasses ad blockers)
 */
export async function trackServerEvent(
    distinctId: string,
    event: string,
    properties?: Record<string, any>
) {
    if (!serverAnalytics) {
        console.log('[Server Analytics Skip]', { distinctId, event, properties })
        return
    }

    serverAnalytics.capture({
        distinctId,
        event,
        properties: {
            ...properties,
            $timestamp: new Date().toISOString(),
            source: 'server',
        },
    })
}

/**
 * Identify user server-side
 */
export async function identifyServerUser(
    distinctId: string,
    properties?: Record<string, any>
) {
    if (!serverAnalytics) return

    serverAnalytics.identify({
        distinctId,
        properties: {
            ...properties,
            identified_at: new Date().toISOString(),
        },
    })
}

/**
 * Track lead conversion (for afterChange hooks on Leads collection)
 */
export async function trackLeadConversion(
    email: string,
    source: string,
    additionalProps?: Record<string, any>
) {
    await trackServerEvent(email, 'lead_created', {
        source,
        ...additionalProps,
    })

    // Optional: Send to Meta Conversion API
    if (process.env.META_PIXEL_ID && process.env.META_ACCESS_TOKEN) {
        await sendToMetaCAPI('Lead', email, { source })
    }
}

/**
 * Send server-side event to Meta Conversion API
 * This bypasses iOS 14.5+ tracking limitations
 */
export async function sendToMetaCAPI(
    eventName: string,
    email: string,
    customData?: Record<string, any>
) {
    const PIXEL_ID = process.env.META_PIXEL_ID
    const ACCESS_TOKEN = process.env.META_ACCESS_TOKEN

    if (!PIXEL_ID || !ACCESS_TOKEN) {
        console.log('[Meta CAPI Skip] Missing credentials')
        return
    }

    try {
        // Hash email for privacy (Meta requires sha256)
        const hashedEmail = await hashSHA256(email.toLowerCase().trim())

        const response = await fetch(
            `https://graph.facebook.com/v18.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    data: [{
                        event_name: eventName,
                        event_time: Math.floor(Date.now() / 1000),
                        action_source: 'website',
                        user_data: {
                            em: [hashedEmail],
                        },
                        custom_data: customData,
                    }],
                }),
            }
        )

        if (!response.ok) {
            console.error('[Meta CAPI Error]', await response.text())
        }
    } catch (error) {
        console.error('[Meta CAPI Error]', error)
    }
}

/**
 * SHA256 hash for Meta CAPI privacy compliance
 */
async function hashSHA256(text: string): Promise<string> {
    if (typeof globalThis.crypto !== 'undefined' && globalThis.crypto.subtle) {
        const encoder = new TextEncoder()
        const data = encoder.encode(text)
        const hashBuffer = await globalThis.crypto.subtle.digest('SHA-256', data)
        const hashArray = Array.from(new Uint8Array(hashBuffer))
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
    }
    // Fallback for Node.js
    const nodeCrypto = await import('crypto')
    return nodeCrypto.createHash('sha256').update(text).digest('hex')
}

/**
 * Gracefully shutdown analytics (call on app shutdown)
 */
export async function shutdownAnalytics() {
    if (serverAnalytics) {
        await serverAnalytics.shutdown()
    }
}
