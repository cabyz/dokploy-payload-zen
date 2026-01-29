/**
 * API client for fetching data from Payload CMS
 */

const CMS_URL = process.env.CMS_URL || 'https://cms.wlf.com.mx'

interface FetchOptions {
    draft?: boolean
    cache?: RequestCache
    revalidate?: number
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
        credentials: 'include',
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

// Collection-specific fetchers
export async function getPages(options?: FetchOptions) {
    return fetchFromCMS<{ docs: any[] }>('pages', options)
}

export async function getPage(slug: string, options?: FetchOptions) {
    return fetchFromCMS<{ docs: any[] }>(`pages?where[slug][equals]=${slug}`, options)
}

export async function getPosts(options?: FetchOptions) {
    return fetchFromCMS<{ docs: any[] }>('posts', options)
}

export async function getPost(slug: string, options?: FetchOptions) {
    return fetchFromCMS<{ docs: any[] }>(`posts?where[slug][equals]=${slug}`, options)
}

export async function getGlobals(slug: 'header' | 'footer', options?: FetchOptions) {
    return fetchFromCMS<any>(`globals/${slug}`, options)
}
