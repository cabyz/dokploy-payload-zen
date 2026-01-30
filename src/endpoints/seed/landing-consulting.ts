/**
 * Consulting/Professional Services Landing Page Seed Data
 * A trust-focused landing page for B2B consulting firms
 */

import type { RequiredDataFromCollectionSlug } from 'payload'
import type { Media } from '@/payload-types'

type LandingConsultingArgs = {
    heroImage?: Media
    metaImage?: Media
}

export const landingConsulting: (args: LandingConsultingArgs) => RequiredDataFromCollectionSlug<'pages'> = ({
    heroImage,
    metaImage,
}) => ({
    title: 'Wolf Consulting - Strategic Growth Partners',
    slug: 'demo-consulting',
    _status: 'published',
    hero: {
        type: 'none',
    },
    layout: [
        // ===== HERO BLOCK - FULL BLEED =====
        {
            blockType: 'hero',
            blockName: 'Consulting Hero',
            variant: 'fullBleed',
            badge: 'Trusted by Fortune 500 Companies',
            headline: 'Strategic Consulting for the AI Era',
            subheadline: 'Navigate digital transformation with confidence. Our team of ex-McKinsey, ex-Google, and ex-Amazon leaders has guided 200+ companies through pivotal moments.',
            primaryCTA: {
                label: 'Schedule Consultation',
                url: '/consultation',
                style: 'primary',
            },
            secondaryCTA: {
                label: 'Download Case Studies',
                url: '/case-studies',
            },
            proofPoints: [
                { text: '$2.3B+ value created for clients' },
                { text: '200+ enterprise engagements' },
                { text: 'NPS score of 87' },
            ],
            media: heroImage?.id ?? null,
            backgroundStyle: {
                overlay: 'gradient',
            },
        },

        // ===== FEATURE GRID - PRACTICE AREAS =====
        {
            blockType: 'featureGrid',
            blockName: 'Practice Areas',
            sectionTitle: 'Our Practice Areas',
            sectionSubtitle: 'Deep expertise across the disciplines that matter most in today\'s business landscape.',
            layout: 'list',
            columns: '2',
            features: [
                {
                    icon: 'Rocket',
                    title: 'Digital Transformation',
                    description: 'End-to-end digital strategy from assessment to implementation. We help legacy organizations become digital-first without disrupting operations.',
                    size: 'lg',
                    accentColor: 'blue',
                },
                {
                    icon: 'Sparkles',
                    title: 'AI and Machine Learning',
                    description: 'Practical AI implementation that drives ROI. We cut through the hype to identify high-impact use cases for your specific context.',
                    size: 'lg',
                    accentColor: 'violet',
                },
                {
                    icon: 'Settings',
                    title: 'Operations Excellence',
                    description: 'Process optimization, supply chain transformation, and operational efficiency improvements that drop straight to the bottom line.',
                    size: 'lg',
                    accentColor: 'green',
                },
                {
                    icon: 'DollarSign',
                    title: 'M and A Advisory',
                    description: 'Due diligence, integration planning, and post-merger optimization. We help you capture full value from transactions.',
                    size: 'lg',
                    accentColor: 'amber',
                },
            ],
        },

        // ===== TESTIMONIALS - GRID =====
        {
            blockType: 'testimonials',
            blockName: 'Client Results',
            sectionTitle: 'What Our Clients Say',
            sectionSubtitle: 'Real results from real engagements. Names and companies shared with permission.',
            variant: 'grid',
            testimonials: [
                {
                    quote: 'Wolf Consulting helped us navigate the most complex acquisition in our company history. Their M and A team was invaluable - we captured 40% more synergies than initially projected.',
                    author: {
                        name: 'Michael Torres',
                        title: 'CFO',
                        company: 'Global Manufacturing Corp',
                    },
                    rating: 5,
                    featured: true,
                },
                {
                    quote: 'Their AI strategy work cut through the noise. Instead of chasing trends, they identified three high-impact use cases that paid for the entire engagement within 6 months.',
                    author: {
                        name: 'Rachel Kim',
                        title: 'Chief Digital Officer',
                        company: 'National Retail Group',
                    },
                    rating: 5,
                    featured: false,
                },
                {
                    quote: 'The operations team identified $47M in annual savings within the first 90 days. Their Process Excellence methodology is the most rigorous I have seen.',
                    author: {
                        name: 'David Okonkwo',
                        title: 'COO',
                        company: 'Healthcare Systems Inc',
                    },
                    rating: 5,
                    featured: false,
                },
                {
                    quote: 'What sets Wolf apart is their implementation focus. Most consultants leave you with a deck. Wolf stayed through execution and drove measurable outcomes.',
                    author: {
                        name: 'Jennifer Walsh',
                        title: 'CEO',
                        company: 'TechStart Holdings',
                    },
                    rating: 5,
                    featured: false,
                },
            ],
            style: {
                showRatings: false,
                showAvatars: true,
                cardStyle: 'solid',
            },
        },

        // ===== FAQ SECTION =====
        {
            blockType: 'faq',
            blockName: 'Engagement FAQ',
            sectionTitle: 'Engagement Questions',
            sectionSubtitle: 'Common questions about working with Wolf Consulting.',
            layout: 'double',
            items: [
                {
                    question: 'What does a typical engagement look like?',
                    answer: 'Engagements typically run 8-12 weeks and include diagnostic work, strategy development, and an implementation roadmap. Longer transformation programs run 6-18 months with dedicated team members embedded in your organization.',
                    defaultOpen: true,
                },
                {
                    question: 'How do you structure your fees?',
                    answer: 'We offer fixed-fee project engagements, monthly retainers, and value-based fee arrangements tied to measurable outcomes. Most clients prefer a hybrid model with a base fee plus performance bonus.',
                },
                {
                    question: 'What makes Wolf different from other firms?',
                    answer: 'Three things: senior-only teams (no juniors learning on your dime), implementation focus (we measure success by outcomes, not decks), and deep specialization (we do four things and do them exceptionally well).',
                },
                {
                    question: 'Do you work with mid-market companies?',
                    answer: 'Yes. While we serve many Fortune 500 clients, our sweet spot is growth-stage companies doing $50M-$500M in revenue who face scaling challenges typically reserved for larger enterprises.',
                },
                {
                    question: 'How do we get started?',
                    answer: 'Book a 30-minute diagnostic call with a Partner. We will discuss your challenges and determine if there is a fit. If so, we will propose a scoped engagement within one week.',
                },
                {
                    question: 'What industries do you specialize in?',
                    answer: 'We have deep expertise in healthcare, financial services, manufacturing, and technology. However, our methodologies are industry-agnostic and we have delivered results across 20+ sectors.',
                },
            ],
            bottomCta: {
                enabled: true,
                text: 'Ready to accelerate your transformation?',
                buttonLabel: 'Schedule a Partner Call',
                buttonUrl: '/consultation',
            },
        },
    ],
    meta: {
        title: 'Wolf Consulting - Strategic Growth Partners',
        description: 'Navigate digital transformation with confidence. Our team of ex-McKinsey, ex-Google, and ex-Amazon leaders has guided 200+ companies through pivotal moments.',
        image: metaImage?.id ?? null,
    },
})
