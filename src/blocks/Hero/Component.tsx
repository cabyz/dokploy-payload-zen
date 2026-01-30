'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@wlf/ui/utils'
import type { HeroBlock as HeroBlockType } from '@/payload-types'

/**
 * SOVEREIGN HERO COMPONENT
 * High-impact hero section with multiple variants
 */

const EASING = [0.23, 1, 0.32, 1] // sovereign easing

export const HeroBlockComponent: React.FC<HeroBlockType> = (props) => {
    const {
        variant = 'centered',
        badge,
        headline,
        subheadline,
        primaryCTA,
        secondaryCTA,
        proofPoints,
        media,
        backgroundStyle,
    } = props

    const containerClasses = cn(
        'relative overflow-hidden',
        variant === 'fullBleed' && 'min-h-screen flex items-center',
        variant === 'centered' && 'py-24 lg:py-32',
        variant === 'split' && 'py-16 lg:py-24',
    )

    const contentClasses = cn(
        'container mx-auto px-4 relative z-10',
        variant === 'centered' && 'text-center max-w-4xl',
        variant === 'split' && 'grid lg:grid-cols-2 gap-12 items-center',
    )

    return (
        <section className={containerClasses}>
            {/* Background for fullBleed */}
            {variant === 'fullBleed' && (
                <div className="absolute inset-0 z-0">
                    {/* Gradient overlay */}
                    <div className={cn(
                        'absolute inset-0 z-10',
                        backgroundStyle?.overlay === 'gradient' && 'bg-gradient-to-b from-zinc-950/80 via-zinc-950/60 to-zinc-950',
                        backgroundStyle?.overlay === 'solid' && 'bg-zinc-950/80',
                    )} />
                    {/* Media background would go here */}
                    <div className="absolute inset-0 bg-zinc-950" />
                </div>
            )}

            <div className={contentClasses}>
                <div className={cn(variant === 'split' && 'space-y-6')}>
                    {/* Badge */}
                    {badge && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, ease: EASING }}
                        >
                            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm font-medium">
                                <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
                                {badge}
                            </span>
                        </motion.div>
                    )}

                    {/* Headline */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1, ease: EASING }}
                        className={cn(
                            'font-bold tracking-tight text-white',
                            variant === 'fullBleed' && 'text-4xl md:text-6xl lg:text-7xl',
                            variant === 'centered' && 'text-4xl md:text-5xl lg:text-6xl mt-6',
                            variant === 'split' && 'text-3xl md:text-4xl lg:text-5xl',
                        )}
                    >
                        {headline}
                    </motion.h1>

                    {/* Subheadline */}
                    {subheadline && (
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2, ease: EASING }}
                            className={cn(
                                'text-zinc-400 leading-relaxed',
                                variant === 'fullBleed' && 'text-lg md:text-xl max-w-2xl mt-6',
                                variant === 'centered' && 'text-lg md:text-xl max-w-2xl mx-auto mt-6',
                                variant === 'split' && 'text-lg mt-4',
                            )}
                        >
                            {subheadline}
                        </motion.p>
                    )}

                    {/* CTAs */}
                    {primaryCTA?.label && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3, ease: EASING }}
                            className={cn(
                                'flex flex-wrap gap-4 mt-8',
                                variant === 'centered' && 'justify-center',
                            )}
                        >
                            <a
                                href={primaryCTA.url || '#'}
                                className={cn(
                                    'inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-all',
                                    primaryCTA.style === 'accent'
                                        ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:from-violet-500 hover:to-purple-500 shadow-lg shadow-violet-500/25'
                                        : 'bg-white text-zinc-900 hover:bg-zinc-100',
                                )}
                            >
                                {primaryCTA.label}
                            </a>

                            {secondaryCTA?.label && (
                                <a
                                    href={secondaryCTA.url || '#'}
                                    className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium border border-zinc-700 text-white hover:bg-zinc-800 transition-all"
                                >
                                    {secondaryCTA.label}
                                </a>
                            )}
                        </motion.div>
                    )}

                    {/* Proof Points */}
                    {proofPoints && proofPoints.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.4, ease: EASING }}
                            className={cn(
                                'flex flex-wrap gap-4 mt-8 text-sm text-zinc-400',
                                variant === 'centered' && 'justify-center',
                            )}
                        >
                            {proofPoints.map((point, index) => (
                                <span key={index} className="flex items-center gap-2">
                                    <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    {point.text}
                                </span>
                            ))}
                        </motion.div>
                    )}
                </div>

                {/* Media for split layout */}
                {variant === 'split' && media && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: EASING }}
                        className="relative aspect-square rounded-2xl overflow-hidden bg-zinc-800"
                    >
                        {/* Media would render here */}
                        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-purple-500/20" />
                    </motion.div>
                )}
            </div>
        </section>
    )
}
