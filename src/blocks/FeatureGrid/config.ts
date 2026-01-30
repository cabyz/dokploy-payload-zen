import type { Block } from 'payload'

/**
 * FEATURE GRID BLOCK
 * Bento-style feature showcase for landing pages
 * 
 * Layouts:
 * - grid: Equal-sized cards
 * - bento: Mixed sizes (2-col and 1-col items)
 * - list: Vertical list with icons
 */
export const FeatureGridBlock: Block = {
    slug: 'featureGrid',
    interfaceName: 'FeatureGridBlock',
    labels: {
        singular: 'Feature Grid',
        plural: 'Feature Grids',
    },
    fields: [
        // Section Header
        {
            name: 'sectionTitle',
            type: 'text',
            admin: {
                description: 'Section headline (e.g., "Why Choose Us")',
            },
        },
        {
            name: 'sectionSubtitle',
            type: 'text',
            admin: {
                description: 'Optional supporting text',
            },
        },

        // Layout Style
        {
            name: 'layout',
            type: 'select',
            defaultValue: 'grid',
            options: [
                { label: 'Grid (Equal Size)', value: 'grid' },
                { label: 'Bento (Mixed Sizes)', value: 'bento' },
                { label: 'List (Vertical)', value: 'list' },
            ],
        },

        // Columns
        {
            name: 'columns',
            type: 'select',
            defaultValue: '3',
            admin: {
                condition: (_, siblingData) => siblingData?.layout === 'grid',
            },
            options: [
                { label: '2 Columns', value: '2' },
                { label: '3 Columns', value: '3' },
                { label: '4 Columns', value: '4' },
            ],
        },

        // Features Array
        {
            name: 'features',
            type: 'array',
            minRows: 1,
            maxRows: 12,
            fields: [
                // Icon (Lucide icon name)
                {
                    name: 'icon',
                    type: 'select',
                    required: true,
                    options: [
                        { label: '⚡ Zap', value: 'Zap' },
                        { label: '🎯 Target', value: 'Target' },
                        { label: '🚀 Rocket', value: 'Rocket' },
                        { label: '🛡️ Shield', value: 'ShieldCheck' },
                        { label: '💎 Gem', value: 'Gem' },
                        { label: '📊 Chart', value: 'BarChart3' },
                        { label: '✨ Sparkles', value: 'Sparkles' },
                        { label: '🔧 Settings', value: 'Settings' },
                        { label: '👥 Users', value: 'Users' },
                        { label: '💰 DollarSign', value: 'DollarSign' },
                        { label: '🕐 Clock', value: 'Clock' },
                        { label: '📱 Smartphone', value: 'Smartphone' },
                        { label: '🔒 Lock', value: 'Lock' },
                        { label: '🌐 Globe', value: 'Globe' },
                        { label: '💡 Lightbulb', value: 'Lightbulb' },
                        { label: '🎨 Palette', value: 'Palette' },
                    ],
                },

                // Title
                {
                    name: 'title',
                    type: 'text',
                    required: true,
                    admin: {
                        description: 'Feature name (keep short)',
                    },
                },

                // Description
                {
                    name: 'description',
                    type: 'textarea',
                    admin: {
                        description: 'Brief explanation (1-2 sentences)',
                    },
                },

                // Size (for bento layout)
                {
                    name: 'size',
                    type: 'select',
                    defaultValue: 'md',
                    admin: {
                        condition: (data) => data?.layout === 'bento',
                        description: 'Card size in bento layout',
                    },
                    options: [
                        { label: 'Small (1 col)', value: 'sm' },
                        { label: 'Medium (1 col)', value: 'md' },
                        { label: 'Large (2 cols)', value: 'lg' },
                    ],
                },

                // Accent Color (optional)
                {
                    name: 'accentColor',
                    type: 'select',
                    defaultValue: 'violet',
                    options: [
                        { label: 'Violet', value: 'violet' },
                        { label: 'Blue', value: 'blue' },
                        { label: 'Green', value: 'green' },
                        { label: 'Amber', value: 'amber' },
                        { label: 'Rose', value: 'rose' },
                    ],
                },
            ],
        },
    ],
}
