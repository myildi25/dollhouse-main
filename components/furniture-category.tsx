"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Check, Minus, Search, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface FurnitureItem {
  id: number
  name: string
  image: string
  price: number
  rating: "good" | "neutral" | "bad" | null
}

interface FurnitureCategoryProps {
  category: {
    id: string
    name: string
    items: FurnitureItem[]
  }
  selectedItem: FurnitureItem
  onSelectItem: (item: FurnitureItem) => void
  onRatingChange: (itemId: number, rating: "good" | "neutral" | "bad") => void
}

export default function FurnitureCategory({
  category,
  selectedItem,
  onSelectItem,
  onRatingChange,
}: FurnitureCategoryProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredItems, setFilteredItems] = useState(category.items)
  const [visibleItems, setVisibleItems] = useState([])
  const [currentPage, setCurrentPage] = useState(0)
  const itemsPerPage = 4 // Show 4 items per page

  // Filter items based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredItems(category.items)
    } else {
      const filtered = category.items.filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
      setFilteredItems(filtered)
    }
    setCurrentPage(0) // Reset to first page when search changes
  }, [searchTerm, category.items])

  // Update visible items when filtered items or page changes
  useEffect(() => {
    const startIndex = currentPage * itemsPerPage
    setVisibleItems(filteredItems.slice(startIndex, startIndex + itemsPerPage))
  }, [filteredItems, currentPage, itemsPerPage])

  // Get border color based on rating
  const getBorderColor = (rating) => {
    if (rating === "good") return "border-green-500"
    if (rating === "neutral") return "border-yellow-500"
    if (rating === "bad") return "border-red-500"
    return ""
  }

  // Handle page navigation
  const handleNextPage = () => {
    if ((currentPage + 1) * itemsPerPage < filteredItems.length) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1)
    }
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">{category.name}</CardTitle>
          <div className="relative w-48">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
            <Input
              className="pl-7 h-8 text-sm"
              placeholder={`Search ${category.name.toLowerCase()}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-3">
          {visibleItems.map((item) => (
            <div key={item.id} className="relative">
              <div
                className={cn(
                  "border-2 bg-white rounded-lg p-3 flex flex-col items-center transition-all cursor-pointer h-full",
                  item.id === selectedItem.id ? "ring-2 ring-primary shadow-md" : "",
                  item.rating && getBorderColor(item.rating),
                )}
                onClick={() => onSelectItem(item)}
              >
                <div className="relative w-full h-28 mb-2">
                  <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-contain" />
                </div>
                <p className="text-xs font-medium text-center">{item.name}</p>
                <p className="text-xs text-gray-500">${item.price}</p>

                {/* Rating buttons in the corner */}
                <div className="absolute top-1 right-1 flex flex-col gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      "rounded-full h-5 w-5 p-0",
                      item.rating === "good" && "bg-green-100 border-green-500 text-green-600",
                    )}
                    onClick={(e) => {
                      e.stopPropagation()
                      onRatingChange(item.id, "good")
                    }}
                  >
                    <Check className="h-3 w-3" />
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      "rounded-full h-5 w-5 p-0",
                      item.rating === "neutral" && "bg-yellow-100 border-yellow-500 text-yellow-600",
                    )}
                    onClick={(e) => {
                      e.stopPropagation()
                      onRatingChange(item.id, "neutral")
                    }}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      "rounded-full h-5 w-5 p-0",
                      item.rating === "bad" && "bg-red-100 border-red-500 text-red-600",
                    )}
                    onClick={(e) => {
                      e.stopPropagation()
                      onRatingChange(item.id, "bad")
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {filteredItems.length > itemsPerPage && (
          <div className="flex justify-center mt-3">
            <div className="flex items-center gap-2 text-xs">
              <Button
                variant="outline"
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={handlePrevPage}
                disabled={currentPage === 0}
              >
                Previous
              </Button>
              <span>
                Page {currentPage + 1} of {Math.ceil(filteredItems.length / itemsPerPage)}
              </span>
              <Button
                variant="outline"
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={handleNextPage}
                disabled={(currentPage + 1) * itemsPerPage >= filteredItems.length}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
