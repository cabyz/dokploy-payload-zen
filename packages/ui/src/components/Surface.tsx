import * as React from "react"
import { cn } from "../utils"
import { cva, type VariantProps } from "class-variance-authority"

/**
 * SURFACE PRIMITIVE (The "Atomic Canvas")
 * The fundamental building block for all WLF/Zen UI elements.
 * Replaces ad-hoc divs with standardized shape, depth, and glassmorphism.
 * 
 * Usage:
 *   import { Surface } from '@wlf/ui/surface'
 *   
 *   <Surface shape="squircle" elevation="glass">
 *     Content
 *   </Surface>
 */

const surfaceVariants = cva(
    "relative overflow-hidden transition-all duration-300 flex items-center justify-center shrink-0",
    {
        variants: {
            shape: {
                rectangle: "rounded-md",
                squircle: "rounded-[24px] sm:rounded-[32px]",
                pill: "rounded-full",
                circle: "rounded-full aspect-square",
                "brand-squircle": "rounded-[12px] sm:rounded-[16px]",
            },
            size: {
                none: "",
                xs: "h-4 w-4",
                sm: "h-6 w-6",
                md: "h-8 w-8",
                lg: "h-12 w-12",
                xl: "h-14 w-14",
                "2xl": "h-20 w-20",
                full: "h-full w-full",
            },
            elevation: {
                none: "",
                flat: "bg-zinc-900/50 border border-zinc-800/50",
                raised: "bg-zinc-900 border border-zinc-800 shadow-xl shadow-zinc-950/20",
                glass: "bg-zinc-950/40 backdrop-blur-xl border border-white/5",
                ghost: "bg-transparent border-transparent hover:bg-zinc-800/30",
                "brand-default": "bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/10 shadow-sm",
                "brand-gradient": "bg-gradient-to-br from-primary/20 to-accent/10 border border-primary/20 shadow-[0_0_20px_rgba(139,92,246,0.1)]",
                sovereign: "bg-zinc-950/60 backdrop-blur-2xl border border-zinc-800/50 shadow-2xl shadow-zinc-950/50",
            },
            intent: {
                neutral: "",
                primary: "border-zinc-700 bg-zinc-900/80 text-zinc-100",
                magic: "border-purple-500/20 bg-purple-500/5 shadow-purple-500/10 text-purple-400",
                success: "border-emerald-500/20 bg-emerald-500/5 text-emerald-400",
                warning: "border-amber-500/20 bg-amber-500/5 text-amber-400",
                error: "border-red-500/20 bg-red-500/5 text-red-400",
                loading: "animate-pulse opacity-80",
            }
        },
        defaultVariants: {
            shape: "rectangle",
            size: "none",
            elevation: "flat",
            intent: "neutral",
        },
    }
)

export interface SurfaceProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof surfaceVariants> {
    asChild?: boolean
}

const Surface = React.forwardRef<HTMLDivElement, SurfaceProps>(
    ({ className, shape, size, elevation, intent, ...props }, ref) => {
        return (
            <div
                ref={ref}
                data-shape={shape}
                className={cn(surfaceVariants({ shape, size, elevation, intent }), className)}
                {...props}
            />
        )
    }
)
Surface.displayName = "Surface"

/**
 * BRAND SQUIRCLE (Legacy Alias)
 * Maps to Surface with shape="squircle".
 */
const BrandSquircle = React.forwardRef<HTMLDivElement, SurfaceProps>(
    (props, ref) => <Surface ref={ref} shape="squircle" {...props} />
)
BrandSquircle.displayName = "BrandSquircle"

export { Surface, BrandSquircle, surfaceVariants }
