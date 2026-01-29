import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

/**
 * Webhook endpoint for On-Demand Revalidation
 * Called by Payload CMS afterChange hooks when content is updated
 */
export async function POST(req: NextRequest) {
    // Validate the secret token
    const secret = req.headers.get('x-revalidation-secret')

    if (secret !== process.env.REVALIDATION_SECRET) {
        return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
        )
    }

    try {
        const body = await req.json()
        const { collection, slug, global } = body

        // Revalidate based on content type
        if (global) {
            // Global content (header/footer) - revalidate all pages
            revalidatePath('/', 'layout')
        } else if (collection === 'pages') {
            revalidatePath(`/${slug}`)
            if (slug === 'home') {
                revalidatePath('/')
            }
        } else if (collection === 'posts') {
            revalidatePath(`/posts/${slug}`)
            revalidatePath('/posts') // Also revalidate posts listing
        }

        return NextResponse.json({
            revalidated: true,
            collection,
            slug,
            timestamp: Date.now()
        })
    } catch (error) {
        return NextResponse.json(
            { error: 'Invalid request body' },
            { status: 400 }
        )
    }
}
