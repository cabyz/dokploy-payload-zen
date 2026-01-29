'use client'

import React, { useEffect } from 'react'
import { ReactLenis, useLenis } from 'lenis/react'

/**
 * SmoothScrollProvider
 * 
 * Provides Lenis smooth scrolling with a cinematic, premium feel.
 * Refined for the "Sovereign/Zen" aesthetic with subtle lerp.
 * 
 * Based on zen-cms implementation but simplified for edge deployment.
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
