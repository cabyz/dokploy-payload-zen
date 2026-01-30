import * as React from "react"
import { cn } from "../utils"
import { Surface, type SurfaceProps } from "./Surface"

/**
 * ZEN LAYOUT (The "Automatic Spacing" Engine)
 * Enforces the "HumanPlane" aesthetic: consistent gaps, bento-grids, and glass borders.
 * 
 * Usage:
 *   import { ZenGrid, ZenItem } from '@wlf/ui/zen-grid'
 *   
 *   <ZenGrid cols={3} gap="md">
 *     <ZenItem colSpan={2}>Hero</ZenItem>
 *     <ZenItem>Sidebar</ZenItem>
 *   </ZenGrid>
 */

interface ZenGridProps extends React.HTMLAttributes<HTMLDivElement> {
    cols?: 1 | 2 | 3 | 4 | 6 | 12
    gap?: "none" | "sm" | "md" | "lg"
}

const ZenGrid = React.forwardRef<HTMLDivElement, ZenGridProps>(
    ({ className, cols = 12, gap = "md", children, ...props }, ref) => {
        const gapStyles = {
            none: "gap-0",
            sm: "gap-2",   // 8px
            md: "gap-4",   // 16px - Standard HumanPlane
            lg: "gap-6",   // 24px
        }

        const gridCols = {
            1: "grid-cols-1",
            2: "grid-cols-1 md:grid-cols-2",
            3: "grid-cols-1 md:grid-cols-3",
            4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
            6: "grid-cols-2 md:grid-cols-3 lg:grid-cols-6",
            12: "grid-cols-4 md:grid-cols-8 lg:grid-cols-12",
        }

        return (
            <div
                ref={ref}
                className={cn(
                    "grid auto-rows-[minmax(180px,auto)]",
                    gridCols[cols],
                    gapStyles[gap],
                    className
                )}
                {...props}
            >
                {children}
            </div>
        )
    }
)
ZenGrid.displayName = "ZenGrid"

interface ZenItemProps extends SurfaceProps {
    colSpan?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | "full"
    rowSpan?: 1 | 2 | 3 | 4 | "full"
}

const ZenItem = React.forwardRef<HTMLDivElement, ZenItemProps>(
    ({ className, colSpan = 1, rowSpan = 1, children, elevation = "glass", ...props }, ref) => {
        const colSpans: Record<string | number, string> = {
            1: "col-span-1",
            2: "col-span-1 md:col-span-2",
            3: "col-span-1 md:col-span-3",
            4: "col-span-1 md:col-span-2 lg:col-span-4",
            5: "col-span-1 md:col-span-5",
            6: "col-span-1 md:col-span-3 lg:col-span-6",
            7: "col-span-1 md:col-span-7",
            8: "col-span-1 md:col-span-4 lg:col-span-8",
            9: "col-span-1 md:col-span-9",
            10: "col-span-1 md:col-span-5 lg:col-span-10",
            11: "col-span-1 md:col-span-11",
            12: "col-span-1 md:col-span-full",
            full: "col-span-full",
        }

        const rowSpans: Record<string | number, string> = {
            1: "row-span-1",
            2: "row-span-2",
            3: "row-span-3",
            4: "row-span-4",
            full: "row-span-full",
        }

        return (
            <Surface
                ref={ref}
                elevation={elevation}
                className={cn(
                    "w-full h-full flex flex-col",
                    colSpans[colSpan] || "col-span-1",
                    rowSpans[rowSpan] || "row-span-1",
                    className
                )}
                {...props}
            >
                {children}
            </Surface>
        )
    }
)
ZenItem.displayName = "ZenItem"

export { ZenGrid, ZenItem }
