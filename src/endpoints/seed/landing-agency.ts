/**
 * Agency Landing Page Seed Data
 * A premium, visual-forward landing page for a creative/digital agency
 */

import type { RequiredDataFromCollectionSlug } from 'payload'
import type { Media } from '@/payload-types'

type LandingAgencyArgs = {
    heroImage?: Media
    metaImage?: Media
}

export const landingAgency: (args: LandingAgencyArgs) => RequiredDataFromCollectionSlug<'pages'> = ({
    heroImage,
    metaImage,
}) => ({
    title: 'Sovereign Creative Agency',
    slug: 'demo-agency',
    _status: 'published',
    hero: {
        type: 'none',
    },
    layout: [
        // ===== HERO BLOCK - SPLIT VARIANT =====
        {
            blockType: 'hero',
            blockName: 'Agency Hero',
            variant: 'split',
            badge: 'Award-Winning Design Studio',
            headline: 'We Build Brands That Command Attention',
            subheadline: 'From strategy to execution, we craft digital experiences that elevate your brand above the noise. Partner with a team that treats your vision like their own.',
            primaryCTA: {
                label: 'Start Your Project',
                url: '/contact',
                style: 'primary',
            },
            secondaryCTA: {
                label: 'View Our Work',
                url: '/portfolio',
            },
            proofPoints: [
                { text: '200+ projects delivered' },
                { text: '98% client satisfaction' },
                { text: 'Clients in 30+ countries' },
            ],
            media: heroImage?.id ?? null,
            backgroundStyle: {
                overlay: 'solid',
            },
        },

        // ===== FEATURE GRID - SERVICES =====
        {
            blockType: 'featureGrid',
            blockName: 'Our Services',
            sectionTitle: 'Full-Spectrum Creative Services',
            sectionSubtitle: 'We do not just design - we strategize, create, and optimize. Everything your brand needs under one roof.',
            layout: 'grid',
            columns: '3',
            features: [
                {
                    icon: 'Palette',
                    title: 'Brand Identity',
                    description: 'Logos, color systems, typography, and brand guidelines that make your brand unforgettable.',
                    size: 'md',
                    accentColor: 'violet',
                },
                {
                    icon: 'Globe',
                    title: 'Web Design',
                    description: 'Stunning, conversion-focused websites built with modern technology and timeless design principles.',
                    size: 'md',
                    accentColor: 'blue',
                },
                {
                    icon: 'Smartphone',
                    title: 'Mobile Apps',
                    description: 'Native and cross-platform apps that users love. Beautiful interfaces meet bulletproof functionality.',
                    size: 'md',
                    accentColor: 'green',
                },
                {
                    icon: 'Target',
                    title: 'Digital Marketing',
                    description: 'SEO, paid media, and content strategy that drives qualified traffic and conversions.',
                    size: 'md',
                    accentColor: 'amber',
                },
                {
                    icon: 'BarChart3',
                    title: 'Analytics and CRO',
                    description: 'Data-driven optimization that turns visitors into customers. Every decision backed by insights.',
                    size: 'md',
                    accentColor: 'rose',
                },
                {
                    icon: 'Lightbulb',
                    title: 'Strategy and Consulting',
                    description: 'Expert guidance on digital transformation, market positioning, and growth strategy.',
                    size: 'md',
                    accentColor: 'violet',
                },
            ],
        },

        // ===== TESTIMONIALS - FEATURED =====
        {
            blockType: 'testimonials',
            blockName: 'Client Testimonials',
            sectionTitle: 'Words From Our Partners',
            sectionSubtitle: 'We measure success by the success of our clients. Here is what they have to say.',
            variant: 'featured',
            testimonials: [
                {
                    quote: 'Working with Sovereign was transformative. They did not just redesign our website - they repositioned our entire brand. Revenue is up 340% since launch.',
                    author: {
                        name: 'Alexandra Petrov',
                        title: 'Founder and CEO',
                        company: 'Luxe Ventures',
                    },
                    rating: 5,
                    featured: true,
                },
                {
                    quote: 'The attention to detail is extraordinary. Every pixel, every interaction, every word was crafted with purpose. They truly care about the craft.',
                    author: {
                        name: 'James Morrison',
                        title: 'Creative Director',
                        company: 'Morrison and Co',
                    },
                    rating: 5,
                    featured: false,
                },
                {
                    quote: 'Our app went from concept to App Store featured in 6 months. Their team moves fast without sacrificing quality. Highly recommend.',
                    author: {
                        name: 'Priya Sharma',
                        title: 'Product Manager',
                        company: 'FinTech Pro',
                    },
                    rating: 5,
                    featured: false,
                },
            ],
            style: {
                showRatings: true,
                showAvatars: true,
                cardStyle: 'outline',
            },
        },

        // ===== FAQ SECTION =====
        {
            blockType: 'faq',
            blockName: 'Common Questions',
            sectionTitle: 'Questions We Get Asked',
            sectionSubtitle: 'No question is too small. Here are answers to the most common ones.',
            layout: 'single',
            items: [
                {
                    question: 'What does your process look like?',
                    answer: 'We follow a 4-phase process: Discovery (understanding your goals), Strategy (defining the approach), Creation (design and development), and Launch (deployment and optimization). Each phase includes client checkpoints to ensure alignment.',
                    defaultOpen: true,
                },
                {
                    question: 'How long does a typical project take?',
                    answer: 'Brand identity projects typically take 4-6 weeks. Websites range from 8-16 weeks depending on complexity. Mobile apps are 12-24 weeks. We also offer accelerated timelines for an additional fee.',
                },
                {
                    question: 'What is your pricing structure?',
                    answer: 'We offer project-based pricing after an initial discovery call. Brand identity starts at $15K, websites at $25K, and apps at $75K. Enterprise and retainer packages are available for ongoing partnerships.',
                },
                {
                    question: 'Do you work with startups?',
                    answer: 'Absolutely! We love working with ambitious startups. We offer startup-friendly packages and can work with equity arrangements for promising early-stage companies.',
                },
                {
                    question: 'What makes Sovereign different?',
                    answer: 'We are designer-founders who have built and sold companies. We understand business, not just aesthetics. Every design decision is tied to a strategic goal - making your investment pay dividends.',
                },
            ],
            bottomCta: {
                enabled: true,
                text: 'Ready to elevate your brand?',
                buttonLabel: 'Book a Discovery Call',
                buttonUrl: '/contact',
            },
        },
    ],
    meta: {
        title: 'Sovereign Creative - Award-Winning Design Studio',
        description: 'We build brands that command attention. From strategy to execution, we craft digital experiences that elevate your brand above the noise.',
        image: metaImage?.id ?? null,
    },
})
