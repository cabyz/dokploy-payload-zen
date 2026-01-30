import type { Block } from 'payload'

/**
 * SOVEREIGN HERO BLOCK
 * High-impact hero section for landing pages
 * 
 * Variants:
 * - fullBleed: Full viewport height with gradient
 * - centered: Centered content with optional media
 * - split: 50/50 text + media layout
 */
export const HeroBlock: Block = {
    slug: 'hero',
    interfaceName: 'HeroBlock',
    labels: {
        singular: 'Hero Section',
        plural: 'Hero Sections',
    },
    fields: [
        // Variant Selection
        {
            name: 'variant',
            type: 'select',
            required: true,
            defaultValue: 'centered',
            options: [
                { label: 'Full Bleed (Dark)', value: 'fullBleed' },
                { label: 'Centered', value: 'centered' },
                { label: 'Split (Text + Media)', value: 'split' },
            ],
        },

        // Optional Badge
        {
            name: 'badge',
            type: 'text',
            admin: {
                description: 'Optional small text above headline (e.g., "New for 2026")',
            },
        },

        // Main Headline
        {
            name: 'headline',
            type: 'text',
            required: true,
            admin: {
                description: 'Primary headline - keep it punchy',
            },
        },

        // Subheadline
        {
            name: 'subheadline',
            type: 'textarea',
            admin: {
                description: 'Supporting text that expands on the headline',
            },
        },

        // Primary CTA
        {
            name: 'primaryCTA',
            type: 'group',
            fields: [
                { name: 'label', type: 'text', required: true, defaultValue: 'Get Started' },
                { name: 'url', type: 'text', required: true },
                {
                    name: 'style',
                    type: 'select',
                    defaultValue: 'primary',
                    options: [
                        { label: 'Primary (Filled)', value: 'primary' },
                        { label: 'Accent (Gradient)', value: 'accent' },
                    ],
                },
            ],
        },

        // Secondary CTA (Optional)
        {
            name: 'secondaryCTA',
            type: 'group',
            admin: {
                condition: (_, siblingData) => siblingData?.primaryCTA?.label,
            },
            fields: [
                { name: 'label', type: 'text' },
                { name: 'url', type: 'text' },
            ],
        },

        // Social Proof Points
        {
            name: 'proofPoints',
            type: 'array',
            maxRows: 4,
            admin: {
                description: 'Quick trust builders (✓ 500+ clients)',
            },
            fields: [
                { name: 'text', type: 'text', required: true },
            ],
        },

        // Background Media (for fullBleed/split)
        {
            name: 'media',
            type: 'upload',
            relationTo: 'media',
            admin: {
                condition: (_, siblingData) => ['fullBleed', 'split'].includes(siblingData?.variant),
                description: 'Background image or video',
            },
        },

        // Background Style
        {
            name: 'backgroundStyle',
            type: 'group',
            admin: {
                condition: (_, siblingData) => siblingData?.variant === 'fullBleed',
            },
            fields: [
                {
                    name: 'overlay',
                    type: 'select',
                    defaultValue: 'gradient',
                    options: [
                        { label: 'Dark Gradient', value: 'gradient' },
                        { label: 'Solid Dark', value: 'solid' },
                        { label: 'None', value: 'none' },
                    ],
                },
            ],
        },
    ],
}
