'use client'

import React from 'react'

import { HeaderThemeProvider } from './HeaderTheme'
import { ThemeProvider } from './Theme'
import { SmoothScrollProvider } from '@wlf/ui/smooth-scroll'

export const Providers: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  return (
    <ThemeProvider>
      <HeaderThemeProvider>
        <SmoothScrollProvider>
          {children}
        </SmoothScrollProvider>
      </HeaderThemeProvider>
    </ThemeProvider>
  )
}

