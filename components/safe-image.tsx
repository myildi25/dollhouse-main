"use client"

import Image, { type ImageProps } from "next/image"
import { useState } from "react"

interface SafeImageProps extends Omit<ImageProps, "src"> {
  src: string | null | undefined
  fallbackSrc?: string
  itemName?: string
}

export default function SafeImage({ src, fallbackSrc, itemName = "item", alt, ...props }: SafeImageProps) {
  const [error, setError] = useState(false)

  // Generate a fallback src if none provided
  const defaultFallback = `/placeholder.svg?height=${props.height || 100}&width=${props.width || 100}&query=${encodeURIComponent(itemName)}`

  // Handle image load error
  const handleError = () => {
    console.warn(`Failed to load image: ${src}`)
    setError(true)
  }

  // Use a valid source or fallback
  const validSrc = error ? fallbackSrc || defaultFallback : src

  return (
    <div className="flex items-center justify-center h-full w-full">
      <Image
        {...props}
        src={validSrc || "/placeholder.svg"}
        alt={alt || itemName}
        onError={handleError}
        className={`object-contain ${props.className || ""} ${
          validSrc && (validSrc.includes("sofa") || validSrc.endsWith(".jpeg")) ? "sofa-image" : ""
        }`}
      />
    </div>
  )
}
