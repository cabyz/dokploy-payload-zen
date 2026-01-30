import type { Block } from 'payload'

/**
 * FAQ BLOCK
 * Accordion-style FAQ section
 * Great for SEO and reducing support load
 */
export const FAQBlock: Block = {
    slug: 'faq',
    interfaceName: 'FAQBlock',
    labels: {
        singular: 'FAQ Section',
        plural: 'FAQ Sections',
    },
    fields: [
        // Section Header
        {
            name: 'sectionTitle',
            type: 'text',
            defaultValue: 'Frequently Asked Questions',
        },
        {
            name: 'sectionSubtitle',
            type: 'text',
            admin: {
                description: 'Optional supporting text',
            },
        },

        // Layout
        {
            name: 'layout',
            type: 'select',
            defaultValue: 'single',
            options: [
                { label: 'Single Column', value: 'single' },
                { label: 'Two Columns', value: 'double' },
            ],
        },

        // FAQ Items
        {
            name: 'items',
            type: 'array',
            minRows: 1,
            maxRows: 20,
            fields: [
                {
                    name: 'question',
                    type: 'text',
                    required: true,
                    admin: {
                        description: 'The question being asked',
                    },
                },
                {
                    name: 'answer',
                    type: 'textarea',
                    required: true,
                    admin: {
                        description: 'The answer (supports basic markdown)',
                    },
                },
                {
                    name: 'defaultOpen',
                    type: 'checkbox',
                    defaultValue: false,
                    admin: {
                        description: 'Show this item expanded by default',
                    },
                },
            ],
        },

        // Optional CTA
        {
            name: 'bottomCta',
            type: 'group',
            admin: {
                description: 'Optional call-to-action below FAQs',
            },
            fields: [
                {
                    name: 'enabled',
                    type: 'checkbox',
                    defaultValue: false,
                },
                {
                    name: 'text',
                    type: 'text',
                    defaultValue: 'Still have questions?',
                    admin: {
                        condition: (data, siblingData) => siblingData?.enabled,
                    },
                },
                {
                    name: 'buttonLabel',
                    type: 'text',
                    defaultValue: 'Contact Us',
                    admin: {
                        condition: (data, siblingData) => siblingData?.enabled,
                    },
                },
                {
                    name: 'buttonUrl',
                    type: 'text',
                    admin: {
                        condition: (data, siblingData) => siblingData?.enabled,
                    },
                },
            ],
        },
    ],
}
