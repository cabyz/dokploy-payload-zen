import type { Metadata } from 'next'
import React from 'react'

import { RelatedPosts } from '@/blocks/RelatedPosts/Component'
import { getPostBySlug, getPosts } from '@/lib/api'
import RichText from '@/components/RichText'
import { PostHero } from '@/heros/PostHero'
import { generateMeta } from '@/utilities/generateMeta'

export async function generateStaticParams() {
  try {
    const posts = await getPosts({ limit: 1000, revalidate: 60 })
    const slugs = posts.docs.map((post: any) => ({ slug: post.slug }))
    return slugs.length > 0 ? slugs : [{ slug: 'sample-post' }]
  } catch (error) {
    console.error('Error generating post params:', error)
    return [{ slug: 'sample-post' }]
  }
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Post({ params: paramsPromise }: Args) {
  const { slug = '' } = await paramsPromise
  const post = await getPostBySlug(slug, { revalidate: 60, depth: 2 })

  if (!post) {
    return (
      <div className="container py-28">
        <h1 className="text-4xl font-bold">Post Not Found</h1>
        <p className="mt-4 text-muted-foreground">
          The post &quot;{slug}&quot; could not be found.
        </p>
      </div>
    )
  }

  return (
    <article className="pt-16 pb-16">
      <PostHero post={post} />

      <div className="flex flex-col items-center gap-4 pt-8">
        <div className="container">
          <RichText className="max-w-[48rem] mx-auto" data={post.content} enableGutter={false} />
          {post.relatedPosts && post.relatedPosts.length > 0 && (
            <RelatedPosts
              className="mt-12 max-w-[52rem] lg:grid lg:grid-cols-subgrid col-start-1 col-span-3 grid-rows-[2fr]"
              docs={post.relatedPosts.filter((p: any) => typeof p === 'object')}
            />
          )}
        </div>
      </div>
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const post = await getPostBySlug(slug, { revalidate: 60 })

  return generateMeta({ doc: post })
}
