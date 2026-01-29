'use client'

import React from 'react'
import { useLivePreview } from '@payloadcms/live-preview-react'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'

interface PageClientProps {
    page: any
    draft?: boolean
}

/**
 * PageClient Component
 * 
 * Wraps page content with LivePreview support.
 * When in draft/preview mode, content updates in real-time from the CMS.
 * 
 * This enables the Split-Head architecture to have real-time preview
 * even though the frontend is deployed on Cloudflare Pages.
 */
export function PageClient({ page: initialPage, draft = false }: PageClientProps) {
    // LivePreview hook - syncs with Payload admin panel
    const { data: page } = useLivePreview({
        initialData: initialPage,
        serverURL: process.env.NEXT_PUBLIC_CMS_URL || 'https://cms.wlf.com.mx',
        depth: 2,
    })

    if (!page) return null

    const { hero, layout } = page

    return (
        <article className="pt-16 pb-24">
            <RenderHero {...hero} />
            <RenderBlocks blocks={layout} />
        </article>
    )
}
