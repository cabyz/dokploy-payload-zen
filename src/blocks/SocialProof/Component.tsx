'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@wlf/ui/utils'
import type { SocialProofBlock as SocialProofBlockType } from '@/payload-types'

/**
 * SOCIAL PROOF COMPONENT
 * Logo bar with infinite scroll animation
 */

const EASING = [0.23, 1, 0.32, 1]

export const SocialProofBlockComponent: React.FC<SocialProofBlockType> = (props) => {
    const {
        label = 'Trusted by industry leaders',
        variant = 'scroll',
        logos,
        style,
    } = props

    const logoSizeClass = cn(
        'h-auto object-contain',
        style?.size === 'sm' && 'max-h-6',
        style?.size === 'md' && 'max-h-8',
        style?.size === 'lg' && 'max-h-10',
        !style?.size && 'max-h-8',
    )

    const logoFilterClass = style?.grayscale !== false
        ? 'grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300'
        : ''

    // For scroll variant, duplicate logos for seamless loop
    const scrollLogos = variant === 'scroll' ? [...(logos || []), ...(logos || [])] : logos

    return (
        <section className="py-12 lg:py-16 border-y border-zinc-800/50">
            <div className="container mx-auto px-4">
                {/* Label */}
                {label && (
                    <motion.p
                        initial={{ opacity: 0. }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, ease: EASING }}
                        className="text-center text-sm text-zinc-500 uppercase tracking-wider mb-8"
                    >
                        {label}
                    </motion.p>
                )}

                {/* Logos */}
                {variant === 'scroll' ? (
                    // Infinite scroll
                    <div className="relative overflow-hidden">
                        <div className="flex gap-16 animate-scroll">
                            {scrollLogos?.map((logoItem, index) => (
                                <div
                                    key={index}
                                    className={cn('flex-shrink-0 flex items-center justify-center px-4', logoFilterClass)}
                                >
                                    {logoItem.logo && typeof logoItem.logo === 'object' && (
                                        <img
                                            src={logoItem.logo.url || ''}
                                            alt={logoItem.name || 'Partner logo'}
                                            className={logoSizeClass}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                        {/* Fade edges */}
                        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-zinc-950 to-transparent pointer-events-none" />
                        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-zinc-950 to-transparent pointer-events-none" />
                    </div>
                ) : variant === 'static' ? (
                    // Static grid
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, ease: EASING }}
                        className="flex flex-wrap justify-center items-center gap-12"
                    >
                        {logos?.map((logoItem, index) => (
                            <div
                                key={index}
                                className={cn('flex items-center justify-center', logoFilterClass)}
                            >
                                {logoItem.logo && typeof logoItem.logo === 'object' && (
                                    <img
                                        src={logoItem.logo.url || ''}
                                        alt={logoItem.name || 'Partner logo'}
                                        className={logoSizeClass}
                                    />
                                )}
                            </div>
                        ))}
                    </motion.div>
                ) : (
                    // Fade carousel (simplified - just show first for now)
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, ease: EASING }}
                        className="flex justify-center items-center gap-12"
                    >
                        {logos?.slice(0, 5).map((logoItem, index) => (
                            <div
                                key={index}
                                className={cn('flex items-center justify-center', logoFilterClass)}
                            >
                                {logoItem.logo && typeof logoItem.logo === 'object' && (
                                    <img
                                        src={logoItem.logo.url || ''}
                                        alt={logoItem.name || 'Partner logo'}
                                        className={logoSizeClass}
                                    />
                                )}
                            </div>
                        ))}
                    </motion.div>
                )}
            </div>

            {/* CSS for scroll animation */}
            <style jsx>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
        </section>
    )
}
