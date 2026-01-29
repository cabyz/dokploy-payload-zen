'use client'

import React, { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { cn } from '@/utilities/ui'

interface ScrollRevealProps {
    children: React.ReactNode
    className?: string
    delay?: number
    direction?: 'up' | 'down' | 'left' | 'right' | 'none'
    distance?: number
    duration?: number
}

/**
 * ScrollReveal Component
 * 
 * Provides scroll-triggered fade-in animations.
 * Pairs with Lenis smooth scroll for cinematic reveal effects.
 * 
 * Usage:
 *   <ScrollReveal direction="up" delay={0.2}>
 *     <h1>Headline</h1>
 *   </ScrollReveal>
 */
export function ScrollReveal({
    children,
    className,
    delay = 0,
    direction = 'up',
    distance = 24,
    duration = 0.8,
}: ScrollRevealProps) {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: '-10%' })

    const directionOffset = {
        up: { y: distance },
        down: { y: -distance },
        left: { x: distance },
        right: { x: -distance },
        none: {},
    }

    return (
        <motion.div
            ref={ref}
            initial={{
                opacity: 0,
                ...directionOffset[direction]
            }}
            animate={isInView ? {
                opacity: 1,
                x: 0,
                y: 0
            } : {}}
            transition={{
                duration,
                delay,
                ease: [0.21, 0.47, 0.32, 0.98], // Sovereign Cinematic Easing
            }}
            className={cn(className)}
        >
            {children}
        </motion.div>
    )
}
