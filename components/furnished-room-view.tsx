"use client"

import { ArrowLeft, Home } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import SafeImage from "./safe-image"
import { Canvas } from "@react-three/fiber"
import { Environment, OrbitControls } from "@react-three/drei"
import RoomPreview from "./room-preview"

interface FurnishedRoomViewProps {
  room: {
    id: number
    name: string
    image: string
    style: string
    roomType: string
  }
  onBack: () => void
  onDesign: () => void
  chosenFurniture: any
  currentSelections: any
}

export default function FurnishedRoomView({
  room,
  onBack,
  onDesign,
  chosenFurniture,
  currentSelections,
}: FurnishedRoomViewProps) {
  // Similar rooms based on style or room type
  const similarRooms = [
    {
      id: 101,
      name: `${room.style} ${room.roomType
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")} Variant 1`,
      image: "/serene-scandinavian-space.png",
      style: room.style,
      roomType: room.roomType,
    },
    {
      id: 102,
      name: `${room.style} ${room.roomType
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")} Variant 2`,
      image: "/classic-comfort.png",
      style: room.style,
      roomType: room.roomType,
    },
    {
      id: 103,
      name: `Modern ${room.roomType
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")}`,
      image: "/modern-workspace.png",
      style: "Modern",
      roomType: room.roomType,
    },
  ]

  // Render the 3D preview component
  const renderPreview = () => (
    <div className="w-full h-full">
      <Canvas>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <RoomPreview
          chosenFurniture={chosenFurniture || {}}
          currentSelections={currentSelections || {}}
          roomType={room.roomType || "living-room"}
          allChosenFurniture={chosenFurniture ? { [room.roomType]: chosenFurniture } : undefined}
          allCurrentSelections={currentSelections ? { [room.roomType]: currentSelections } : undefined}
        />
        <OrbitControls enableZoom={true} />
        <Environment preset="apartment" />
      </Canvas>
    </div>
  )

  return (
    <div className="grid grid-cols-12 gap-6 h-[calc(100vh-120px)]">
      {/* Left side - Room Preview (8/12 width) */}
      <div className="col-span-8 pt-3">
        <Card className="border border-gray-200 rounded-lg bg-white shadow-sm h-full">
          <CardHeader className="pb-2 pt-3 pr-3 bg-gray-50">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Button variant="ghost" size="sm" className="mr-2 h-8 w-8 p-0 rounded-full" onClick={onBack}>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <CardTitle className="text-base font-medium tracking-wide text-black">{room.name}</CardTitle>
              </div>
              <Button
                variant="default"
                size="sm"
                className="h-8 text-xs px-3 bg-design-forest hover:bg-design-forest/90 text-white font-medium"
                onClick={onDesign}
              >
                Design Room
              </Button>
            </div>
            <Separator className="mt-2 bg-gray-200" />
          </CardHeader>
          <CardContent className="p-0 h-[630px] preview-container pt-2">{renderPreview()}</CardContent>
        </Card>
      </div>

      {/* Right side - Similar Rooms (4/12 width) */}
      <div className="col-span-4 pt-3">
        <Card className="border border-gray-200 bg-white shadow-sm h-full flex flex-col">
          <CardHeader className="pb-1 pt-3 pr-3 bg-gray-50">
            <div className="flex justify-between items-center">
              <CardTitle className="text-base font-medium tracking-wide text-black">Similar Rooms</CardTitle>
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs px-3 border-design-forest/30 text-design-forest hover:bg-design-forest/5 font-medium"
                onClick={onBack}
              >
                <Home className="h-3 w-3 mr-1" />
                All Rooms
              </Button>
            </div>
            <Separator className="mt-2 bg-gray-200" />
          </CardHeader>
          <CardContent className="p-4 pb-2 overflow-auto flex-grow">
            <div className="space-y-4">
              {similarRooms.map((similarRoom) => (
                <Card
                  key={similarRoom.id}
                  className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow duration-300"
                >
                  <div className="relative h-36 w-full">
                    <SafeImage src={similarRoom.image} alt={similarRoom.name} fill className="object-cover" />
                  </div>
                  <CardContent className="p-3">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium text-sm text-black">{similarRoom.name}</h3>
                      <Button
                        size="sm"
                        className="h-7 text-xs px-2 bg-design-forest hover:bg-design-forest/90 text-white"
                        onClick={onDesign}
                      >
                        See Room
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
