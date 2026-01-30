/**
 * SaaS Landing Page Seed Data
 * A complete, visually stunning landing page for a B2B SaaS product
 */

import type { RequiredDataFromCollectionSlug } from 'payload'
import type { Media } from '@/payload-types'

type LandingSaasArgs = {
    heroImage?: Media
    metaImage?: Media
}

export const landingSaas: (args: LandingSaasArgs) => RequiredDataFromCollectionSlug<'pages'> = ({
    heroImage,
    metaImage,
}) => ({
    title: 'Accelerate Your Growth with ZenFlow',
    slug: 'demo-saas',
    _status: 'published',
    hero: {
        type: 'none',
    },
    layout: [
        // ===== HERO BLOCK =====
        {
            blockType: 'hero',
            blockName: 'SaaS Hero',
            variant: 'centered',
            badge: 'Now with AI-Powered Insights',
            headline: 'Scale Your Business 10x Faster',
            subheadline: 'ZenFlow combines automation, analytics, and AI to help high-growth companies operate at peak efficiency. Join 2,500+ teams who have transformed their operations.',
            primaryCTA: {
                label: 'Start Free Trial',
                url: '/signup',
                style: 'accent',
            },
            secondaryCTA: {
                label: 'Watch Demo',
                url: '/demo',
            },
            proofPoints: [
                { text: '14-day free trial' },
                { text: 'No credit card required' },
                { text: 'Cancel anytime' },
            ],
            media: heroImage?.id ?? null,
            backgroundStyle: {
                overlay: 'gradient',
            },
        },

        // ===== FEATURE GRID - BENTO LAYOUT =====
        {
            blockType: 'featureGrid',
            blockName: 'Core Features',
            sectionTitle: 'Everything You Need to Scale',
            sectionSubtitle: 'Powerful tools designed for modern teams. Built for speed, security, and simplicity.',
            layout: 'bento',
            columns: '3',
            features: [
                {
                    icon: 'Zap',
                    title: 'Lightning Fast',
                    description: 'Process millions of operations in milliseconds. Our infrastructure is built for enterprise-scale.',
                    size: 'lg',
                    accentColor: 'violet',
                },
                {
                    icon: 'ShieldCheck',
                    title: 'Bank-Grade Security',
                    description: 'SOC 2 Type II certified. Your data is encrypted at rest and in transit.',
                    size: 'md',
                    accentColor: 'blue',
                },
                {
                    icon: 'BarChart3',
                    title: 'Real-Time Analytics',
                    description: 'Dashboards that update in real-time. Make decisions with live data.',
                    size: 'md',
                    accentColor: 'green',
                },
                {
                    icon: 'Users',
                    title: 'Team Collaboration',
                    description: 'Unlimited seats included. Collaborate with your entire organization seamlessly.',
                    size: 'sm',
                    accentColor: 'amber',
                },
                {
                    icon: 'Globe',
                    title: 'Global CDN',
                    description: 'Content delivered from 200+ edge locations worldwide.',
                    size: 'sm',
                    accentColor: 'rose',
                },
                {
                    icon: 'Sparkles',
                    title: 'AI Insights',
                    description: 'Machine learning models that learn your patterns and suggest optimizations.',
                    size: 'sm',
                    accentColor: 'violet',
                },
            ],
        },

        // ===== TESTIMONIALS - CAROUSEL =====
        {
            blockType: 'testimonials',
            blockName: 'Customer Stories',
            sectionTitle: 'Trusted by Industry Leaders',
            sectionSubtitle: 'See why the world\'s most innovative companies choose ZenFlow.',
            variant: 'carousel',
            testimonials: [
                {
                    quote: 'ZenFlow transformed our operations. We have reduced processing time by 80% and our team can finally focus on strategic work instead of firefighting.',
                    author: {
                        name: 'Sarah Chen',
                        title: 'VP of Operations',
                        company: 'TechCorp Inc.',
                    },
                    rating: 5,
                    featured: true,
                },
                {
                    quote: 'The ROI was immediate. Within 30 days, we had automated our entire workflow and reclaimed 40+ hours per week across the team.',
                    author: {
                        name: 'Marcus Johnson',
                        title: 'CEO',
                        company: 'GrowthLab',
                    },
                    rating: 5,
                    featured: false,
                },
                {
                    quote: 'I have used dozens of tools in my career. ZenFlow is the first one that actually delivers on its promises. The AI features are genuinely useful.',
                    author: {
                        name: 'Elena Rodriguez',
                        title: 'Head of Product',
                        company: 'Innovate.io',
                    },
                    rating: 5,
                    featured: false,
                },
                {
                    quote: 'Support is incredible. Any time we have a question, they respond within minutes with a real solution. This level of service is rare.',
                    author: {
                        name: 'David Kim',
                        title: 'CTO',
                        company: 'NextGen Systems',
                    },
                    rating: 5,
                    featured: false,
                },
            ],
            style: {
                showRatings: true,
                showAvatars: true,
                cardStyle: 'glass',
            },
        },

        // ===== FAQ SECTION =====
        {
            blockType: 'faq',
            blockName: 'Common Questions',
            sectionTitle: 'Frequently Asked Questions',
            sectionSubtitle: 'Everything you need to know about ZenFlow. Can\'t find what you\'re looking for? Contact our support team.',
            layout: 'double',
            items: [
                {
                    question: 'How does the free trial work?',
                    answer: 'Start with a 14-day free trial with full access to all features. No credit card required. If you decide ZenFlow is not for you, simply do not upgrade - your trial will end automatically.',
                    defaultOpen: true,
                },
                {
                    question: 'Can I change plans later?',
                    answer: 'Absolutely! You can upgrade, downgrade, or cancel your plan at any time. Changes take effect immediately and we will prorate any billing adjustments.',
                },
                {
                    question: 'Is my data secure?',
                    answer: 'Yes. We use AES-256 encryption, are SOC 2 Type II certified, and undergo regular third-party security audits. Data is stored in geographically redundant data centers.',
                },
                {
                    question: 'Do you offer enterprise plans?',
                    answer: 'Yes, we offer custom enterprise plans with dedicated support, SLAs, and advanced security features. Contact our sales team for a custom quote.',
                },
                {
                    question: 'What integrations do you support?',
                    answer: 'We integrate with 100+ popular tools including Salesforce, HubSpot, Slack, Microsoft 365, Google Workspace, Zapier, and many more. We also offer a robust REST API.',
                },
                {
                    question: 'How fast is onboarding?',
                    answer: 'Most teams are fully onboarded within 1-2 hours. We provide interactive tutorials, dedicated onboarding support, and a comprehensive knowledge base.',
                },
            ],
            bottomCta: {
                enabled: true,
                text: 'Still have questions? Our team is here to help.',
                buttonLabel: 'Contact Sales',
                buttonUrl: '/contact',
            },
        },
    ],
    meta: {
        title: 'ZenFlow - Scale Your Business 10x Faster',
        description: 'ZenFlow combines automation, analytics, and AI to help high-growth companies operate at peak efficiency. Start your free trial today.',
        image: metaImage?.id ?? null,
    },
})
