"use client"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"

interface FurnitureItem {
  id: number
  name: string
  image: string
}

interface FurnitureCarouselProps {
  items: FurnitureItem[]
  selectedItem: FurnitureItem
  onSelect: (item: FurnitureItem) => void
}

export default function FurnitureCarousel({ items, selectedItem, onSelect }: FurnitureCarouselProps) {
  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      className="w-full"
    >
      <CarouselContent className="-ml-4">
        {items.map((item) => (
          <CarouselItem key={item.id} className="pl-4 md:basis-1/3">
            <div className="p-1">
              <Card
                className={cn(
                  "cursor-pointer transition-all duration-200 h-full",
                  item.id === selectedItem.id ? "ring-2 ring-primary shadow-md" : "hover:shadow-md",
                )}
                onClick={() => onSelect(item)}
              >
                <CardContent className="flex flex-col items-center justify-between p-4 h-full">
                  <div className="relative w-full h-32 mb-3">
                    <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-contain" />
                  </div>
                  <p className="text-sm font-medium text-center">{item.name}</p>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="flex justify-end gap-1 mt-3">
        <CarouselPrevious className="relative inset-auto h-8 w-8" />
        <CarouselNext className="relative inset-auto h-8 w-8" />
      </div>
    </Carousel>
  )
}
