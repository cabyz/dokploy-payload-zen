import type { Metadata } from 'next'
import React from 'react'

import { getPageBySlug, getPages } from '@/lib/api'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import { generateMeta } from '@/utilities/generateMeta'

// Generate static paths for all pages
export async function generateStaticParams() {
  try {
    const pagesData = await getPages({ revalidate: 60 })

    const pages = pagesData.docs
      .filter((doc: any) => doc.slug && doc.slug !== 'home')
      .map((doc: any) => ({ slug: doc.slug }))

    // Always include some fallback paths
    return pages.length > 0 ? pages : [{ slug: 'about' }, { slug: 'contact' }]
  } catch (error) {
    console.error('Error generating static params:', error)
    // Return fallback paths when CMS is unavailable
    return [{ slug: 'about' }, { slug: 'contact' }]
  }
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { slug = 'home' } = await paramsPromise

  const page = await getPageBySlug(slug, { revalidate: 60, depth: 2 })

  if (!page) {
    return (
      <div className="container py-28">
        <h1 className="text-4xl font-bold">Page Not Found</h1>
        <p className="mt-4 text-muted-foreground">
          The page &quot;{slug}&quot; could not be found.
        </p>
      </div>
    )
  }

  const { hero, layout } = page

  return (
    <article className="pt-16 pb-24">
      <RenderHero {...hero} />
      <RenderBlocks blocks={layout} />
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = 'home' } = await paramsPromise
  const page = await getPageBySlug(slug, { revalidate: 60 })

  return generateMeta({ doc: page })
}
