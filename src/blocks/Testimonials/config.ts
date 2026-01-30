import type { Block } from 'payload'

/**
 * TESTIMONIALS BLOCK
 * Social proof through customer quotes
 * 
 * Variants:
 * - carousel: Swipeable testimonials
 * - grid: Static grid of cards
 * - featured: Single large testimonial
 */
export const TestimonialsBlock: Block = {
    slug: 'testimonials',
    interfaceName: 'TestimonialsBlock',
    labels: {
        singular: 'Testimonials',
        plural: 'Testimonials',
    },
    fields: [
        // Section Header
        {
            name: 'sectionTitle',
            type: 'text',
            defaultValue: 'What Our Clients Say',
        },
        {
            name: 'sectionSubtitle',
            type: 'text',
        },

        // Layout Variant
        {
            name: 'variant',
            type: 'select',
            defaultValue: 'carousel',
            options: [
                { label: 'Carousel', value: 'carousel' },
                { label: 'Grid', value: 'grid' },
                { label: 'Single Featured', value: 'featured' },
            ],
        },

        // Testimonial Items
        {
            name: 'testimonials',
            type: 'array',
            minRows: 1,
            maxRows: 12,
            fields: [
                // Quote
                {
                    name: 'quote',
                    type: 'textarea',
                    required: true,
                    admin: {
                        description: 'The testimonial text',
                    },
                },

                // Author Info
                {
                    name: 'author',
                    type: 'group',
                    fields: [
                        {
                            name: 'name',
                            type: 'text',
                            required: true,
                        },
                        {
                            name: 'title',
                            type: 'text',
                            admin: {
                                description: 'Job title (e.g., "CEO")',
                            },
                        },
                        {
                            name: 'company',
                            type: 'text',
                        },
                        {
                            name: 'avatar',
                            type: 'upload',
                            relationTo: 'media',
                        },
                    ],
                },

                // Rating (optional)
                {
                    name: 'rating',
                    type: 'number',
                    min: 1,
                    max: 5,
                    admin: {
                        description: 'Star rating (1-5)',
                    },
                },

                // Featured flag
                {
                    name: 'featured',
                    type: 'checkbox',
                    defaultValue: false,
                    admin: {
                        description: 'Show this testimonial prominently',
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
                    name: 'showRatings',
                    type: 'checkbox',
                    defaultValue: true,
                },
                {
                    name: 'showAvatars',
                    type: 'checkbox',
                    defaultValue: true,
                },
                {
                    name: 'cardStyle',
                    type: 'select',
                    defaultValue: 'glass',
                    options: [
                        { label: 'Glass', value: 'glass' },
                        { label: 'Solid', value: 'solid' },
                        { label: 'Outline', value: 'outline' },
                    ],
                },
            ],
        },
    ],
}
