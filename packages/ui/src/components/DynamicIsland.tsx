"use client"

import React from "react"
import { AnimatePresence, motion } from "framer-motion"
import { cn } from "../utils"
import { Loader2, CheckCircle2, AlertCircle, X } from "lucide-react"
import { SPRING } from "../motion"

export type IslandState = "idle" | "loading" | "success" | "error" | "expanded"

interface DynamicIslandProps {
    state?: IslandState
    className?: string
    idleText?: string
    successText?: string
    errorText?: string
    expandedContent?: React.ReactNode
    onClose?: () => void
}

/**
 * DYNAMIC ISLAND
 * Apple-style morphing notification component.
 * Perfect for form submissions, status updates, and premium UX.
 * 
 * Usage:
 *   import { DynamicIsland } from '@wlf/ui/dynamic-island'
 *   
 *   <DynamicIsland 
 *     state={formState} 
 *     successText="Message sent!" 
 *   />
 */
export function DynamicIsland({
    state = "idle",
    className,
    idleText = "Ready",
    successText = "Success!",
    errorText = "Error",
    expandedContent,
    onClose,
}: DynamicIslandProps) {
    const variants = {
        idle: { width: "120px", height: "36px", borderRadius: "24px" },
        loading: { width: "44px", height: "44px", borderRadius: "50%" },
        success: { width: "200px", height: "48px", borderRadius: "24px" },
        error: { width: "200px", height: "48px", borderRadius: "24px" },
        expanded: { width: "320px", height: "160px", borderRadius: "32px" },
    }

    return (
        <motion.div
            layout
            initial={false}
            animate={state}
            variants={variants}
            transition={SPRING.snappy}
            className={cn(
                "bg-zinc-950 text-white overflow-hidden relative shadow-2xl shadow-black/50 mx-auto flex items-center justify-center border border-zinc-800",
                className
            )}
        >
            <AnimatePresence mode="popLayout">
                {state === "idle" && (
                    <motion.div
                        key="idle"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="absolute inset-0 flex items-center justify-center font-medium text-sm text-zinc-400"
                    >
                        {idleText}
                    </motion.div>
                )}

                {state === "loading" && (
                    <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 flex items-center justify-center"
                    >
                        <Loader2 className="w-5 h-5 animate-spin text-zinc-400" />
                    </motion.div>
                )}

                {state === "success" && (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center gap-2 px-4 w-full justify-center"
                    >
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        <span className="font-semibold text-sm">{successText}</span>
                    </motion.div>
                )}

                {state === "error" && (
                    <motion.div
                        key="error"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center gap-2 px-4 w-full justify-center"
                    >
                        <AlertCircle className="w-5 h-5 text-red-500" />
                        <span className="font-semibold text-sm">{errorText}</span>
                    </motion.div>
                )}

                {state === "expanded" && (
                    <motion.div
                        key="expanded"
                        initial={{ opacity: 0, filter: "blur(4px)" }}
                        animate={{ opacity: 1, filter: "blur(0px)" }}
                        exit={{ opacity: 0, filter: "blur(4px)" }}
                        className="flex flex-col gap-3 p-6 w-full h-full"
                    >
                        {onClose && (
                            <button
                                onClick={onClose}
                                className="absolute top-3 right-3 p-1 rounded-full hover:bg-zinc-800 transition-colors"
                            >
                                <X className="w-4 h-4 text-zinc-500" />
                            </button>
                        )}
                        {expandedContent || (
                            <div className="flex-1 bg-zinc-800/30 rounded-xl p-3 flex items-center justify-center text-xs text-zinc-500">
                                Expanded content here
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}
