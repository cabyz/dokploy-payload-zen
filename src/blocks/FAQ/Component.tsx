'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@wlf/ui/utils'
import { ChevronDown } from 'lucide-react'
import type { FAQBlock as FAQBlockType } from '@/payload-types'

/**
 * FAQ ACCORDION COMPONENT
 * Expandable FAQ section with smooth animations
 */

const EASING = [0.23, 1, 0.32, 1]

interface FAQItemProps {
    question: string
    answer: string
    isOpen: boolean
    onToggle: () => void
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer, isOpen, onToggle }) => {
    return (
        <div className={cn(
            'border border-zinc-800 rounded-xl overflow-hidden transition-colors',
            isOpen && 'border-zinc-700 bg-zinc-900/50',
        )}>
            <button
                onClick={onToggle}
                className="w-full px-6 py-5 flex items-center justify-between text-left"
            >
                <span className={cn(
                    'font-medium transition-colors',
                    isOpen ? 'text-white' : 'text-zinc-300',
                )}>
                    {question}
                </span>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: EASING }}
                >
                    <ChevronDown className={cn(
                        'w-5 h-5 transition-colors',
                        isOpen ? 'text-violet-400' : 'text-zinc-500',
                    )} />
                </motion.div>
            </button>

            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: EASING }}
                    >
                        <div className="px-6 pb-5 text-zinc-400 leading-relaxed">
                            {answer}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export const FAQBlockComponent: React.FC<FAQBlockType> = (props) => {
    const {
        sectionTitle = 'Frequently Asked Questions',
        sectionSubtitle,
        layout = 'single',
        items,
        bottomCta,
    } = props

    // Track which items are open (support multiple open)
    const [openItems, setOpenItems] = useState<Set<number>>(() => {
        const initial = new Set<number>()
        items?.forEach((item, index) => {
            if (item.defaultOpen) initial.add(index)
        })
        return initial
    })

    const toggleItem = (index: number) => {
        const newOpen = new Set(openItems)
        if (newOpen.has(index)) {
            newOpen.delete(index)
        } else {
            newOpen.add(index)
        }
        setOpenItems(newOpen)
    }

    // Split items for two-column layout
    const midpoint = Math.ceil((items?.length || 0) / 2)
    const leftItems = items?.slice(0, midpoint)
    const rightItems = items?.slice(midpoint)

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

                {/* FAQ Items */}
                {layout === 'double' ? (
                    <div className="grid md:grid-cols-2 gap-4 max-w-5xl mx-auto">
                        <div className="space-y-4">
                            {leftItems?.map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: index * 0.05, ease: EASING }}
                                >
                                    <FAQItem
                                        question={item.question}
                                        answer={item.answer}
                                        isOpen={openItems.has(index)}
                                        onToggle={() => toggleItem(index)}
                                    />
                                </motion.div>
                            ))}
                        </div>
                        <div className="space-y-4">
                            {rightItems?.map((item, index) => {
                                const actualIndex = index + midpoint
                                return (
                                    <motion.div
                                        key={actualIndex}
                                        initial={{ opacity: 0, y: 10 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.4, delay: index * 0.05, ease: EASING }}
                                    >
                                        <FAQItem
                                            question={item.question}
                                            answer={item.answer}
                                            isOpen={openItems.has(actualIndex)}
                                            onToggle={() => toggleItem(actualIndex)}
                                        />
                                    </motion.div>
                                )
                            })}
                        </div>
                    </div>
                ) : (
                    <div className="max-w-3xl mx-auto space-y-4">
                        {items?.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: index * 0.05, ease: EASING }}
                            >
                                <FAQItem
                                    question={item.question}
                                    answer={item.answer}
                                    isOpen={openItems.has(index)}
                                    onToggle={() => toggleItem(index)}
                                />
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Bottom CTA */}
                {bottomCta?.enabled && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.3, ease: EASING }}
                        className="text-center mt-12"
                    >
                        <p className="text-zinc-400 mb-4">{bottomCta.text}</p>
                        {bottomCta.buttonLabel && bottomCta.buttonUrl && (
                            <a
                                href={bottomCta.buttonUrl}
                                className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium border border-zinc-700 text-white hover:bg-zinc-800 transition-all"
                            >
                                {bottomCta.buttonLabel}
                            </a>
                        )}
                    </motion.div>
                )}
            </div>
        </section>
    )
}
