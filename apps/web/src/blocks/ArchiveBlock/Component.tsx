import React from 'react'
import RichText from '@/components/RichText'
import { CollectionArchive } from '@/components/CollectionArchive'
import { getPosts } from '@/lib/api'

type ArchiveBlockProps = {
  id?: string
  categories?: any[]
  introContent?: any
  limit?: number
  populateBy?: 'collection' | 'selection'
  selectedDocs?: any[]
}

export const ArchiveBlock: React.FC<ArchiveBlockProps> = async (props) => {
  const { id, categories, introContent, limit: limitFromProps, populateBy, selectedDocs } = props

  const limit = limitFromProps || 3
  let posts: any[] = []

  if (populateBy === 'collection') {
    // Fetch posts via REST API
    const fetchedPosts = await getPosts({ limit, depth: 1, revalidate: 60 })

    // Filter by category if specified
    if (categories && categories.length > 0) {
      const categoryIds = categories.map((cat: any) =>
        typeof cat === 'object' ? cat.id : cat
      )
      posts = fetchedPosts.docs.filter((post: any) =>
        post.categories?.some((cat: any) =>
          categoryIds.includes(typeof cat === 'object' ? cat.id : cat)
        )
      )
    } else {
      posts = fetchedPosts.docs
    }
  } else {
    if (selectedDocs?.length) {
      posts = selectedDocs
        .map((doc: any) => (typeof doc.value === 'object' ? doc.value : null))
        .filter(Boolean)
    }
  }

  return (
    <div className="my-16" id={`block-${id}`}>
      {introContent && (
        <div className="container mb-16">
          <RichText className="ms-0 max-w-[48rem]" data={introContent} enableGutter={false} />
        </div>
      )}
      <CollectionArchive posts={posts} />
    </div>
  )
}
