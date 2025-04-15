"use client"

import { useState } from "react"
import { ShoppingCart, X, Eye } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import SafeImage from "./safe-image"

interface CartItem {
  id: number
  name: string
  image: string
  price: number
  uniqueId: number
  categoryId: string
  categoryName: string
  roomType?: string
  roomName?: string
  manufacturer?: string
}

interface CartSectionProps {
  cartItems: CartItem[]
  onRemoveItem: (uniqueId: number) => void
  onCheckout: () => void
}

export default function CartSection({ cartItems, onRemoveItem, onCheckout }: CartSectionProps) {
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const totalPrice = cartItems.reduce((total, item) => total + item.price, 0)

  // Group items by room type if available
  const groupedItems = cartItems.reduce(
    (acc, item) => {
      const key = item.roomType || "other"
      if (!acc[key]) {
        acc[key] = []
      }
      acc[key].push(item)
      return acc
    },
    {} as Record<string, CartItem[]>,
  )

  return (
    <Card className="h-full min-h-[255px] border border-gray-200 bg-white shadow-sm">
      <CardHeader className="pb-1 pt-3 pr-3 bg-gray-50">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <ShoppingCart className="h-4 w-4 mr-2 text-design-forest" />
            <CardTitle className="text-base font-medium tracking-wide text-black">
              Selected Items
              {cartItems.length > 0 && (
                <Badge variant="default" className="ml-2 bg-design-forest text-white">
                  {cartItems.length}
                </Badge>
              )}
            </CardTitle>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-black">
              Total: <span className="text-design-forest">${totalPrice.toFixed(2)}</span>
            </span>
            <Button
              className="h-8 text-xs px-3 bg-design-forest hover:bg-design-forest/90 text-white font-medium"
              onClick={onCheckout}
              disabled={isCheckingOut || cartItems.length === 0}
              variant="default"
            >
              {isCheckingOut ? (
                "Processing..."
              ) : (
                <>
                  <Eye className="mr-2 h-3 w-3" />
                  See Cart
                </>
              )}
            </Button>
          </div>
        </div>
        <Separator className="mt-2 bg-gray-200" />
      </CardHeader>
      <CardContent className="p-4 py-6">
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[175px] text-gray-500">
            <p className="font-medium text-black">No items selected</p>
            <p className="text-xs mt-1">Add furniture to your room to see it here</p>
          </div>
        ) : (
          <div className="overflow-x-auto pb-2 max-w-full h-[175px]">
            {Object.entries(groupedItems).length > 1 ? (
              // If we have multiple room types, show them grouped
              <div className="space-y-4">
                {Object.entries(groupedItems).map(([roomType, items]) => (
                  <div key={roomType}>
                    <h3 className="text-xs font-semibold mb-2">
                      {items[0].roomName || roomType.charAt(0).toUpperCase() + roomType.slice(1)}
                    </h3>
                    <div className="flex gap-3 min-w-max px-1">
                      {items.map((item) => (
                        <div
                          key={item.uniqueId}
                          className="cart-item-refined p-2 flex flex-col items-center min-w-[100px] max-w-[100px] relative pt-4 mt-2 mx-1 h-[120px] justify-between"
                        >
                          <Button
                            variant="destructive"
                            size="sm"
                            className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 z-10 bg-gray-800 hover:bg-black"
                            onClick={() => onRemoveItem(item.uniqueId)}
                          >
                            <X className="h-3 w-3" />
                          </Button>

                          <div className="relative w-full h-12 mb-2 flex items-center justify-center">
                            <SafeImage src={item.image} itemName={item.name} fill className="object-contain" />
                          </div>
                          <div className="flex flex-col items-center justify-center w-full">
                            <p className="text-xs font-semibold text-center w-full text-black line-clamp-2 h-8">
                              {item.name}
                            </p>
                            <p className="text-sm text-design-forest font-bold mt-1">${item.price}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // If we have only one room type, show items directly
              <div className="flex gap-3 min-w-max px-1">
                {cartItems.map((item) => (
                  <div
                    key={item.uniqueId}
                    className="cart-item-refined p-2 flex flex-col items-center min-w-[100px] max-w-[100px] relative pt-4 mt-2 mx-1 h-[120px] justify-between"
                  >
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 z-10 bg-gray-800 hover:bg-black"
                      onClick={() => onRemoveItem(item.uniqueId)}
                    >
                      <X className="h-3 w-3" />
                    </Button>

                    <div className="relative w-full h-12 mb-2 flex items-center justify-center">
                      <SafeImage src={item.image} itemName={item.name} fill className="object-contain" />
                    </div>
                    <div className="flex flex-col items-center justify-center w-full">
                      <p className="text-xs font-semibold text-center w-full text-black line-clamp-2 h-8">
                        {item.name}
                      </p>
                      <p className="text-sm text-design-forest font-bold mt-1">${item.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
