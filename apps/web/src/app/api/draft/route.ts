import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { NextRequest } from 'next/server'

/**
 * Draft Mode Entry Point
 * 
 * This route enables Next.js draft mode for LivePreview.
 * Called from Payload CMS when previewing unpublished content.
 * 
 * URL: /api/draft?secret=XXX&slug=/path
 */
export async function GET(request: NextRequest): Promise<Response> {
    const { searchParams } = new URL(request.url)
    const secret = searchParams.get('secret')
    const slug = searchParams.get('slug') || '/'

    // Validate secret (should match PAYLOAD_SECRET or a dedicated preview secret)
    const expectedSecret = process.env.DRAFT_SECRET || process.env.PAYLOAD_SECRET

    if (!expectedSecret) {
        return new Response('Draft mode not configured', { status: 500 })
    }

    if (secret !== expectedSecret) {
        return new Response('Invalid secret', { status: 401 })
    }

    // Enable draft mode
    const draft = await draftMode()
    draft.enable()

    // Redirect to the page
    redirect(slug)
}
