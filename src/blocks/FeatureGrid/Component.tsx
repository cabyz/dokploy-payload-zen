'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@wlf/ui/utils'
import {
    Zap, Target, Rocket, ShieldCheck, Gem, BarChart3,
    Sparkles, Settings, Users, DollarSign, Clock,
    Smartphone, Lock, Globe, Lightbulb, Palette,
    type LucideIcon
} from 'lucide-react'
import type { FeatureGridBlock as FeatureGridBlockType } from '@/payload-types'

/**
 * FEATURE GRID COMPONENT
 * Bento-style feature showcase
 */

const EASING = [0.23, 1, 0.32, 1]

const iconMap: Record<string, LucideIcon> = {
    Zap, Target, Rocket, ShieldCheck, Gem, BarChart3,
    Sparkles, Settings, Users, DollarSign, Clock,
    Smartphone, Lock, Globe, Lightbulb, Palette,
}

const accentColors: Record<string, string> = {
    violet: 'from-violet-500/20 to-purple-500/20 border-violet-500/30',
    blue: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30',
    green: 'from-green-500/20 to-emerald-500/20 border-green-500/30',
    amber: 'from-amber-500/20 to-orange-500/20 border-amber-500/30',
    rose: 'from-rose-500/20 to-pink-500/20 border-rose-500/30',
}

const iconColors: Record<string, string> = {
    violet: 'text-violet-400',
    blue: 'text-blue-400',
    green: 'text-green-400',
    amber: 'text-amber-400',
    rose: 'text-rose-400',
}

export const FeatureGridBlockComponent: React.FC<FeatureGridBlockType> = (props) => {
    const {
        sectionTitle,
        sectionSubtitle,
        layout = 'grid',
        columns = '3',
        features,
    } = props

    const gridClasses = cn(
        'grid gap-6',
        layout === 'grid' && columns === '2' && 'md:grid-cols-2',
        layout === 'grid' && columns === '3' && 'md:grid-cols-2 lg:grid-cols-3',
        layout === 'grid' && columns === '4' && 'md:grid-cols-2 lg:grid-cols-4',
        layout === 'list' && 'grid-cols-1 max-w-2xl mx-auto',
        layout === 'bento' && 'md:grid-cols-2 lg:grid-cols-3',
    )

    return (
        <section className="py-24 lg:py-32">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                {(sectionTitle || sectionSubtitle) && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, ease: EASING }}
                        className="text-center mb-16"
                    >
                        {sectionTitle && (
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                                {sectionTitle}
                            </h2>
                        )}
                        {sectionSubtitle && (
                            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
                                {sectionSubtitle}
                            </p>
                        )}
                    </motion.div>
                )}

                {/* Features Grid */}
                <div className={gridClasses}>
                    {features?.map((feature, index) => {
                        const IconComponent = iconMap[feature.icon] || Sparkles
                        const accent = feature.accentColor || 'violet'
                        const isLarge = layout === 'bento' && feature.size === 'lg'

                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1, ease: EASING }}
                                className={cn(
                                    'group relative p-6 rounded-2xl border bg-gradient-to-br transition-all duration-300',
                                    'hover:scale-[1.02] hover:shadow-lg',
                                    accentColors[accent],
                                    isLarge && 'md:col-span-2',
                                )}
                            >
                                {/* Icon */}
                                <div className={cn(
                                    'w-12 h-12 rounded-xl flex items-center justify-center mb-4',
                                    'bg-zinc-900/50 border border-zinc-800',
                                )}>
                                    <IconComponent className={cn('w-6 h-6', iconColors[accent])} />
                                </div>

                                {/* Content */}
                                <h3 className="text-lg font-semibold text-white mb-2">
                                    {feature.title}
                                </h3>

                                {feature.description && (
                                    <p className="text-zinc-400 text-sm leading-relaxed">
                                        {feature.description}
                                    </p>
                                )}

                                {/* Hover glow effect */}
                                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                                    <div className={cn(
                                        'absolute inset-0 rounded-2xl blur-xl',
                                        accent === 'violet' && 'bg-violet-500/10',
                                        accent === 'blue' && 'bg-blue-500/10',
                                        accent === 'green' && 'bg-green-500/10',
                                        accent === 'amber' && 'bg-amber-500/10',
                                        accent === 'rose' && 'bg-rose-500/10',
                                    )} />
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
