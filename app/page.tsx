"use client"

import { Separator } from "@/components/ui/separator"
import { X, ShoppingCart, Pencil, Sparkles, Plus, Sliders, ArrowLeft, Layout } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { Canvas } from "@react-three/fiber"
import { Environment, OrbitControls } from "@react-three/drei"
import FurnitureSelector from "@/components/furniture-selector"
import RoomPreview from "@/components/room-preview"
import CartSection from "@/components/cart-section"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import SafeImage from "@/components/safe-image"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import CheckoutPage from "@/components/checkout-page"
import FurnishedRoomView from "@/components/furnished-room-view"
import FurnishedRoomCarousel from "@/components/furnished-room-carousel"

// Import furniture data from a separate file to keep page.tsx smaller
import { roomFurnitureCategories } from "@/data/furniture-data"
import { furnishedRoomsData } from "@/data/furnished-rooms-data"

export default function HomePage() {
  const [activeRoom, setActiveRoom] = useState("living-room")
  const [cartItems, setCartItems] = useState([])
  const rightColumnRef = useRef(null)
  const [showFilters, setShowFilters] = useState(false)
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [viewingFurnishedRoom, setViewingFurnishedRoom] = useState(null)
  const [recommendedItems, setRecommendedItems] = useState([])
  const [priceRange, setPriceRange] = useState([0, 2000])
  const [selectedStyles, setSelectedStyles] = useState({
    modern: false,
    traditional: false,
    minimalist: false,
    industrial: false,
    scandinavian: false,
  })
  const [selectedColors, setSelectedColors] = useState({
    black: false,
    white: false,
    brown: false,
    gray: false,
    blue: false,
  })

  // Add these state variables after the existing state declarations
  const [selectedMaterials, setSelectedMaterials] = useState({
    Wood: false,
    Metal: false,
    Glass: false,
    Fabric: false,
    Leather: false,
    Plastic: false,
    Marble: false,
  })

  const [selectedBrands, setSelectedBrands] = useState({
    "Anees Upholstery": false,
    "American Leather": false,
    "Century Furniture": false,
    Bernhardt: false,
    "Fine Art Lamps": false,
  })

  const [activeFilters, setActiveFilters] = useState([])
  const [currentRoomCategories, setCurrentRoomCategories] = useState(roomFurnitureCategories["living-room"] || [])
  const [designingFurnishedRoom, setDesigningFurnishedRoom] = useState(null)

  // Track chosen furniture for each room type
  const [allChosenFurniture, setAllChosenFurniture] = useState({
    "living-room": {},
    bedroom: {},
    "dining-room": {},
    office: {},
    bathroom: {},
    kitchen: {},
    patio: {},
  })

  // Track current selection for each room type
  const [allCurrentSelections, setAllCurrentSelections] = useState({
    "living-room": {},
    bedroom: {},
    "dining-room": {},
    office: {},
    bathroom: {},
    kitchen: {},
    patio: {},
  })

  // Add checkout state
  const [showCheckout, setShowCheckout] = useState(false)

  // First, add a new state variable for the modal design mode
  const [isDesignModeModal, setIsDesignModeModal] = useState(false)

  // Add these state variables after the existing state declarations
  const [isCartModal, setIsCartModal] = useState(false)
  const [isFurnishedRoomsModal, setIsFurnishedRoomsModal] = useState(false)

  // Add state for liked and disliked rooms
  const [likedRooms, setLikedRooms] = useState<number[]>([])
  const [dislikedRooms, setDislikedRooms] = useState<number[]>([])

  // Initialize chosen furniture and current selections for each room
  useEffect(() => {
    const initialChosenFurniture = { ...allChosenFurniture }
    const initialCurrentSelections = { ...allCurrentSelections }

    // Initialize for all room types
    Object.keys(roomFurnitureCategories).forEach((roomType) => {
      if (!initialChosenFurniture[roomType]) {
        initialChosenFurniture[roomType] = {}
      }

      if (!initialCurrentSelections[roomType]) {
        initialCurrentSelections[roomType] = {}
      }

      // Initialize categories for this room type
      if (roomFurnitureCategories[roomType]) {
        roomFurnitureCategories[roomType].forEach((category) => {
          if (!initialChosenFurniture[roomType][category.id]) {
            initialChosenFurniture[roomType][category.id] = []
          }

          if (!initialCurrentSelections[roomType][category.id] && category.items && category.items.length > 0) {
            initialCurrentSelections[roomType][category.id] = category.items[0]
          }
        })
      }
    })

    setAllChosenFurniture(initialChosenFurniture)
    setAllCurrentSelections(initialCurrentSelections)

    // Initialize currentRoomCategories with the active room's categories
    setCurrentRoomCategories(roomFurnitureCategories[activeRoom] || [])

    // Initialize recommended items
    setRecommendedItems(getRecommendedItems(activeRoom))
  }, [])

  // Update current room categories when room type changes
  useEffect(() => {
    const categories = roomFurnitureCategories[activeRoom]
    setCurrentRoomCategories(categories)

    // Update recommended items for the new room
    setRecommendedItems(getRecommendedItems(activeRoom))
  }, [activeRoom])

  // Calculate total price across all rooms
  const totalPrice = cartItems.reduce((acc, item) => acc + item.price, 0)

  // Get current chosen furniture for active room
  const chosenFurniture = allChosenFurniture[activeRoom] || {}

  // Get current selections for active room
  const currentSelections = allCurrentSelections[activeRoom] || {}

  // Create a list of recommended furniture items for the design mode
  const getRecommendedItems = (roomType = "living-room") => {
    // Get a random selection of items from each category for the specific room type
    const recommendations = []
    const categories = roomFurnitureCategories[roomType]

    if (!categories) return []

    categories.forEach((category) => {
      const items = [...category.items]
      // Shuffle the items
      for (let i = items.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[items[i], items[j]] = [items[j], items[i]]
      }

      // Take 2-3 random items from each category
      const count = Math.floor(Math.random() * 2) + 2 // 2-3 items
      const selectedItems = items.slice(0, count).map((item) => ({
        ...item,
        categoryId: category.id,
        categoryName: category.name,
      }))

      recommendations.push(...selectedItems)
    })

    return recommendations
  }

  // Add furniture to chosen list
  const addToChosen = (categoryId, item) => {
    const uniqueId = Date.now()

    // Update chosen furniture for the current room
    setAllChosenFurniture((prev) => {
      const updatedRoom = {
        ...prev[activeRoom],
        [categoryId]: [...(prev[activeRoom]?.[categoryId] || []), { ...item, uniqueId }],
      }

      return {
        ...prev,
        [activeRoom]: updatedRoom,
      }
    })

    // Add to cart
    const category = currentRoomCategories.find((cat) => cat.id === categoryId)
    setCartItems((prev) => [
      ...prev,
      {
        ...item,
        uniqueId,
        categoryId,
        categoryName: category ? category.name : categoryId,
        roomType: activeRoom,
        roomName: roomTypes.find((room) => room.id === activeRoom)?.name || activeRoom,
      },
    ])

    // Remove the item from recommendations
    setRecommendedItems((prev) =>
      prev.filter((recItem) => recItem.id !== item.id || recItem.categoryId !== item.categoryId),
    )
  }

  // Remove furniture from chosen list and cart
  const removeFromChosen = (categoryId, uniqueId) => {
    // Find which room this item belongs to
    let roomType = activeRoom
    for (const [room, categories] of Object.entries(allChosenFurniture)) {
      for (const [catId, items] of Object.entries(categories)) {
        if (catId === categoryId && items.some((item) => item.uniqueId === uniqueId)) {
          roomType = room
          break
        }
      }
    }

    // Update chosen furniture for the specific room
    setAllChosenFurniture((prev) => {
      const updatedRoom = { ...prev[roomType] }
      if (updatedRoom[categoryId]) {
        updatedRoom[categoryId] = updatedRoom[categoryId].filter((item) => item.uniqueId !== uniqueId)
      }

      return {
        ...prev,
        [roomType]: updatedRoom,
      }
    })

    // Remove from cart
    removeFromCart(uniqueId)
  }

  // Remove item from cart
  const removeFromCart = (uniqueId) => {
    // Find the item to get its categoryId and roomType
    const itemToRemove = cartItems.find((item) => item.uniqueId === uniqueId)

    if (itemToRemove) {
      // Remove from chosen furniture
      setAllChosenFurniture((prev) => {
        const roomType = itemToRemove.roomType || activeRoom
        const categoryId = itemToRemove.categoryId

        // Create a new object to avoid mutating state
        const updatedChosenFurniture = { ...prev }

        // Make sure the room and category exist
        if (updatedChosenFurniture[roomType] && updatedChosenFurniture[roomType][categoryId]) {
          // Filter out the item with the matching uniqueId
          updatedChosenFurniture[roomType][categoryId] = updatedChosenFurniture[roomType][categoryId].filter(
            (item) => item.uniqueId !== uniqueId,
          )
        }

        return updatedChosenFurniture
      })

      // Remove from cart
      setCartItems((prev) => prev.filter((item) => item.uniqueId !== uniqueId))
    }
  }

  // Set current selection
  const setCurrentSelection = (categoryId, item) => {
    setAllCurrentSelections((prev) => {
      const updatedRoom = {
        ...prev[activeRoom],
        [categoryId]: item,
      }

      return {
        ...prev,
        [activeRoom]: updatedRoom,
      }
    })
  }

  // Update the toggleDesignMode function to use the modal approach
  const toggleDesignMode = () => {
    if (isDesignModeModal) {
      // Exiting design mode
      setIsDesignModeModal(false)
      setDesigningFurnishedRoom(null)
    } else {
      // Entering design mode
      setIsDesignModeModal(true)
      setShowFilters(false)
      setIsFurnishedRoomsModal(false)
      setViewingFurnishedRoom(null)
      setRecommendedItems(getRecommendedItems(activeRoom))
    }
  }

  // Add a new function to close the design mode modal
  const closeDesignModeModal = () => {
    setIsDesignModeModal(false)
    setDesigningFurnishedRoom(null)
  }

  // Update the goToCheckout function
  const goToCheckout = () => {
    setIsCartModal(true)
  }

  // Return from checkout
  const returnFromCheckout = () => {
    setIsCartModal(false)
    setIsCheckingOut(false)
  }

  // Update the function to toggle furnished rooms
  const toggleFurnishedRooms = () => {
    setIsFurnishedRoomsModal(!isFurnishedRoomsModal)
  }

  // Add a function to close the furnished rooms modal
  const closeFurnishedRoomsModal = () => {
    setIsFurnishedRoomsModal(false)
    setViewingFurnishedRoom(null)
  }

  // Room types with icons
  const roomTypes = [
    { id: "living-room", name: "Living", icon: "Sofa" },
    { id: "dining-room", name: "Dining", icon: "Utensils" },
    { id: "bedroom", name: "Bedroom", icon: "Bed" },
    { id: "bathroom", name: "Bathroom", icon: "Bath" },
    { id: "kitchen", name: "Kitchen", icon: "ChefHat" },
    { id: "office", name: "Office", icon: "Briefcase" },
    { id: "patio", name: "Patio", icon: "Stairs" }, // Changed icon to Stairs
  ]

  // Handle room type change
  const handleRoomTypeChange = (roomId) => {
    if (designingFurnishedRoom) {
      // If designing a furnished room, go back to browse mode
      setDesigningFurnishedRoom(null)
      setIsDesignModeModal(false)
      setIsFurnishedRoomsModal(true)
    }

    setActiveRoom(roomId)

    // Ensure we update the current room categories
    const categories = roomFurnitureCategories[roomId]
    if (categories) {
      setCurrentRoomCategories(categories)
    }

    // Update recommended items for the new room
    setRecommendedItems(getRecommendedItems(roomId))
  }

  // Import icons dynamically
  const getIcon = (iconName) => {
    const icons = {
      Sofa: () => (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M2 14h20v4a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-4Z" />
          <path d="M6 18v2" />
          <path d="M18 18v2" />
          <path d="M6 14v-3a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v3" />
        </svg>
      ),
      Utensils: () => (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
          <path d="M7 2v20" />
          <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
        </svg>
      ),
      Bed: () => (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M2 9V4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5" />
          <path d="M2 11v5a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v2H6v-2a2 2 0 0 0-4 0Z" />
          <path d="M4 18v2" />
          <path d="M20 18v2" />
        </svg>
      ),
      Bath: () => (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5C4.683 3 4 3.683 4 4.5V17a2 2 0 0 2 2h12a2 2 0 0 2-2v-5" />
          <line x1="10" x2="8" y1="5" y2="7" />
          <line x1="2" x2="22" y1="12" y2="12" />
          <line x1="7" x2="7" y1="19" y2="21" />
          <line x1="17" x2="17" y1="19" y2="21" />
        </svg>
      ),
      ChefHat: () => (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path
            d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0
        0 1 18 13.87V21H6Z"
          />
          <line x1="6" x2="18" y1="17" y2="17" />
        </svg>
      ),
      Briefcase: () => (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
      ),
      Stairs: () => (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 6h16" />
          <path d="M4 12h8" />
          <path d="M4 18h12" />
        </svg>
      ),
    }

    const Icon = icons[iconName]
    return Icon ? <Icon /> : null
  }

  // Render the 3D preview component
  const renderPreview = () => (
    <div className="w-full h-full">
      <Canvas>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <RoomPreview
          chosenFurniture={chosenFurniture}
          currentSelections={currentSelections}
          roomType={activeRoom}
          allChosenFurniture={allChosenFurniture}
          allCurrentSelections={allCurrentSelections}
        />
        <OrbitControls enableZoom={true} />
        <Environment preset="apartment" />
      </Canvas>
    </div>
  )

  // Apply filters
  const applyFilters = () => {
    const filters = []

    // Add price range if not default
    if (priceRange[0] > 0 || priceRange[1] < 2000) {
      filters.push(`${priceRange[0]}-${priceRange[1]}`)
    }

    // Add selected styles
    Object.keys(selectedStyles).forEach((style) => {
      if (selectedStyles[style]) {
        filters.push(style.charAt(0).toUpperCase() + style.slice(1))
      }
    })

    // Add selected colors
    Object.keys(selectedColors).forEach((color) => {
      if (selectedColors[color]) {
        filters.push(color.charAt(0).toUpperCase() + color.slice(1))
      }
    })

    // Add selected materials
    Object.keys(selectedMaterials).forEach((material) => {
      if (selectedMaterials[material]) {
        filters.push(material)
      }
    })

    // Add selected brands
    Object.keys(selectedBrands).forEach((brand) => {
      if (selectedBrands[brand]) {
        filters.push(brand)
      }
    })

    setActiveFilters(filters)
    setShowFilters(false)
  }

  const resetFilters = () => {
    setPriceRange([0, 2000])
    setSelectedStyles({
      modern: false,
      traditional: false,
      minimalist: false,
      industrial: false,
      scandinavian: false,
    })
    setSelectedColors({
      black: false,
      white: false,
      brown: false,
      gray: false,
      blue: false,
    })
    setSelectedMaterials({
      Wood: false,
      Metal: false,
      Glass: false,
      Fabric: false,
      Leather: false,
      Plastic: false,
      Marble: false,
    })
    setSelectedBrands({
      "Anees Upholstery": false,
      "American Leather": false,
      "Century Furniture": false,
      Bernhardt: false,
      "Fine Art Lamps": false,
    })
    setActiveFilters([])
  }

  // Handle liking a room
  const handleLikeRoom = (room) => {
    setLikedRooms((prev) => {
      if (prev.includes(room.id)) {
        return prev
      }
      return [...prev, room.id]
    })

    // Remove from disliked if it was there
    setDislikedRooms((prev) => prev.filter((id) => id !== room.id))
  }

  // Handle disliking a room
  const handleDislikeRoom = (room) => {
    setDislikedRooms((prev) => {
      if (prev.includes(room.id)) {
        return prev
      }
      return [...prev, room.id]
    })

    // Remove from liked if it was there
    setLikedRooms((prev) => prev.filter((id) => id !== room.id))
  }

  // Load a furnished room's furniture into the cart
  const loadFurnishedRoom = (room) => {
    // First, clear any existing items from the room type
    const roomType = room.roomType

    // Clear chosen furniture for this room type
    setAllChosenFurniture((prev) => ({
      ...prev,
      [roomType]: {},
    }))

    // Remove any cart items from this room type
    setCartItems((prev) => prev.filter((item) => item.roomType !== roomType))

    // Now add the furniture from the furnished room
    if (room.furniture && room.furniture.length > 0) {
      // Set active room to the room type
      setActiveRoom(roomType)

      // Get the categories for this room type
      const categories = roomFurnitureCategories[roomType] || []

      // Add each furniture item
      room.furniture.forEach((furnitureRef) => {
        const { categoryId, itemId } = furnitureRef

        // Find the category
        const category = categories.find((cat) => cat.id === categoryId)
        if (category) {
          // Find the item
          const item = category.items.find((item) => item.id === itemId)
          if (item) {
            // Add to chosen furniture
            addToChosen(categoryId, item)
          }
        }
      })
    }

    // Close the furnished rooms modal
    setIsFurnishedRoomsModal(false)
  }

  // View furnished room
  const viewFurnishedRoom = (room) => {
    setViewingFurnishedRoom(room)
  }

  // Return to furnished rooms list
  const returnToFurnishedRooms = () => {
    setViewingFurnishedRoom(null)
  }

  // Go to design mode from furnished room
  const designFurnishedRoom = (room) => {
    setDesigningFurnishedRoom(room)
    setIsDesignModeModal(true)
    setViewingFurnishedRoom(null)
    setIsFurnishedRoomsModal(false)
    setActiveRoom(room.roomType)
  }

  // Render the header
  const renderHeader = () => (
    <div className="w-full px-4 mb-0 rounded-none bg-white">
      <div className="flex justify-between items-center py-3 mb-0">
        <div className="flex items-center">
          <div className="w-10 h-10 mr-2 flex items-center justify-center">
            <SafeImage
              src="/logo.png" // Using a file that exists in the public directory
              fallbackSrc="/whimsical-dollhouse-logo.png"
              width={40}
              height={40}
              alt="Dollhouse Logo"
              className="relative -top-0.5"
            />
          </div>
          <h1 className="text-3xl font-medium tracking-wide mb-0 mr-6 text-black">Dollhouse</h1>

          <div className="flex gap-2 ml-4 items-center">
            {roomTypes.map((room) => {
              // Check if there are any items in the cart from this room type
              const hasItemsInCart = cartItems.some((item) => item.roomType === room.id)

              return (
                <button
                  key={room.id}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium relative ${
                    activeRoom === room.id
                      ? "bg-design-forest/10 text-design-forest"
                      : hasItemsInCart
                        ? "text-design-forest bg-design-forest/5 hover:bg-design-forest/10"
                        : "text-black hover:bg-gray-100"
                  }`}
                  onClick={() => handleRoomTypeChange(room.id)}
                >
                  <span className={`flex items-center justify-center ${hasItemsInCart ? "text-design-forest" : ""}`}>
                    {getIcon(room.icon)}
                  </span>
                  <span>{room.name}</span>
                  {hasItemsInCart && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-design-forest rounded-full"></span>
                  )}
                </button>
              )
            })}

            {/* Filters button moved here with a small gap */}
            {!isDesignModeModal && !isCartModal && !viewingFurnishedRoom && (
              <div className="ml-4 flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 border-design-forest/30 text-design-forest hover:bg-design-forest/5"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Sliders className="h-4 w-4" />
                  Filters
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {!isDesignModeModal && !isCartModal && !viewingFurnishedRoom && (
            <Button
              variant="default"
              size="sm"
              className="flex items-center gap-2 border-none bg-design-forest text-white hover:bg-design-forest/90 shadow-sm"
              onClick={toggleFurnishedRooms}
            >
              <Layout className="h-4 w-4 mr-1" />
              Browse Furnished
            </Button>
          )}

          {!isCartModal && (
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 border-design-forest/30 text-design-forest hover:bg-design-forest/5 relative"
              onClick={goToCheckout}
            >
              <ShoppingCart className="h-4 w-4" />
              Cart
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-design-forest text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </Button>
          )}
        </div>
      </div>
      <Separator className="bg-gray-200 mb-0" />
    </div>
  )

  // Update the renderBuyMode function to add a null check before mapping
  const renderBuyMode = () => (
    <div className="grid grid-cols-3 gap-6">
      {/* Left side - Furniture Categories (2/3 width) */}
      <div className="col-span-2">
        <div className="h-[calc(100vh-120px)] overflow-auto pt-3">
          <div className="space-y-6 p-4 pb-0">
            {currentRoomCategories && currentRoomCategories.length > 0 ? (
              currentRoomCategories.map((category, index) => (
                <div key={category.id} className={index === currentRoomCategories.length - 1 ? "mb-6" : "mb-0"}>
                  <FurnitureSelector
                    category={category}
                    currentSelection={
                      currentSelections[category.id] || (category.items.length > 0 ? category.items[0] : null)
                    }
                    chosenItems={chosenFurniture[category.id] || []}
                    onSelectCurrent={(item) => setCurrentSelection(category.id, item)}
                    onAddToChosen={(item) => addToChosen(category.id, item)}
                    onRemoveFromChosen={(uniqueId) => removeFromChosen(category.id, uniqueId)}
                  />
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-[600px]">
                <p className="text-gray-500">No furniture categories available for this room type.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right side - 3D Room Preview and Cart (1/3 width) */}
      <div className="col-span-1 flex flex-col gap-4 sticky top-24" ref={rightColumnRef}>
        {/* 3D Room Preview */}
        <div className="pt-3">
          <Card className="h-full border border-gray-200 bg-white shadow-sm">
            <CardHeader className="pb-2 pt-3 pr-3 bg-gray-50">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base font-medium tracking-wide text-black">Room Preview</CardTitle>
                <Button
                  variant="default"
                  size="sm"
                  className="h-8 text-xs px-3 bg-design-forest hover:bg-design-forest/90 text-white font-medium"
                  onClick={toggleDesignMode}
                >
                  <Pencil className="h-3 w-3 mr-1" />
                  Design Mode
                </Button>
              </div>
              <Separator className="mt-2 bg-gray-200" />
            </CardHeader>
            <CardContent className="p-0 h-[380px] preview-container pt-2">{renderPreview()}</CardContent>
          </Card>
        </div>

        {/* Cart Section */}
        <div className="h-[230px] mb-4">
          <CartSection cartItems={cartItems} onRemoveItem={removeFromCart} onCheckout={goToCheckout} />
        </div>
      </div>
    </div>
  )

  // Render the Design Mode content
  const renderDesignMode = () => (
    <div className="grid grid-cols-12 gap-6 h-[700px]">
      {/* Left side - Recommendations (3/12 width) */}
      <div className="col-span-3 pt-3">
        <Card className="border border-gray-200 bg-white shadow-sm h-[680px] flex flex-col">
          <CardHeader className="pb-1 pt-3 pr-3 bg-gray-50">
            <div className="flex justify-between items-center">
              <CardTitle className="text-base font-medium tracking-wide text-black">
                {designingFurnishedRoom ? designingFurnishedRoom.name : "Recommendations"}
              </CardTitle>
              <Badge
                variant="outline"
                className="text-xs bg-design-forest/5 text-design-forest border-design-forest/20"
              >
                For You
              </Badge>
            </div>
            <Separator className="mt-2 bg-gray-200" />
          </CardHeader>
          <CardContent className="p-4 pb-2 overflow-auto flex-grow">
            <div className="space-y-3">
              {/* Ensure first item is a sofa */}
              {recommendedItems
                .sort((a, b) => {
                  // Sort by category priority based on room type
                  const getCategoryPriority = (item) => {
                    if (activeRoom === "living-room") {
                      if (item.categoryId === "sofas") return 1
                      if (item.categoryId === "chairs") return 2
                      if (item.categoryId === "coffee-tables") return 3
                    } else if (activeRoom === "bedroom") {
                      if (item.categoryId === "beds") return 1
                      if (item.categoryId === "nightstands") return 2
                      if (item.categoryId === "dressers") return 3
                    } else if (activeRoom === "dining-room") {
                      if (item.categoryId === "dining-tables") return 1
                      if (item.categoryId === "dining-chairs") return 2
                      if (item.categoryId === "buffets") return 3
                    } else if (activeRoom === "office") {
                      if (item.categoryId === "desks") return 1
                      if (item.categoryId === "office-chairs") return 2
                      if (item.categoryId === "bookcases") return 3
                    } else if (activeRoom === "bathroom") {
                      if (item.categoryId === "vanities") return 1
                      if (item.categoryId === "bathroom-storage") return 2
                      if (item.categoryId === "bathroom-fixtures") return 3
                    } else if (activeRoom === "kitchen") {
                      if (item.categoryId === "kitchen-islands") return 1
                      if (item.categoryId === "bar-stools") return 2
                      if (item.categoryId === "kitchen-storage") return 3
                    } else if (activeRoom === "patio") {
                      if (item.categoryId === "outdoor-seating") return 1
                      if (item.categoryId === "outdoor-tables") return 2
                      if (item.categoryId === "outdoor-lighting") return 3
                    }
                    return 4
                  }
                  return getCategoryPriority(a) - getCategoryPriority(b)
                })
                .map((item, index) => (
                  <div
                    key={`${item.id}-${index}`}
                    className="flex flex-col bg-white rounded-lg border border-gray-200 p-2 shadow-sm hover:shadow-md transition-all cursor-pointer"
                  >
                    <div className="relative w-full h-24 mb-2">
                      <SafeImage src={item.image} itemName={item.name} fill className="object-contain" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 mb-1">{item.manufacturer}</p>
                      <p className="text-sm font-medium text-black line-clamp-2 h-10">{item.name}</p>
                      <div className="flex justify-between items-center mt-2">
                        <p className="text-sm font-semibold text-design-forest">${item.price}</p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 w-7 p-0 rounded-full hover:bg-design-forest/10 hover:text-design-forest"
                          onClick={() => addToChosen(item.categoryId, item)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Middle - 3D Room Preview (6/12 width) */}
      <div className="col-span-6 pt-3">
        <Card className="border border-gray-200 rounded-lg bg-white shadow-sm h-[98%]">
          <CardHeader className="pb-2 pt-3 pr-3 bg-gray-50">
            <div className="flex justify-between items-center">
              <CardTitle className="text-base font-medium tracking-wide text-black">Room Preview</CardTitle>
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs px-3 border-design-forest/30 text-design-forest hover:bg-design-forest/5 font-medium"
                onClick={toggleDesignMode}
              >
                <ArrowLeft className="h-3 w-3 mr-1" />
                Browse Mode
              </Button>
            </div>
            <Separator className="mt-2 bg-gray-200" />
          </CardHeader>
          <CardContent className="p-0 h-[620px] preview-container pt-2">{renderPreview()}</CardContent>
        </Card>
      </div>

      {/* Right side - Selected Furniture and Dolly chatbox (3/12 width) */}
      <div className="col-span-3 flex flex-col gap-4 pt-3">
        {/* Selected Items */}
        <Card className="border border-gray-200 bg-white shadow-sm h-[350px] flex flex-col">
          <CardHeader className="pb-1 pt-3 pr-3 bg-gray-50">
            <div className="flex justify-between items-center">
              <CardTitle className="text-base font-medium tracking-wide text-black">Selected Items</CardTitle>
              <Badge
                variant="outline"
                className="text-xs bg-design-forest/5 text-design-forest border-design-forest/20"
              >
                {cartItems.length} Items
              </Badge>
            </div>
            <Separator className="mt-2 bg-gray-200" />
          </CardHeader>
          <CardContent className="p-4 pb-2 overflow-hidden flex-grow" style={{ maxHeight: "calc(100% - 100px)" }}>
            <div className="h-full overflow-y-auto pr-1">
              {Object.keys(chosenFurniture).map((categoryId) => {
                const items = chosenFurniture[categoryId] || []
                if (items.length === 0) return null

                const category = currentRoomCategories.find((cat) => cat.id === categoryId)
                const categoryName = category ? category.name : categoryId

                return (
                  <div key={categoryId} className="mb-4">
                    <h3 className="text-sm font-semibold mb-2 text-black">{categoryName}</h3>
                    <div className="space-y-2">
                      {items.map((item) => (
                        <div
                          key={item.uniqueId}
                          className="flex items-center bg-white rounded-lg border border-gray-200 p-2 shadow-sm"
                        >
                          <div className="relative w-10 h-10 rounded-md overflow-hidden mr-3 flex-shrink-0">
                            <SafeImage src={item.image} itemName={item.name} fill className="object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate text-black">{item.name}</p>
                            <p className="text-xs text-design-forest font-semibold">${item.price}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 rounded-full p-0 ml-1 hover:bg-red-50 hover:text-red-500"
                            onClick={() => removeFromChosen(categoryId, item.uniqueId!)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}

              {Object.values(chosenFurniture).every((items) => !items || items.length === 0) && (
                <div className="flex flex-col items-center justify-center h-[120px] text-gray-500">
                  <p className="font-medium text-black">No items selected</p>
                  <p className="text-xs mt-1">Add furniture to your room to see it here</p>
                </div>
              )}
            </div>
          </CardContent>
          <div className="px-2 py-2 border-t border-gray-200 mt-auto">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-design-forest ml-4">${totalPrice.toFixed(2)}</span>
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs px-3 border-design-forest/30 text-design-forest hover:bg-design-forest/5 relative"
                onClick={goToCheckout}
                disabled={cartItems.length === 0}
              >
                <ShoppingCart className="h-4 w-4 mr-1" />
                Cart
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-design-forest text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItems.length}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </Card>

        {/* Dolly Chatbox */}
        <Card className="border border-gray-200 bg-white shadow-sm h-[320px]">
          <CardHeader className="pb-1 pt-3 pr-3 bg-gray-50">
            <div className="flex items-center pl-2">
              <Sparkles className="h-4 w-4 mr-2 text-design-forest" />
              <CardTitle className="text-base font-medium tracking-wide text-black">Dolly</CardTitle>
            </div>
            <Separator className="mt-2 bg-gray-200" />
          </CardHeader>
          <CardContent className="p-0 flex flex-col h-[calc(100%-60px)]">
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              <div className="bg-gray-100 rounded-lg p-2 text-sm max-w-[85%]">
                <p>Hi, I'm Dolly! How can I help with your room design today?</p>
              </div>
              <div className="bg-design-forest/10 rounded-lg p-2 text-sm max-w-[85%] ml-auto">
                <p>I'd like to create a cozy living room.</p>
              </div>
              <div className="bg-gray-100 rounded-lg p-2 text-sm max-w-[85%]">
                <p>
                  Great choice! I suggest adding a comfortable sofa, a coffee table, and some warm lighting. Would you
                  like me to recommend specific pieces?
                </p>
              </div>
            </div>
            <div className="border-t border-gray-200 p-2">
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Ask Dolly about your design..."
                  className="text-sm border-design-forest/20 focus:border-design-forest"
                />
                <Button size="sm" className="bg-design-forest hover:bg-design-forest/90 text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m22 2-7 20-4-9-9-4Z" />
                    <path d="M22 2 11 13" />
                  </svg>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  // Render the Furnished Rooms Mode content
  const renderFurnishedRoomsMode = () => (
    <div className="h-[calc(100vh-120px)] overflow-auto">
      <div className="p-4">
        <FurnishedRoomCarousel
          rooms={furnishedRoomsData}
          onSelectRoom={loadFurnishedRoom}
          onLikeRoom={handleLikeRoom}
          onDislikeRoom={handleDislikeRoom}
          likedRooms={likedRooms}
          dislikedRooms={dislikedRooms}
        />
      </div>
    </div>
  )

  // Render the active filters
  const renderActiveFilters = () => {
    if (activeFilters.length === 0) return null

    return (
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <span className="text-sm font-medium">Active Filters:</span>
        {activeFilters.map((filter, index) => (
          <Badge key={index} variant="secondary" className="bg-design-forest/10 text-design-forest">
            {filter}
          </Badge>
        ))}
        <Button
          variant="ghost"
          size="sm"
          className="h-7 text-xs text-design-forest hover:bg-design-forest/10"
          onClick={resetFilters}
        >
          Reset All
        </Button>
      </div>
    )
  }

  // Render the improved filters
  const renderImprovedFilters = () => (
    <Card className="mb-4 w-full">
      <CardContent className="pb-2 pt-4">
        <div className="flex justify-between items-start">
          <div className="flex flex-wrap gap-x-10 gap-y-4">
            {/* Price Range */}
            <div className="w-64">
              <h3 className="text-sm font-medium mb-1">Price Range</h3>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-medium w-8">${priceRange[0]}</span>
                <Slider
                  defaultValue={[0, 2000]}
                  max={5000}
                  step={50}
                  value={priceRange}
                  onValueChange={setPriceRange}
                  className="w-36 h-4"
                />
                <span className="text-xs font-medium w-10 text-right">${priceRange[1]}</span>
              </div>
            </div>

            {/* Color - Moved below price range */}
            <div className="w-48">
              <h3 className="text-sm font-medium mb-1">Color</h3>
              <div className="flex flex-wrap gap-1.5">
                {Object.keys(selectedColors).map((color) => (
                  <div
                    key={color}
                    className={`w-5 h-5 rounded-full cursor-pointer border-2 ${
                      selectedColors[color] ? "border-design-forest" : "border-transparent hover:border-gray-300"
                    }`}
                    style={{
                      backgroundColor:
                        color === "white"
                          ? "#ffffff"
                          : color === "black"
                            ? "#000000"
                            : color === "brown"
                              ? "#8B4513"
                              : color === "gray"
                                ? "#808080"
                                : color === "blue"
                                  ? "#1E90FF"
                                  : color,
                    }}
                    onClick={() =>
                      setSelectedColors({
                        ...selectedColors,
                        [color]: !selectedColors[color],
                      })
                    }
                  />
                ))}
              </div>
            </div>

            {/* Style - Shifted left */}
            <div className="w-48">
              <h3 className="text-sm font-medium mb-1">Style</h3>
              <div className="grid grid-cols-2 gap-x-1 gap-y-0.5">
                {Object.keys(selectedStyles).map((style) => (
                  <div key={style} className="flex items-center space-x-1">
                    <Checkbox
                      id={`style-${style}`}
                      checked={selectedStyles[style]}
                      onCheckedChange={(checked) => setSelectedStyles({ ...selectedStyles, [style]: !!checked })}
                      className="h-3 w-3"
                    />
                    <Label htmlFor={`style-${style}`} className="text-xs capitalize">
                      {style}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Material - Shifted left */}
            <div className="w-64">
              <h3 className="text-sm font-medium mb-1">Material</h3>
              <div className="flex flex-wrap gap-1">
                {Object.keys(selectedMaterials).map((material) => (
                  <Badge
                    key={material}
                    variant={selectedMaterials[material] ? "default" : "outline"}
                    className={`cursor-pointer text-xs py-0 px-2 h-5 ${
                      selectedMaterials[material] ? "bg-design-forest" : "hover:bg-gray-100"
                    }`}
                    onClick={() =>
                      setSelectedMaterials({
                        ...selectedMaterials,
                        [material]: !selectedMaterials[material],
                      })
                    }
                  >
                    {material}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Popular Brands - Shifted left */}
            <div className="w-64">
              <h3 className="text-sm font-medium mb-1">Popular Brands</h3>
              <div className="flex flex-wrap gap-1">
                {Object.keys(selectedBrands).map((brand) => (
                  <Badge
                    key={brand}
                    variant={selectedBrands[brand] ? "default" : "outline"}
                    className={`cursor-pointer text-xs py-0 px-2 h-5 ${
                      selectedBrands[brand] ? "bg-design-forest" : "hover:bg-gray-100"
                    }`}
                    onClick={() =>
                      setSelectedBrands({
                        ...selectedBrands,
                        [brand]: !selectedBrands[brand],
                      })
                    }
                  >
                    {brand}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="text-gray-500 hover:text-gray-700 h-6 w-6 p-0 absolute top-2 right-2"
            onClick={() => setShowFilters(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Action Buttons moved higher */}
        <div className="flex justify-end mt-2">
          <Button variant="outline" size="sm" className="mr-2 h-7 text-xs" onClick={resetFilters}>
            Reset
          </Button>
          <Button className="bg-design-forest hover:bg-design-forest/90 text-white h-7 text-xs" onClick={applyFilters}>
            Apply Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  // Update the main return statement to include the modal design mode
  // Update the main return statement to separate the header from the rest of the content
  return (
    <main className="flex flex-col bg-white min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/subtle-pattern.png')] opacity-[0.03] pointer-events-none z-0"></div>

      {/* Navigation bar - conditionally styled based on mode */}
      {renderHeader()}

      <div className="px-6 pt-2 relative z-10">
        {/* Main content - Buy Mode */}
        {!isDesignModeModal && !isCartModal && !isFurnishedRoomsModal && (
          <>
            {/* Filters section (conditionally rendered) */}
            {showFilters && renderImprovedFilters()}
            {activeFilters.length > 0 && !showFilters && renderActiveFilters()}

            {/* Main content */}
            {renderBuyMode()}
          </>
        )}
      </div>

      {/* Design Mode Modal */}
      {isDesignModeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={closeDesignModeModal}></div>
          <div className="relative w-[90%] h-[calc(100vh-40px)] bg-white rounded-lg shadow-xl overflow-hidden">
            <div className="h-full overflow-auto">
              <div className="p-6">{renderDesignMode()}</div>
            </div>
          </div>
        </div>
      )}

      {/* Cart Modal */}
      {isCartModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={returnFromCheckout}></div>
          <div className="relative w-[90%] h-[calc(100vh-40px)] bg-white rounded-lg shadow-xl overflow-hidden">
            <div className="h-full overflow-auto">
              <div className="p-6">
                <CheckoutPage cartItems={cartItems} onRemoveItem={removeFromCart} onReturn={returnFromCheckout} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Furnished Rooms Modal */}
      {isFurnishedRoomsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={closeFurnishedRoomsModal}></div>
          <div className="relative w-[90%] h-[calc(100vh-40px)] bg-white rounded-lg shadow-xl overflow-hidden">
            <div className="h-full overflow-auto">
              <div className="p-6">
                {viewingFurnishedRoom ? (
                  <FurnishedRoomView
                    room={viewingFurnishedRoom}
                    onBack={returnToFurnishedRooms}
                    onDesign={() => designFurnishedRoom(viewingFurnishedRoom)}
                    chosenFurniture={chosenFurniture}
                    currentSelections={currentSelections}
                  />
                ) : (
                  renderFurnishedRoomsMode()
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
