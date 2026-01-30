"use client"

import React, { useRef, useState, useCallback, useEffect } from "react"
import { motion, useSpring, useTransform } from "framer-motion"
import { cn } from "../utils"

interface SpotlightProps {
    children: React.ReactNode
    className?: string
    /** Color of the spotlight gradient */
    fill?: string
    /** Size of the spotlight circle in pixels */
    size?: number
}

/**
 * SPOTLIGHT EFFECT
 * Mouse-following radial gradient highlight for premium hover interactions.
 * 
 * Usage:
 *   import { Spotlight } from '@wlf/ui/spotlight'
 *   
 *   <Spotlight fill="rgba(139,92,246,0.15)">
 *     <Card>Premium hover effect</Card>
 *   </Spotlight>
 */
export function Spotlight({
    children,
    className = "",
    fill = "rgba(255, 255, 255, 0.08)",
    size = 600,
}: SpotlightProps) {
    const divRef = useRef<HTMLDivElement>(null)
    const [isMounted, setIsMounted] = useState(false)
    const mouseX = useSpring(0, { stiffness: 500, damping: 100 })
    const mouseY = useSpring(0, { stiffness: 500, damping: 100 })

    const background = useTransform(
        [mouseX, mouseY],
        ([x, y]) =>
            `radial-gradient(${size}px circle at ${x}px ${y}px, ${fill}, transparent 40%)`
    )

    useEffect(() => {
        setIsMounted(true)
    }, [])

    const handleMouseMove = useCallback(
        ({ currentTarget, clientX, clientY }: React.MouseEvent) => {
            const { left, top } = currentTarget.getBoundingClientRect()
            mouseX.set(clientX - left)
            mouseY.set(clientY - top)
        },
        [mouseX, mouseY]
    )

    return (
        <div
            ref={divRef}
            className={cn("group relative overflow-hidden", className)}
            onMouseMove={handleMouseMove}
        >
            {isMounted && (
                <motion.div
                    className="pointer-events-none absolute -inset-px rounded-[inherit] opacity-0 transition duration-300 group-hover:opacity-100"
                    style={{ background }}
                />
            )}
            {children}
        </div>
    )
}
