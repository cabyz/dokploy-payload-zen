import Link from 'next/link'
import { getPage, getPosts } from '@/lib/api'

interface Post {
    id: string
    slug: string
    title: string
    meta?: {
        description?: string
    }
}

interface Page {
    title?: string
    meta?: {
        description?: string
    }
}

export default async function HomePage() {
    // Fetch home page data from CMS
    const pageData = await getPage('home', { revalidate: 60 })
    const page = pageData.docs[0] as Page | undefined

    // Fetch recent posts
    const postsData = await getPosts({ revalidate: 60 })
    const posts = (postsData.docs as Post[]).slice(0, 3)

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-5xl font-bold mb-6">
                        {page?.title || 'Welcome to WLF'}
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        {page?.meta?.description || 'Your Wolf Business Platform'}
                    </p>
                </div>
            </section>

            {/* Recent Posts */}
            <section className="py-16 container mx-auto px-4">
                <h2 className="text-3xl font-bold mb-8">Recent Posts</h2>
                <div className="grid md:grid-cols-3 gap-6">
                    {posts.map((post) => (
                        <Link
                            key={post.id}
                            href={`/posts/${post.slug}`}
                            className="block p-6 rounded-lg border hover:shadow-lg transition"
                        >
                            <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                            <p className="text-gray-500 line-clamp-2">
                                {post.meta?.description || 'Read more...'}
                            </p>
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    )
}
