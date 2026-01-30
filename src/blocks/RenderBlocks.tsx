import React, { Fragment } from 'react'

import type { Page } from '@/payload-types'

// Core Blocks
import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { FormBlock } from '@/blocks/Form/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { PricingBlockComponent } from '@/blocks/Pricing/Component'

// Landing Page Blocks (Sovereign Design System)
import { HeroBlockComponent } from '@/blocks/Hero/Component'
import { FeatureGridBlockComponent } from '@/blocks/FeatureGrid/Component'
import { SocialProofBlockComponent } from '@/blocks/SocialProof/Component'
import { FAQBlockComponent } from '@/blocks/FAQ/Component'
import { TestimonialsBlockComponent } from '@/blocks/Testimonials/Component'

const blockComponents = {
  // Core
  archive: ArchiveBlock,
  content: ContentBlock,
  cta: CallToActionBlock,
  formBlock: FormBlock,
  mediaBlock: MediaBlock,
  pricing: PricingBlockComponent,
  // Landing Page
  hero: HeroBlockComponent,
  featureGrid: FeatureGridBlockComponent,
  socialProof: SocialProofBlockComponent,
  faq: FAQBlockComponent,
  testimonials: TestimonialsBlockComponent,
}

export const RenderBlocks: React.FC<{
  blocks: Page['layout'][0][]
}> = (props) => {
  const { blocks } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType as keyof typeof blockComponents]

            if (Block) {
              return (
                <div className="my-16" key={index}>
                  {/* @ts-expect-error there may be some mismatch between the expected types here */}
                  <Block {...block} disableInnerContainer />
                </div>
              )
            }
          }
          return null
        })}
      </Fragment>
    )
  }

  return null
}

