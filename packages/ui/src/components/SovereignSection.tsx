'use client'

import React from 'react'
import { cn } from '../utils'
import { ScrollReveal } from './ScrollReveal'

interface SovereignSectionProps {
    children: React.ReactNode
    id?: string
    className?: string
    containerClassName?: string
    withReveal?: boolean
    revealDelay?: number
    fullHeight?: boolean
    as?: React.ElementType
}

/**
 * SovereignSection Component
 * 
 * The fundamental building block of the Sovereign/Zen UI.
 * Ensures consistent vertical rhythm and interactive "Living" layout.
 * 
 * Features:
 * - Consistent padding/margins
 * - Optional full-height for hero sections
 * - Built-in ScrollReveal animation
 * - Subtle background gradients
 * 
 * Usage:
 *   import { SovereignSection } from '@wlf/ui/section'
 *   
 *   <SovereignSection fullHeight>
 *     <h1>Hero Content</h1>
 *   </SovereignSection>
 */
export function SovereignSection({
    children,
    id,
    className,
    containerClassName,
    withReveal = true,
    revealDelay = 0.1,
    fullHeight = false,
    as: Component = 'section',
}: SovereignSectionProps) {
    const content = withReveal ? (
        <ScrollReveal delay={revealDelay}>
            {children}
        </ScrollReveal>
    ) : children

    return (
        <Component
            id={id}
            className={cn(
                "relative w-full overflow-hidden",
                "py-16 md:py-32 lg:py-48", // Standardized Vertical Rhythm
                fullHeight && "min-h-screen flex flex-col justify-center",
                "bg-zinc-950 text-white", // Zinc-950 Surface
                className
            )}
        >
            {/* Background Micro-interaction (Visual Excellence) */}
            <div className="absolute inset-0 -z-10 pointer-events-none opacity-20">
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-zinc-400/5 blur-[150px] rounded-full" />
            </div>

            <div className={cn(
                "container mx-auto px-6 md:px-12 lg:px-24", // Inner Constraints
                "max-w-7xl",
                containerClassName
            )}>
                {content}
            </div>
        </Component>
    )
}
