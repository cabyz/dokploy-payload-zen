/**
 * API client for fetching data from Payload CMS
 */

const CMS_URL = process.env.CMS_URL || 'https://cms.wlf.com.mx'

interface FetchOptions {
    draft?: boolean
    cache?: RequestCache
    revalidate?: number
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PageDoc = any

interface PaginatedResponse {
    docs: PageDoc[]
    totalDocs?: number
    page?: number
}

export async function fetchFromCMS<T>(
    endpoint: string,
    options: FetchOptions = {}
): Promise<T> {
    const { draft = false, cache, revalidate } = options

    const url = `${CMS_URL}/api/${endpoint}`

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    }

    const fetchOptions: RequestInit = {
        headers,
    }

    if (cache) {
        fetchOptions.cache = cache
    }

    if (revalidate !== undefined) {
        fetchOptions.next = { revalidate }
    }

    if (draft) {
        fetchOptions.cache = 'no-store'
    }

    const response = await fetch(url, fetchOptions)

    if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`)
    }

    return response.json()
}

export async function getPage(slug: string, options?: FetchOptions) {
    return fetchFromCMS<PaginatedResponse>(`pages?where[slug][equals]=${slug}`, options)
}

export async function getPosts(options?: FetchOptions) {
    return fetchFromCMS<PaginatedResponse>('posts', options)
}
