import { type Variant } from "framer-motion";

/**
 * SOVEREIGN MOTION SYSTEM
 * Centralized kinetics for the WLF/Zen ecosystem.
 * Values derived from Apple + High-Frequency Trading styling.
 * 
 * Usage:
 *   import { EASING, VARIANTS, transition } from '@wlf/ui/motion'
 */

export const EASING = {
    /** The standard Apple spring curve. Heavy, confident, fast. */
    snappy: [0.2, 0, 0, 1] as const,
    /** The 'invisible' fluid easing for opacity/fades. */
    apple: [0.16, 1, 0.3, 1] as const,
    /** Gentle deceleration for background elements. */
    soft: [0.4, 0, 0.2, 1] as const,
    /** The Signature Zen Curve. Heavy start, snap finish. */
    sovereign: [0.23, 1, 0.32, 1] as const,
};

export const DURATION = {
    /** Instant feedback (50-100ms) */
    instant: 0.1,
    /** Quick interactions (150-200ms) */
    fast: 0.2,
    /** Standard transitions (300-400ms) */
    normal: 0.4,
    /** Deliberate, cinematic (600-800ms) */
    slow: 0.6,
    /** Hero entrances (1000-1200ms) */
    cinematic: 0.8,
};

export const VARIANTS = {
    /** Standard page/hero entry animation */
    heroObject: {
        hidden: { opacity: 0, scale: 0.9, y: 20 },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: { duration: DURATION.cinematic, ease: EASING.sovereign }
        }
    },
    /** Staggered list items */
    item: {
        hidden: { opacity: 0, y: 10 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: DURATION.normal, ease: EASING.snappy }
        }
    },
    /** Fade in from below */
    fadeUp: {
        hidden: { opacity: 0, y: 24 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: DURATION.slow, ease: EASING.sovereign }
        }
    },
    /** Fade in from left */
    fadeLeft: {
        hidden: { opacity: 0, x: -24 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: DURATION.slow, ease: EASING.sovereign }
        }
    },
    /** Scale up with blur (premium feel) */
    scaleBlur: {
        hidden: { opacity: 0, scale: 0.96, filter: "blur(4px)" },
        visible: {
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
            transition: { duration: DURATION.slow, ease: EASING.sovereign }
        }
    },
};

/**
 * Returns a transition object for Framer Motion using Sovereign standards.
 * @param type - Easing type from EASING constants
 * @param duration - Duration in seconds (or use DURATION constants)
 */
export function transition(
    type: keyof typeof EASING = "sovereign",
    duration: number = DURATION.normal
) {
    return {
        duration,
        ease: EASING[type],
    };
}

/**
 * Stagger children animation config
 * @param staggerDelay - Delay between each child (default 0.1s)
 * @param delayChildren - Initial delay before first child (default 0.2s)
 */
export function stagger(staggerDelay = 0.1, delayChildren = 0.2) {
    return {
        visible: {
            transition: {
                staggerChildren: staggerDelay,
                delayChildren,
            }
        }
    };
}

/**
 * Spring physics for natural, bouncy animations
 */
export const SPRING = {
    /** Snappy, responsive spring */
    snappy: { type: "spring", stiffness: 400, damping: 30 },
    /** Bouncy, playful spring */
    bouncy: { type: "spring", stiffness: 300, damping: 20 },
    /** Gentle, slow spring */
    gentle: { type: "spring", stiffness: 200, damping: 25 },
} as const;
