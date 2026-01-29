import type { Block } from 'payload'

import {
    FixedToolbarFeature,
    HeadingFeature,
    InlineToolbarFeature,
    lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const PricingBlock: Block = {
    slug: 'pricing',
    interfaceName: 'PricingBlock',
    labels: {
        singular: 'Pricing Section',
        plural: 'Pricing Sections',
    },
    fields: [
        {
            name: 'title',
            type: 'text',
            required: true,
            defaultValue: 'Simple, Transparent Pricing',
        },
        {
            name: 'subtitle',
            type: 'richText',
            editor: lexicalEditor({
                features: ({ rootFeatures }) => [
                    ...rootFeatures,
                    HeadingFeature({ enabledHeadingSizes: ['h2', 'h3'] }),
                    FixedToolbarFeature(),
                    InlineToolbarFeature(),
                ],
            }),
        },
        {
            name: 'plans',
            type: 'array',
            minRows: 1,
            maxRows: 4,
            admin: {
                initCollapsed: false,
            },
            fields: [
                {
                    name: 'name',
                    type: 'text',
                    required: true,
                },
                {
                    name: 'price',
                    type: 'number',
                    required: true,
                },
                {
                    name: 'period',
                    type: 'select',
                    options: [
                        { label: 'Monthly', value: 'monthly' },
                        { label: 'Yearly', value: 'yearly' },
                        { label: 'One-time', value: 'onetime' },
                    ],
                    defaultValue: 'monthly',
                },
                {
                    name: 'description',
                    type: 'textarea',
                    admin: {
                        description: 'Brief description of this plan',
                    },
                },
                {
                    name: 'features',
                    type: 'array',
                    fields: [
                        {
                            name: 'feature',
                            type: 'text',
                            required: true,
                        },
                        {
                            name: 'included',
                            type: 'checkbox',
                            defaultValue: true,
                        },
                    ],
                },
                {
                    name: 'ctaLabel',
                    type: 'text',
                    defaultValue: 'Get Started',
                },
                {
                    name: 'ctaUrl',
                    type: 'text',
                },
                {
                    name: 'highlighted',
                    type: 'checkbox',
                    defaultValue: false,
                    admin: {
                        description: 'Highlight this plan as "Popular" or "Recommended"',
                    },
                },
            ],
        },
    ],
}
