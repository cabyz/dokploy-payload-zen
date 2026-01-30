import type { Block } from 'payload'

/**
 * SOCIAL PROOF BLOCK
 * Logo bar showing trusted partners/clients
 * 
 * Variants:
 * - scroll: Infinite scroll animation
 * - static: Static grid
 * - fade: Fade in/out carousel
 */
export const SocialProofBlock: Block = {
    slug: 'socialProof',
    interfaceName: 'SocialProofBlock',
    labels: {
        singular: 'Social Proof Bar',
        plural: 'Social Proof Bars',
    },
    fields: [
        // Label
        {
            name: 'label',
            type: 'text',
            defaultValue: 'Trusted by industry leaders',
            admin: {
                description: 'Text above the logos',
            },
        },

        // Variant
        {
            name: 'variant',
            type: 'select',
            defaultValue: 'scroll',
            options: [
                { label: 'Infinite Scroll', value: 'scroll' },
                { label: 'Static Grid', value: 'static' },
                { label: 'Fade Carousel', value: 'fade' },
            ],
        },

        // Logos
        {
            name: 'logos',
            type: 'array',
            minRows: 3,
            maxRows: 12,
            fields: [
                {
                    name: 'logo',
                    type: 'upload',
                    relationTo: 'media',
                    required: true,
                },
                {
                    name: 'name',
                    type: 'text',
                    admin: {
                        description: 'Company name (for alt text)',
                    },
                },
                {
                    name: 'url',
                    type: 'text',
                    admin: {
                        description: 'Optional link to company',
                    },
                },
            ],
        },

        // Style Options
        {
            name: 'style',
            type: 'group',
            fields: [
                {
                    name: 'grayscale',
                    type: 'checkbox',
                    defaultValue: true,
                    admin: {
                        description: 'Display logos in grayscale (more elegant)',
                    },
                },
                {
                    name: 'size',
                    type: 'select',
                    defaultValue: 'md',
                    options: [
                        { label: 'Small', value: 'sm' },
                        { label: 'Medium', value: 'md' },
                        { label: 'Large', value: 'lg' },
                    ],
                },
            ],
        },
    ],
}
