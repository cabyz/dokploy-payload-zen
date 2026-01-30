'use client'

import React from 'react'
import { ReactLenis, useLenis } from 'lenis/react'

/**
 * SmoothScrollProvider
 * 
 * Provides Lenis smooth scrolling with a cinematic, premium feel.
 * Refined for the "Sovereign/Zen" aesthetic with subtle lerp.
 * 
 * Usage:
 *   import { SmoothScrollProvider } from '@wlf/ui/smooth-scroll'
 *   
 *   <SmoothScrollProvider>
 *     {children}
 *   </SmoothScrollProvider>
 */
export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
    return (
        <ReactLenis
            root
            options={{
                lerp: 0.08,            // Smooth but responsive
                duration: 1.2,          // Cinematic timing
                smoothWheel: true,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Sovereign easing
            }}
        >
            {children}
        </ReactLenis>
    )
}

export { useLenis }
