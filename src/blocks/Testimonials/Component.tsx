'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@wlf/ui/utils'
import { Star, Quote } from 'lucide-react'
import type { TestimonialsBlock as TestimonialsBlockType } from '@/payload-types'

/**
 * TESTIMONIALS COMPONENT
 * Customer quotes with carousel/grid/featured variants
 */

const EASING = [0.23, 1, 0.32, 1]

interface TestimonialCardProps {
    quote: string
    author: {
        name: string
        title?: string | null
        company?: string | null
        avatar?: any
    }
    rating?: number | null
    showRating?: boolean
    showAvatar?: boolean
    cardStyle?: 'glass' | 'solid' | 'outline'
    index?: number
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
    quote,
    author,
    rating,
    showRating = true,
    showAvatar = true,
    cardStyle = 'glass',
    index = 0,
}) => {
    const cardClasses = cn(
        'p-6 rounded-2xl h-full',
        cardStyle === 'glass' && 'bg-zinc-900/50 border border-zinc-800 backdrop-blur-sm',
        cardStyle === 'solid' && 'bg-zinc-900',
        cardStyle === 'outline' && 'border-2 border-zinc-800',
    )

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1, ease: EASING }}
            className={cardClasses}
        >
            {/* Quote Icon */}
            <Quote className="w-8 h-8 text-violet-500/30 mb-4" />

            {/* Rating */}
            {showRating && rating && (
                <div className="flex gap-1 mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                            key={i}
                            className={cn(
                                'w-4 h-4',
                                i < rating ? 'text-amber-400 fill-amber-400' : 'text-zinc-700'
                            )}
                        />
                    ))}
                </div>
            )}

            {/* Quote */}
            <p className="text-zinc-300 leading-relaxed mb-6">
                "{quote}"
            </p>

            {/* Author */}
            <div className="flex items-center gap-3">
                {showAvatar && author.avatar && (
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-zinc-800">
                        {typeof author.avatar === 'object' && author.avatar.url && (
                            <img
                                src={author.avatar.url}
                                alt={author.name}
                                className="w-full h-full object-cover"
                            />
                        )}
                    </div>
                )}
                {showAvatar && !author.avatar && (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                        {author.name.charAt(0)}
                    </div>
                )}
                <div>
                    <p className="font-medium text-white">{author.name}</p>
                    {(author.title || author.company) && (
                        <p className="text-sm text-zinc-500">
                            {author.title}
                            {author.title && author.company && ' • '}
                            {author.company}
                        </p>
                    )}
                </div>
            </div>
        </motion.div>
    )
}

export const TestimonialsBlockComponent: React.FC<TestimonialsBlockType> = (props) => {
    const {
        sectionTitle = 'What Our Clients Say',
        sectionSubtitle,
        variant = 'carousel',
        testimonials,
        style,
    } = props

    const showRatings = style?.showRatings !== false
    const showAvatars = style?.showAvatars !== false
    const cardStyle = style?.cardStyle || 'glass'

    // Featured testimonial (if any)
    const featuredTestimonial = testimonials?.find(t => t.featured)
    const regularTestimonials = testimonials?.filter(t => !t.featured) || []

    return (
        <section className="py-24 lg:py-32">
            <div className="container mx-auto px-4">
                {/* Section Header */}
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

                {/* Featured Variant */}
                {variant === 'featured' && featuredTestimonial && (
                    <div className="max-w-3xl mx-auto">
                        <TestimonialCard
                            quote={featuredTestimonial.quote}
                            author={featuredTestimonial.author}
                            rating={featuredTestimonial.rating}
                            showRating={showRatings}
                            showAvatar={showAvatars}
                            cardStyle={cardStyle}
                        />
                    </div>
                )}

                {/* Grid Variant */}
                {variant === 'grid' && (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {testimonials?.map((testimonial, index) => (
                            <TestimonialCard
                                key={index}
                                quote={testimonial.quote}
                                author={testimonial.author}
                                rating={testimonial.rating}
                                showRating={showRatings}
                                showAvatar={showAvatars}
                                cardStyle={cardStyle}
                                index={index}
                            />
                        ))}
                    </div>
                )}

                {/* Carousel Variant (simplified - shows first 3) */}
                {variant === 'carousel' && (
                    <div className="relative">
                        <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
                            {testimonials?.map((testimonial, index) => (
                                <div key={index} className="flex-shrink-0 w-[350px] snap-center">
                                    <TestimonialCard
                                        quote={testimonial.quote}
                                        author={testimonial.author}
                                        rating={testimonial.rating}
                                        showRating={showRatings}
                                        showAvatar={showAvatars}
                                        cardStyle={cardStyle}
                                        index={index}
                                    />
                                </div>
                            ))}
                        </div>
                        {/* Fade edges */}
                        <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-zinc-950 to-transparent pointer-events-none" />
                        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-zinc-950 to-transparent pointer-events-none" />
                    </div>
                )}
            </div>
        </section>
    )
}
