"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Check, ChevronLeft, ChevronRight, Eye, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import SafeImage from "./safe-image"
import useEmblaCarousel from "embla-carousel-react"
import { Badge } from "@/components/ui/badge"

interface FurnishedRoom {
  id: number
  name: string
  image: string
  style: string
  roomType: string
  furniture?: any[] // Optional furniture items that come with this room
}

interface FurnishedRoomCarouselProps {
  rooms: FurnishedRoom[]
  onSelectRoom: (room: FurnishedRoom) => void
  onLikeRoom: (room: FurnishedRoom) => void
  onDislikeRoom: (room: FurnishedRoom) => void
  likedRooms: number[]
  dislikedRooms: number[]
}

export default function FurnishedRoomCarousel({
  rooms,
  onSelectRoom,
  onLikeRoom,
  onDislikeRoom,
  likedRooms,
  dislikedRooms,
}: FurnishedRoomCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    skipSnaps: false,
    containScroll: false,
    speed: 5, // Slower animation speed
    dragFree: true,
    watchDrag: false,
    inViewThreshold: 0.7,
    slidesToScroll: 1,
  })
  const containerRef = useRef<HTMLDivElement>(null)
  const wheelScrolling = useRef(false)
  const wheelTimeout = useRef<NodeJS.Timeout | null>(null)
  const lastScrollTime = useRef(0)
  const [isDragging, setIsDragging] = useState(false)

  // Initialize embla carousel
  useEffect(() => {
    if (emblaApi) {
      const onSelect = () => {
        setCurrentIndex(emblaApi.selectedScrollSnap())
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

      return () => {
        emblaApi.off("select", onSelect)
        emblaApi.off("dragStart", onDragStart)
        emblaApi.off("dragEnd", onDragEnd)
      }
    }
  }, [emblaApi])

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

  // Handle liking a room
  const handleLikeRoom = (e: React.MouseEvent) => {
    e.stopPropagation()
    onLikeRoom(rooms[currentIndex])

    // Move to next room
    if (emblaApi) {
      emblaApi.scrollNext()
    }
  }

  // Handle disliking/skipping a room
  const handleDislikeRoom = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDislikeRoom(rooms[currentIndex])

    // Move to next room
    if (emblaApi) {
      emblaApi.scrollNext()
    }
  }

  // Handle selecting a room directly
  const handleSelectRoom = (index: number) => {
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
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-medium tracking-wide text-black">Furnished Rooms</h3>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-design-forest/5 text-design-forest border-design-forest/20">
            {rooms.length} Rooms
          </Badge>
        </div>
      </div>

      {/* Carousel */}
      <div className="relative mt-2 mb-2" ref={containerRef}>
        <div className={`embla ${isDragging ? "is-dragging" : ""}`} ref={emblaRef}>
          <div className="embla__container py-4 no-transition-on-loop">
            {rooms.map((room, index) => {
              const isActive = index === currentIndex
              const isLiked = likedRooms.includes(room.id)
              const isDisliked = dislikedRooms.includes(room.id)

              return (
                <div
                  key={room.id}
                  className={cn("embla__slide px-2", isActive ? "is-active" : "")}
                  onClick={() => handleSelectRoom(index)}
                >
                  <div
                    className={cn(
                      "bg-white rounded-lg transition-all duration-300 overflow-hidden",
                      isActive ? "scale-110 shadow-md z-10" : "scale-100 opacity-70",
                      isLiked ? "border-2 border-green-500" : "",
                      isDisliked ? "border-2 border-red-500" : "",
                    )}
                    style={{
                      width: isActive ? "400px" : "320px",
                      transformOrigin: "center center",
                    }}
                  >
                    <div className="relative w-full h-48">
                      <SafeImage src={room.image} itemName={room.name} fill className="object-cover" />
                    </div>

                    <div className="p-3">
                      {isActive ? (
                        <div className="flex flex-col w-full">
                          <div className="flex justify-between items-center mb-2">
                            <div>
                              <p className="text-xs text-gray-500 mb-1">{room.style} Style</p>
                              <p className="text-lg font-semibold text-black">{room.name}</p>
                            </div>
                            <Badge variant="outline" className="bg-design-forest/5 text-design-forest">
                              {room.roomType
                                .split("-")
                                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                                .join(" ")}
                            </Badge>
                          </div>

                          <div className="flex items-center justify-between w-full mt-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="rounded-full h-8 w-8 p-0 hover:bg-green-50 hover:text-green-600 border-design-forest/30"
                              onClick={handleLikeRoom}
                              title="Like this room"
                            >
                              <Check className="h-4 w-4" />
                            </Button>

                            <Button
                              variant="default"
                              size="sm"
                              className="bg-design-forest hover:bg-design-forest/90 text-white"
                              onClick={(e) => {
                                e.stopPropagation()
                                onSelectRoom(room)
                              }}
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              See Room
                            </Button>

                            <Button
                              variant="outline"
                              size="sm"
                              className="rounded-full h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600 border-gray-200"
                              onClick={handleDislikeRoom}
                              title="Dislike this room"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col w-full">
                          <p className="text-xs text-gray-500 mb-1">{room.style} Style</p>
                          <p className="text-lg font-semibold text-black truncate">{room.name}</p>
                          <Badge variant="outline" className="mt-1 w-fit bg-design-forest/5 text-design-forest">
                            {room.roomType
                              .split("-")
                              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                              .join(" ")}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Navigation buttons */}
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
