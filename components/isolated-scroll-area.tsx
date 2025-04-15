"use client"

import type React from "react"

import { useRef, useEffect, forwardRef } from "react"
import { ScrollArea, type ScrollAreaProps } from "@/components/ui/scroll-area"

interface IsolatedScrollAreaProps extends ScrollAreaProps {
  className?: string
  children: React.ReactNode
}

const IsolatedScrollArea = forwardRef<HTMLDivElement, IsolatedScrollAreaProps>(
  ({ className, children, ...props }, ref) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
      const scrollContainer = scrollContainerRef.current
      if (!scrollContainer) return

      const handleWheel = (e: WheelEvent) => {
        const { scrollTop, scrollHeight, clientHeight } =
          scrollContainer.querySelector("[data-radix-scroll-area-viewport]") || scrollContainer

        // Check if scrolling at the boundary
        const isAtTop = scrollTop === 0 && e.deltaY < 0
        const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1 && e.deltaY > 0

        // Only prevent default if we're not at the boundaries
        if (!isAtTop && !isAtBottom) {
          e.preventDefault()
          e.stopPropagation()

          // Manually scroll the container
          if (scrollContainer.querySelector("[data-radix-scroll-area-viewport]")) {
            scrollContainer.querySelector("[data-radix-scroll-area-viewport]").scrollTop += e.deltaY
          } else {
            scrollContainer.scrollTop += e.deltaY
          }
        }
      }

      scrollContainer.addEventListener("wheel", handleWheel, { passive: false })
      return () => {
        scrollContainer.removeEventListener("wheel", handleWheel)
      }
    }, [])

    return (
      <div ref={scrollContainerRef} className={className} style={{ overflow: "hidden" }}>
        <ScrollArea {...props} className="h-full">
          {children}
        </ScrollArea>
      </div>
    )
  },
)

IsolatedScrollArea.displayName = "IsolatedScrollArea"

export default IsolatedScrollArea
