"use client"

import React from 'react'
import { trackEvent, trackFormField } from './index'

/**
 * TRACKED CONVERSION COMPONENTS
 * Drop-in replacements for standard elements that auto-report to PostHog.
 * 
 * Zero-code tracking for conversion optimization.
 */

interface TrackedProps {
    /** Event name sent to PostHog */
    trackName: string
    /** Additional properties to send with the event */
    trackProps?: Record<string, any>
}

/**
 * TrackedButton - Auto-tracks click events
 * 
 * Usage:
 *   <TrackedButton trackName="cta_click" trackProps={{ cta: 'hero' }}>
 *     Get Started
 *   </TrackedButton>
 */
export function TrackedButton({
    children,
    trackName,
    trackProps,
    onClick,
    ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & TrackedProps) {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        trackEvent(trackName, {
            ...(trackProps || {}),
            text: typeof children === 'string' ? children : undefined,
            component: 'TrackedButton',
        })
        onClick?.(e)
    }

    return (
        <button onClick={handleClick} {...props}>
            {children}
        </button>
    )
}

/**
 * TrackedLink - Auto-tracks link clicks with destination
 * 
 * Usage:
 *   <TrackedLink trackName="nav_click" href="/pricing">
 *     View Pricing
 *   </TrackedLink>
 */
export function TrackedLink({
    children,
    trackName,
    trackProps,
    onClick,
    href,
    ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & TrackedProps) {
    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        trackEvent(trackName, {
            ...(trackProps || {}),
            destination: href,
            text: typeof children === 'string' ? children : undefined,
            component: 'TrackedLink',
        })
        onClick?.(e)
    }

    return (
        <a href={href} onClick={handleClick} {...props}>
            {children}
        </a>
    )
}

/**
 * TrackedInput - Auto-tracks focus/blur for form drop-off analysis
 * 
 * Usage:
 *   <TrackedInput 
 *     trackName="email_field" 
 *     formId="hiring-funnel" 
 *     placeholder="Enter your email"
 *   />
 */
export function TrackedInput({
    trackName,
    formId = 'default',
    onBlur,
    onFocus,
    onChange,
    ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
    trackName: string
    formId?: string
}) {
    return (
        <input
            onFocus={(e) => {
                trackFormField(formId, trackName, 'focus')
                onFocus?.(e)
            }}
            onBlur={(e) => {
                trackFormField(formId, trackName, 'blur')
                onBlur?.(e)
            }}
            onChange={(e) => {
                trackFormField(formId, trackName, 'change')
                onChange?.(e)
            }}
            {...props}
        />
    )
}

/**
 * TrackedTextarea - Auto-tracks focus/blur for text areas
 */
export function TrackedTextarea({
    trackName,
    formId = 'default',
    onBlur,
    onFocus,
    ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    trackName: string
    formId?: string
}) {
    return (
        <textarea
            onFocus={(e) => {
                trackFormField(formId, trackName, 'focus')
                onFocus?.(e)
            }}
            onBlur={(e) => {
                trackFormField(formId, trackName, 'blur')
                onBlur?.(e)
            }}
            {...props}
        />
    )
}

/**
 * TrackedForm - Tracks form submissions and captures field values
 * 
 * Usage:
 *   <TrackedForm 
 *     trackName="hiring_submit" 
 *     formId="hiring-funnel"
 *     onSubmit={handleSubmit}
 *   >
 *     <TrackedInput trackName="name" formId="hiring-funnel" />
 *     <button type="submit">Apply</button>
 *   </TrackedForm>
 */
export function TrackedForm({
    children,
    trackName,
    formId = 'default',
    onSubmit,
    ...props
}: React.FormHTMLAttributes<HTMLFormElement> & {
    trackName: string
    formId?: string
}) {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        const formData = new FormData(e.currentTarget)
        const fieldNames = Array.from(formData.keys())

        trackEvent(trackName, {
            form_id: formId,
            field_count: fieldNames.length,
            fields_filled: fieldNames.filter(k => formData.get(k)).length,
            component: 'TrackedForm',
        })

        onSubmit?.(e)
    }

    return (
        <form id={formId} onSubmit={handleSubmit} {...props}>
            {children}
        </form>
    )
}
