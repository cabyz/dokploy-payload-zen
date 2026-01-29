import type { Metadata } from 'next'

import { mergeOpenGraph } from './mergeOpenGraph'

const siteURL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.wlf.com.mx'
const cmsURL = process.env.CMS_URL || 'https://cms.wlf.com.mx'

const getImageURL = (image?: any) => {
  let url = siteURL + '/og-image.webp'

  if (image && typeof image === 'object' && 'url' in image) {
    const ogUrl = image.sizes?.og?.url
    // Media URLs come from CMS
    url = ogUrl ? cmsURL + ogUrl : cmsURL + image.url
  }

  return url
}

export const generateMeta = async (args: {
  doc: any
}): Promise<Metadata> => {
  const { doc } = args

  const ogImage = getImageURL(doc?.meta?.image)

  const title = doc?.meta?.title
    ? doc?.meta?.title + ' | WLF'
    : 'WLF Platform'

  return {
    description: doc?.meta?.description,
    openGraph: mergeOpenGraph({
      description: doc?.meta?.description || '',
      images: ogImage
        ? [
          {
            url: ogImage,
          },
        ]
        : undefined,
      title,
      url: Array.isArray(doc?.slug) ? doc?.slug.join('/') : '/',
    }),
    title,
  }
}
