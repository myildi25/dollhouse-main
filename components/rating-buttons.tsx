"use client"

import { Check, Minus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface RatingButtonsProps {
  rating: "good" | "neutral" | "bad" | null
  onRatingChange: (rating: "good" | "neutral" | "bad") => void
}

export default function RatingButtons({ rating, onRatingChange }: RatingButtonsProps) {
  return (
    <TooltipProvider>
      <div className="flex items-center gap-3">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "rounded-full h-9 w-9 transition-all",
                rating === "good"
                  ? "bg-green-100 border-green-500 text-green-600 shadow-sm"
                  : "hover:text-green-600 hover:border-green-200",
              )}
              onClick={() => onRatingChange("good")}
            >
              <Check className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Good</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "rounded-full h-9 w-9 transition-all",
                rating === "neutral"
                  ? "bg-gray-100 border-gray-500 text-gray-600 shadow-sm"
                  : "hover:text-gray-600 hover:border-gray-300",
              )}
              onClick={() => onRatingChange("neutral")}
            >
              <Minus className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Neutral</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "rounded-full h-9 w-9 transition-all",
                rating === "bad"
                  ? "bg-red-100 border-red-500 text-red-600 shadow-sm"
                  : "hover:text-red-600 hover:border-red-200",
              )}
              onClick={() => onRatingChange("bad")}
            >
              <X className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Bad</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
}
