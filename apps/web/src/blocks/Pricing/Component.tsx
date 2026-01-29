import React from 'react'
import type { PricingBlock as PricingBlockProps } from '@/payload-types'
import RichText from '@/components/RichText'
import { cn } from '@/utilities/ui'

export const PricingBlockComponent: React.FC<PricingBlockProps> = ({
    title,
    subtitle,
    plans,
}) => {
    return (
        <section className="py-24">
            <div className="container">
                {/* Header */}
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    {title && (
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                            {title}
                        </h2>
                    )}
                    {subtitle && (
                        <div className="text-lg text-muted-foreground">
                            <RichText data={subtitle} enableGutter={false} />
                        </div>
                    )}
                </div>

                {/* Plans Grid */}
                <div
                    className={cn(
                        'grid gap-8 items-stretch',
                        plans?.length === 1 && 'max-w-md mx-auto',
                        plans?.length === 2 && 'md:grid-cols-2 max-w-4xl mx-auto',
                        plans?.length === 3 && 'lg:grid-cols-3',
                        plans?.length === 4 && 'md:grid-cols-2 xl:grid-cols-4',
                    )}
                >
                    {plans?.map((plan, i) => (
                        <div
                            key={i}
                            className={cn(
                                'relative rounded-2xl p-8 flex flex-col transition-all duration-300',
                                plan.highlighted
                                    ? 'bg-gradient-to-b from-primary/10 to-primary/5 border-2 border-primary shadow-xl shadow-primary/10 scale-[1.02] z-10'
                                    : 'bg-card border border-border hover:border-primary/30 hover:shadow-lg',
                            )}
                        >
                            {/* Popular Badge */}
                            {plan.highlighted && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                    <span className="bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full">
                                        Most Popular
                                    </span>
                                </div>
                            )}

                            {/* Plan Name */}
                            <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>

                            {/* Description */}
                            {plan.description && (
                                <p className="text-muted-foreground text-sm mb-4">{plan.description}</p>
                            )}

                            {/* Price */}
                            <div className="mb-6">
                                <span className="text-5xl font-bold">${plan.price}</span>
                                {plan.period && plan.period !== 'onetime' && (
                                    <span className="text-muted-foreground ml-1">
                                        /{plan.period === 'monthly' ? 'mo' : 'yr'}
                                    </span>
                                )}
                            </div>

                            {/* Features */}
                            <ul className="space-y-3 mb-8 flex-grow">
                                {plan.features?.map((f, j) => (
                                    <li key={j} className="flex items-start gap-3">
                                        <span
                                            className={cn(
                                                'mt-0.5 flex-shrink-0',
                                                f.included ? 'text-green-500' : 'text-muted-foreground',
                                            )}
                                        >
                                            {f.included ? (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            ) : (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            )}
                                        </span>
                                        <span className={cn(!f.included && 'text-muted-foreground line-through')}>
                                            {f.feature}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            {/* CTA Button */}
                            {plan.ctaUrl && (
                                <a
                                    href={plan.ctaUrl}
                                    className={cn(
                                        'block text-center py-3 px-6 rounded-xl font-semibold transition-all duration-200',
                                        plan.highlighted
                                            ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25'
                                            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
                                    )}
                                >
                                    {plan.ctaLabel || 'Get Started'}
                                </a>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
