"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Check, CreditCard, X } from "lucide-react"
import SafeImage from "./safe-image"

interface CartItem {
  id: number
  name: string
  image: string
  price: number
  uniqueId: number
  categoryId: string
  categoryName: string
  roomType: string
  roomName: string
  manufacturer?: string
}

interface CheckoutPageProps {
  cartItems: CartItem[]
  onRemoveItem: (uniqueId: number) => void
  onReturn: () => void
}

export default function CheckoutPage({ cartItems, onRemoveItem, onReturn }: CheckoutPageProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  })

  const totalPrice = cartItems.reduce((total, item) => total + item.price, 0)
  const tax = totalPrice * 0.08
  const shipping = totalPrice > 1000 ? 0 : 99
  const grandTotal = totalPrice + tax + shipping

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false)
      setIsComplete(true)
    }, 2000)
  }

  // Group items by room type
  const itemsByRoom = cartItems.reduce(
    (acc, item) => {
      if (!acc[item.roomType]) {
        acc[item.roomType] = []
      }
      acc[item.roomType].push(item)
      return acc
    },
    {} as Record<string, CartItem[]>,
  )

  if (isComplete) {
    return (
      <div className="max-w-3xl mx-auto py-2">
        <Card className="h-[calc(100vh-240px)] flex flex-col justify-center">
          <CardHeader className="bg-gray-50 py-2">
            <CardTitle className="text-lg font-medium text-center">Order Confirmation</CardTitle>
          </CardHeader>
          <CardContent className="p-4 flex-grow flex flex-col items-center justify-center text-center">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mb-2">
              <Check className="h-5 w-5 text-green-600" />
            </div>
            <h2 className="text-xl font-bold mb-1">Thank You For Your Order!</h2>
            <p className="text-gray-600 mb-2 text-sm">Your order has been placed and is being processed.</p>
            <p className="font-medium text-sm mb-1">Order Number: DH-{Math.floor(Math.random() * 10000)}</p>
            <p className="text-gray-600 mb-3 text-sm">Estimated Delivery: 7-10 business days</p>

            <Button onClick={onReturn} className="bg-design-forest hover:bg-design-forest/90 h-8 text-sm">
              Continue Shopping
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto py-2">
      <h1 className="text-xl font-bold mb-3">Checkout</h1>

      <div className="grid grid-cols-3 gap-4">
        {/* Left side - Order summary */}
        <div className="col-span-1">
          <Card className="sticky top-24 min-h-[300px] max-h-[calc(100vh-180px)]">
            <CardHeader className="pb-1 pt-2 bg-gray-50">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base font-medium">Order Summary</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 rounded-full hover:bg-design-forest/10 hover:text-design-forest"
                  onClick={onReturn}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </div>
              <Separator className="mt-1" />
            </CardHeader>
            <CardContent className="p-3 flex flex-col" style={{ maxHeight: "calc(100% - 60px)" }}>
              <div className="flex-grow overflow-y-auto mb-2" style={{ maxHeight: "calc(100vh - 380px)" }}>
                {cartItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-[200px] text-gray-500">
                    <p className="font-medium text-black">Your cart is empty</p>
                    <p className="text-xs mt-1">Add items to your cart to see them here</p>
                  </div>
                ) : (
                  Object.entries(itemsByRoom).map(([roomType, items]) => (
                    <div key={roomType} className="mb-2">
                      <h3 className="text-xs font-semibold mb-1">{items[0].roomName}</h3>
                      <div className="space-y-1">
                        {items.map((item) => (
                          <div key={item.uniqueId} className="flex items-center gap-1 text-xs">
                            <div className="relative w-8 h-8 rounded-md overflow-hidden flex-shrink-0">
                              <SafeImage src={item.image} itemName={item.name} fill className="object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">{item.name}</p>
                              <p className="text-gray-500 text-xs">{item.categoryName}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">${item.price}</p>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-4 w-4 p-0 text-gray-400 hover:text-red-500"
                                onClick={() => onRemoveItem(item.uniqueId)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="mt-auto bg-white">
                <Separator className="my-2" />

                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (8%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping {totalPrice > 1000 ? "(Free)" : ""}</span>
                    <span>${shipping.toFixed(2)}</span>
                  </div>
                  <Separator className="my-1" />
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>${grandTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right side - Checkout form */}
        <div className="col-span-2">
          <Card className="h-[calc(100vh-180px)]">
            <CardHeader className="pb-1 pt-2 bg-gray-50">
              <CardTitle className="text-base font-medium">Payment Information</CardTitle>
              <Separator className="mt-1" />
            </CardHeader>
            <CardContent className="p-4 h-[calc(100%-60px)] overflow-y-auto">
              <form onSubmit={handleSubmit} className="text-sm h-full flex flex-col">
                <div className="grid grid-cols-2 gap-x-4 gap-y-3 flex-grow">
                  <div className="col-span-2">
                    <h3 className="text-xs font-semibold mb-1">Contact Information</h3>
                  </div>
                  <div className="col-span-1">
                    <Label htmlFor="name" className="text-xs">
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="h-8 mt-0.5 text-sm"
                    />
                  </div>
                  <div className="col-span-1">
                    <Label htmlFor="email" className="text-xs">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="h-8 mt-0.5 text-sm"
                    />
                  </div>

                  <div className="col-span-2 mt-1">
                    <h3 className="text-xs font-semibold mb-1">Shipping Address</h3>
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="address" className="text-xs">
                      Street Address
                    </Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      className="h-8 mt-0.5 text-sm"
                    />
                  </div>
                  <div className="col-span-1">
                    <Label htmlFor="city" className="text-xs">
                      City
                    </Label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="h-8 mt-0.5 text-sm"
                    />
                  </div>
                  <div className="col-span-1 grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="state" className="text-xs">
                        State
                      </Label>
                      <Input
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                        className="h-8 mt-0.5 text-sm"
                      />
                    </div>
                    <div>
                      <Label htmlFor="zip" className="text-xs">
                        ZIP Code
                      </Label>
                      <Input
                        id="zip"
                        name="zip"
                        value={formData.zip}
                        onChange={handleInputChange}
                        required
                        className="h-8 mt-0.5 text-sm"
                      />
                    </div>
                  </div>

                  <div className="col-span-2 mt-1">
                    <h3 className="text-xs font-semibold mb-1">Payment Details</h3>
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="cardNumber" className="text-xs">
                      Card Number
                    </Label>
                    <Input
                      id="cardNumber"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      required
                      className="h-8 mt-0.5 text-sm"
                      placeholder="1234 5678 9012 3456"
                    />
                  </div>
                  <div className="col-span-1">
                    <Label htmlFor="expiry" className="text-xs">
                      Expiration Date
                    </Label>
                    <Input
                      id="expiry"
                      name="expiry"
                      value={formData.expiry}
                      onChange={handleInputChange}
                      required
                      className="h-8 mt-0.5 text-sm"
                      placeholder="MM/YY"
                    />
                  </div>
                  <div className="col-span-1">
                    <Label htmlFor="cvv" className="text-xs">
                      CVV
                    </Label>
                    <Input
                      id="cvv"
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleInputChange}
                      required
                      className="h-8 mt-0.5 text-sm"
                      placeholder="123"
                    />
                  </div>
                </div>

                <div className="flex justify-end mt-6">
                  <Button
                    type="submit"
                    className="bg-design-forest hover:bg-design-forest/90 h-8 text-xs"
                    disabled={isProcessing || cartItems.length === 0}
                  >
                    {isProcessing ? (
                      "Processing..."
                    ) : (
                      <>
                        <CreditCard className="mr-1 h-3 w-3" />
                        Place Order
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
