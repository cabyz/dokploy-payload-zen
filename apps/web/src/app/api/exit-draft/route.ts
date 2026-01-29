import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { NextRequest } from 'next/server'

/**
 * Exit Draft Mode
 * 
 * Disables draft mode and returns to production view.
 * 
 * URL: /api/exit-draft?slug=/path
 */
export async function GET(request: NextRequest): Promise<Response> {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug') || '/'

    const draft = await draftMode()
    draft.disable()

    redirect(slug)
}
