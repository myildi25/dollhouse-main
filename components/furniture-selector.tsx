"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Check, ChevronLeft, ChevronRight, Plus, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import SafeImage from "./safe-image"
import useEmblaCarousel from "embla-carousel-react"

interface FurnitureItem {
  id: number
  name: string
  image: string
  price: number
  uniqueId?: number
  manufacturer?: string
}

interface FurnitureSelectorProps {
  category: {
    id: string
    name: string
    items: FurnitureItem[]
  }
  currentSelection: FurnitureItem
  chosenItems: FurnitureItem[]
  onSelectCurrent: (item: FurnitureItem) => void
  onAddToChosen: (item: FurnitureItem) => void
  onRemoveFromChosen: (uniqueId: number) => void
}

export default function FurnitureSelector({
  category,
  currentSelection,
  chosenItems,
  onSelectCurrent,
  onAddToChosen,
  onRemoveFromChosen,
}: FurnitureSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredItems, setFilteredItems] = useState(category.items)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    skipSnaps: false,
    containScroll: false,
    speed: 5, // Slower animation speed (higher number = slower)
    dragFree: true, // Makes dragging feel more fluid and slower
    watchDrag: false, // Prevents the carousel from moving during drag
    inViewThreshold: 0.7, // Helps with determining when slides are in view
    slidesToScroll: 1,
  })
  const containerRef = useRef<HTMLDivElement>(null)
  const wheelScrolling = useRef(false)
  const wheelTimeout = useRef<NodeJS.Timeout | null>(null)
  const lastScrollTime = useRef(0)
  const [isDragging, setIsDragging] = useState(false)
  const chosenItemsRef = useRef<HTMLDivElement>(null)

  // Filter items based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredItems(category.items)
    } else {
      const filtered = category.items.filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
      setFilteredItems(filtered)
    }
    // Reset carousel when search changes
    setCurrentIndex(0)

    // Reset embla carousel
    if (emblaApi) {
      emblaApi.scrollTo(0)
    }
  }, [searchTerm, category.items, emblaApi])

  // Initialize embla carousel
  useEffect(() => {
    if (emblaApi) {
      const onSelect = () => {
        setCurrentIndex(emblaApi.selectedScrollSnap())
        onSelectCurrent(filteredItems[emblaApi.selectedScrollSnap()])
      }

      const onDragStart = () => {
        setIsDragging(true)
      }

      const onDragEnd = () => {
        setTimeout(() => {
          setIsDragging(false)
        }, 100)
      }

      emblaApi.on("select", onSelect)
      emblaApi.on("dragStart", onDragStart)
      emblaApi.on("dragEnd", onDragEnd)

      // Initial selection
      if (filteredItems.length > 0) {
        const initialIndex = filteredItems.findIndex((item) => item.id === currentSelection.id)
        if (initialIndex !== -1) {
          emblaApi.scrollTo(initialIndex)
        }
      }

      return () => {
        emblaApi.off("select", onSelect)
        emblaApi.off("dragStart", onDragStart)
        emblaApi.off("dragEnd", onDragEnd)
      }
    }
  }, [emblaApi, filteredItems, onSelectCurrent, currentSelection.id])

  // Handle seamless looping
  useEffect(() => {
    if (!emblaApi) return

    // Function to handle the loop transition
    const handleLoopPoints = () => {
      const lastSlideIndex = emblaApi.scrollSnapList().length - 1
      const slideIndex = emblaApi.selectedScrollSnap()

      // Add a class to the container to hide transitions during loop jumps
      if (slideIndex === 0 || slideIndex === lastSlideIndex) {
        const container = emblaRef.current
        if (container) {
          container.querySelector(".embla__container")?.classList.add("no-transition-on-loop")

          // Remove the class after the jump is complete
          setTimeout(() => {
            container.querySelector(".embla__container")?.classList.remove("no-transition-on-loop")
          }, 50)
        }
      }
    }

    emblaApi.on("select", handleLoopPoints)

    return () => {
      emblaApi.off("select", handleLoopPoints)
    }
  }, [emblaApi, emblaRef])

  // Add two-finger scrolling support with slower speed
  useEffect(() => {
    const container = containerRef.current
    if (!container || !emblaApi) return

    const handleWheel = (e: WheelEvent) => {
      // Check if this is likely a two-finger gesture (trackpad)
      const isHorizontalScroll = Math.abs(e.deltaX) > Math.abs(e.deltaY) || e.shiftKey

      if (isHorizontalScroll) {
        e.preventDefault()

        // Throttle scrolling to make it slower
        const now = Date.now()
        if (now - lastScrollTime.current < 800) {
          // Increased delay between scrolls
          return
        }
        lastScrollTime.current = now

        // Determine scroll direction
        const direction = e.deltaX > 0 || (e.shiftKey && e.deltaY > 0) ? 1 : -1

        // Set a flag to indicate we're wheel scrolling
        wheelScrolling.current = true

        // Scroll by the delta amount
        if (direction > 0) {
          emblaApi.scrollNext()
        } else {
          emblaApi.scrollPrev()
        }

        // Clear any existing timeout
        if (wheelTimeout.current) {
          clearTimeout(wheelTimeout.current)
        }

        // Set a timeout to reset the wheel scrolling flag
        wheelTimeout.current = setTimeout(() => {
          wheelScrolling.current = false
        }, 800) // Longer cooldown
      }
    }

    container.addEventListener("wheel", handleWheel, { passive: false })

    return () => {
      container.removeEventListener("wheel", handleWheel)
      if (wheelTimeout.current) {
        clearTimeout(wheelTimeout.current)
      }
    }
  }, [emblaApi])

  // Handle adding to chosen items
  const handleAddToChosen = (e: React.MouseEvent) => {
    e.stopPropagation()
    onAddToChosen(filteredItems[currentIndex])
  }

  // Handle rejecting/skipping an item - now just moves to next item
  const handleReject = (e: React.MouseEvent) => {
    e.stopPropagation()

    // Move to next item
    if (emblaApi) {
      emblaApi.scrollNext()
    }
  }

  // Handle selecting an item directly
  const handleSelectItem = (index: number) => {
    if (emblaApi) {
      emblaApi.scrollTo(index)
    }
  }

  // Slow down button navigation
  const handlePrev = () => {
    if (!emblaApi) return

    const now = Date.now()
    if (now - lastScrollTime.current < 500) {
      return
    }
    lastScrollTime.current = now
    emblaApi.scrollPrev()
  }

  const handleNext = () => {
    if (!emblaApi) return

    const now = Date.now()
    if (now - lastScrollTime.current < 500) {
      return
    }
    lastScrollTime.current = now
    emblaApi.scrollNext()
  }

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-0 -mt-1">
        <div className="flex items-center">
          <h3 className="text-lg font-medium tracking-wide text-black">{category.name}</h3>
          <span className="ml-2 text-xs text-design-forest font-semibold">
            {category.id === "sofas"
              ? "540"
              : category.id === "coffee-tables"
                ? "380"
                : category.id === "chairs"
                  ? "425"
                  : category.id === "lamps"
                    ? "310"
                    : filteredItems.length}{" "}
            items
          </span>

          {/* Chosen furniture items - moved to be next to category name */}
          {chosenItems.length > 0 && (
            <div
              className={`ml-8 overflow-x-auto ${category.id === "coffee-tables" ? "w-[450px]" : "w-[520px]"} flex-shrink-0`}
              ref={chosenItemsRef}
            >
              <div className={`flex gap-2 whitespace-nowrap ${category.id === "coffee-tables" ? "pr-32" : "pr-48"}`}>
                {chosenItems.map((item) => (
                  <div
                    key={item.uniqueId}
                    className={`flex items-center bg-white rounded-full border border-design-forest/10 pr-2 pl-1 py-1 ${
                      category.id === "coffee-tables" ? "max-w-[160px]" : "max-w-[200px]"
                    }`}
                  >
                    <div className="relative w-6 h-6 rounded-full overflow-hidden mr-2 flex-shrink-0">
                      <SafeImage src={item.image} itemName={item.name} fill className="object-cover" />
                    </div>
                    <span
                      className={`text-xs font-medium truncate ${
                        category.id === "coffee-tables" ? "max-w-[80px]" : "max-w-[100px]"
                      }`}
                    >
                      {item.name}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-5 w-5 rounded-full p-0 ml-1 hover:bg-red-50 hover:text-red-500"
                      onClick={() => onRemoveFromChosen(item.uniqueId!)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="relative w-48">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-design-forest/60" size={14} />
          <Input
            className="pl-7 h-7 text-sm border-design-forest/20 focus:border-design-forest bg-white/50 focus:bg-white"
            placeholder={`Search ${category.name.toLowerCase()}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Carousel */}
      <div className="relative mt-2 mb-2" ref={containerRef}>
        <div className={`embla ${isDragging ? "is-dragging" : ""}`} ref={emblaRef}>
          <div className="embla__container py-4 no-transition-on-loop">
            {filteredItems.map((item, index) => {
              const isActive = index === currentIndex

              return (
                <div
                  key={item.id}
                  className={cn("embla__slide px-2", isActive ? "is-active" : "")}
                  onClick={() => handleSelectItem(index)}
                >
                  <div
                    className={cn(
                      "bg-white rounded-lg p-3 transition-all duration-300",
                      isActive ? "scale-110 shadow-md z-10" : "scale-100 opacity-70",
                    )}
                    style={{
                      width: isActive ? "220px" : "180px",
                      transformOrigin: "center center",
                    }}
                  >
                    <div className="relative w-full h-32 mb-2">
                      <SafeImage src={item.image} itemName={item.name} fill className="object-contain" />
                    </div>

                    <div className="flex flex-col items-center">
                      {isActive ? (
                        <div className="flex flex-col w-full">
                          {item.manufacturer && (
                            <p className="text-xs text-gray-500 text-center mb-1 truncate">{item.manufacturer}</p>
                          )}
                          <p
                            className={`text-sm font-semibold text-center w-full text-black ${category.id === "coffee-tables" ? "line-clamp-2 h-10" : "truncate"}`}
                          >
                            {item.name}
                          </p>
                          <div className="flex items-center justify-between w-full mt-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="rounded-full h-7 w-7 p-0 hover:bg-green-50 hover:text-green-600 border-design-forest/30"
                              onClick={handleReject}
                              title="Next item"
                            >
                              <Check className="h-4 w-4" />
                            </Button>

                            <p className="text-sm font-bold text-design-forest">
                              <span className="font-medium text-xs mr-1">$</span>
                              {item.price}
                            </p>

                            <Button
                              variant="outline"
                              size="sm"
                              className="rounded-full h-7 w-7 p-0 hover:bg-red-50 hover:text-red-600 border-gray-200"
                              onClick={handleReject}
                              title="Skip"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          {/* Add the + button to the top right with styling that indicates if it's already selected */}
                          <Button
                            variant="outline"
                            size="sm"
                            className={`rounded-full h-6 w-6 p-0 absolute top-2 right-2 ${
                              chosenItems.some((chosen) => chosen.id === item.id)
                                ? "bg-design-forest text-white hover:bg-design-forest/80" // Already selected styling
                                : "bg-white text-design-forest hover:bg-design-forest hover:text-white" // Default styling
                            } border-design-forest/30`}
                            onClick={(e) => {
                              e.stopPropagation()
                              handleAddToChosen(e)
                              handleReject(e) // Also move to next item
                            }}
                            title={
                              chosenItems.some((chosen) => chosen.id === item.id)
                                ? "Already added"
                                : "Add to cart and next"
                            }
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex flex-col w-full items-center">
                          {item.manufacturer && (
                            <p className="text-xs text-gray-500 text-center mb-1 truncate w-full">
                              {item.manufacturer}
                            </p>
                          )}
                          <p
                            className={`text-sm font-semibold text-center w-full text-black ${category.id === "coffee-tables" ? "line-clamp-2 h-10" : "truncate"}`}
                          >
                            {item.name}
                          </p>
                          <p className="text-sm font-bold mt-1 text-design-forest">
                            <span className="font-medium text-xs mr-1">$</span>
                            {item.price}
                          </p>
                          {/* Remove the + button from non-active items */}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Navigation buttons with updated hover colors */}
        <Button
          variant="ghost"
          size="sm"
          className="absolute left-0 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 rounded-full z-10 text-gray-500 hover:text-design-forest hover:bg-design-forest/10"
          onClick={handlePrev}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="absolute right-0 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 rounded-full z-10 text-gray-500 hover:text-design-forest hover:bg-design-forest/10"
          onClick={handleNext}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
