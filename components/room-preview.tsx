"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Box, Plane } from "@react-three/drei"
import type { Group, Mesh } from "three"

// Update the RoomPreviewProps interface to handle all furniture regardless of room type
interface RoomPreviewProps {
  chosenFurniture: Record<string, FurnitureItem[]>
  currentSelections: Record<string, FurnitureItem>
  roomType: string
  allChosenFurniture?: Record<string, Record<string, FurnitureItem[]>>
  allCurrentSelections?: Record<string, Record<string, FurnitureItem>>
}

interface FurnitureItem {
  id: number
  name: string
  uniqueId?: number
}

// Update the component to accept the new props
export default function RoomPreview({
  chosenFurniture,
  currentSelections,
  roomType,
  allChosenFurniture,
  allCurrentSelections,
}: RoomPreviewProps) {
  const sofaRef = useRef<Group>(null)
  const tableRef = useRef<Mesh>(null)
  const chairRef = useRef<Group>(null)
  const lampRef = useRef<Group>(null)
  const bedRef = useRef<Group>(null)

  // Simple animation for demonstration
  useFrame((state) => {
    if (sofaRef.current) {
      sofaRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.05
    }
    if (chairRef.current) {
      chairRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.15 + 1) * 0.05
    }
  })

  // Update the renderRoomLayout function to render furniture from all room types
  const renderRoomLayout = () => {
    // Create a combined furniture collection from all room types
    const combinedFurniture: Record<string, FurnitureItem[]> = {}

    // Always merge all furniture from all room types
    if (allChosenFurniture) {
      Object.values(allChosenFurniture).forEach((roomFurniture) => {
        Object.entries(roomFurniture).forEach(([categoryId, items]) => {
          if (!combinedFurniture[categoryId]) {
            combinedFurniture[categoryId] = []
          }
          combinedFurniture[categoryId] = [...combinedFurniture[categoryId], ...items]
        })
      })
    } else {
      // Fallback to just the current room's furniture if allChosenFurniture is not provided
      Object.entries(chosenFurniture).forEach(([categoryId, items]) => {
        combinedFurniture[categoryId] = [...items]
      })
    }

    // Create a combined selections object
    const combinedSelections: Record<string, FurnitureItem> = { ...currentSelections }

    // If allCurrentSelections is provided, merge all selections from all room types
    if (allCurrentSelections) {
      Object.values(allCurrentSelections).forEach((roomSelections) => {
        Object.entries(roomSelections).forEach(([categoryId, item]) => {
          if (!combinedSelections[categoryId]) {
            combinedSelections[categoryId] = item
          }
        })
      })
    }

    // Create a safe way to get furniture items
    const getFurnitureItems = (categoryId: string) => {
      return (combinedFurniture[categoryId] || []).length > 0
        ? combinedFurniture[categoryId]
        : combinedSelections[categoryId]
          ? [combinedSelections[categoryId]]
          : []
    }

    // Get colors based on the furniture items
    const getSofaColor = (item) => `hsl(${(item.id * 60) % 360}, 70%, 80%)`
    const getTableColor = (item) => (item.id % 2 === 0 ? "#8d6a58" : "#aaaaaa")
    const getChairColor = (item) => `hsl(${(item.id * 40) % 360}, 60%, 75%)`
    const getLampColor = (item) => `hsl(${(item.id * 30) % 360}, 50%, 85%)`
    const getBedColor = (item) => `hsl(${(item.id * 50) % 360}, 65%, 75%)`
    const getDresserColor = (item) => `hsl(${(item.id * 35) % 360}, 55%, 70%)`

    // Render all furniture types regardless of room type
    return (
      <>
        {/* Living Room Furniture */}
        {/* Sofas */}
        {getFurnitureItems("sofas").map((sofa, index) => {
          const offset = index * 0.5
          return (
            <group
              key={sofa.uniqueId || sofa.id}
              ref={index === 0 ? sofaRef : undefined}
              position={[-2 + offset, -0.5, -2.5 + offset]}
            >
              <Box args={[3, 1, 1]} position={[0, 0.5, 0]}>
                <meshStandardMaterial color={getSofaColor(sofa)} />
              </Box>
              <Box args={[3, 1.2, 0.3]} position={[0, 1.1, -0.35]}>
                <meshStandardMaterial color={getSofaColor(sofa)} />
              </Box>
              <Box args={[0.8, 0.5, 1]} position={[-1.1, 0.25, 0]}>
                <meshStandardMaterial color={getSofaColor(sofa)} />
              </Box>
              <Box args={[0.8, 0.5, 1]} position={[1.1, 0.25, 0]}>
                <meshStandardMaterial color={getSofaColor(sofa)} />
              </Box>
            </group>
          )
        })}

        {/* Coffee tables */}
        {getFurnitureItems("coffee-tables").map((table, index) => {
          const offset = index * 0.5
          return (
            <Box
              key={table.uniqueId || table.id}
              ref={index === 0 ? tableRef : undefined}
              args={[1.5, 0.1, 0.8]}
              position={[-2 + offset, -0.45, -1 + offset]}
            >
              <meshStandardMaterial color={getTableColor(table)} />
            </Box>
          )
        })}

        {/* Chairs */}
        {getFurnitureItems("chairs").map((chair, index) => {
          const offset = index * 0.5
          return (
            <group
              key={chair.uniqueId || chair.id}
              ref={index === 0 ? chairRef : undefined}
              position={[2 + offset, -0.5, -1 + offset]}
            >
              <Box args={[0.8, 0.1, 0.8]} position={[0, 0.2, 0]}>
                <meshStandardMaterial color={getChairColor(chair)} />
              </Box>
              <Box args={[0.8, 1, 0.1]} position={[0, 0.7, -0.35]}>
                <meshStandardMaterial color={getChairColor(chair)} />
              </Box>
              {/* Chair legs */}
              {[
                [-0.3, -0.3],
                [0.3, -0.3],
                [0.3, 0.3],
                [-0.3, 0.3],
              ].map((pos, i) => (
                <Box key={i} args={[0.05, 0.2, 0.05]} position={[pos[0], 0, pos[1]]}>
                  <meshStandardMaterial color={getChairColor(chair)} />
                </Box>
              ))}
            </group>
          )
        })}

        {/* Lamps */}
        {getFurnitureItems("lamps").map((lamp, index) => {
          const offset = index * 0.5
          return (
            <group
              key={lamp.uniqueId || lamp.id}
              ref={index === 0 ? lampRef : undefined}
              position={[2 + offset, 0, -3 + offset]}
            >
              <Box args={[0.3, 0.05, 0.3]} position={[0, -0.95, 0]}>
                <meshStandardMaterial color="#888888" />
              </Box>
              <Box args={[0.05, 1.5, 0.05]} position={[0, -0.2, 0]}>
                <meshStandardMaterial color="#888888" />
              </Box>
              <Box args={[0.4, 0.5, 0.4]} position={[0, 0.8, 0]} rotation={[0, Math.PI / 4, 0]}>
                <meshStandardMaterial color={getLampColor(lamp)} opacity={0.9} transparent />
              </Box>
              <pointLight position={[0, 0.8, 0]} intensity={0.5} color="#fff9e0" />
            </group>
          )
        })}

        {/* TV Stands */}
        {getFurnitureItems("tv-stands").map((stand, index) => {
          const offset = index * 0.5
          return (
            <group key={stand.uniqueId || stand.id} position={[-2 + offset, -0.5, -4 + offset]}>
              <Box args={[2.5, 0.8, 0.6]} position={[0, 0.4, 0]}>
                <meshStandardMaterial color={getTableColor(stand)} />
              </Box>
              {/* TV Screen */}
              <Box args={[2, 1.2, 0.1]} position={[0, 1.4, 0]}>
                <meshStandardMaterial color="#111111" />
              </Box>
              {/* TV Stand */}
              <Box args={[0.1, 0.2, 0.1]} position={[0, 0.8, 0]}>
                <meshStandardMaterial color="#555555" />
              </Box>
            </group>
          )
        })}

        {/* Dining Room Furniture */}
        {/* Dining tables */}
        {getFurnitureItems("dining-tables").map((table, index) => {
          const offset = index * 0.5
          return (
            <Box key={table.uniqueId || table.id} args={[2.5, 0.1, 1.5]} position={[2 + offset, -0.1, -4 + offset]}>
              <meshStandardMaterial color={getTableColor(table)} />
            </Box>
          )
        })}

        {/* Dining chairs */}
        {getFurnitureItems("dining-chairs").map((chair, index) => {
          const positions = [
            [1.2, -4.5],
            [2.8, -4.5],
            [2, -3.5],
            [2, -4.5],
          ]
          const pos = positions[index % positions.length]
          const offset = Math.floor(index / positions.length) * 0.5

          return (
            <group key={chair.uniqueId || chair.id} position={[pos[0] + offset, -0.5, pos[1] + offset]}>
              <Box args={[0.6, 0.1, 0.6]} position={[0, 0.2, 0]}>
                <meshStandardMaterial color={getChairColor(chair)} />
              </Box>
              <Box args={[0.6, 0.8, 0.1]} position={[0, 0.6, -0.25]}>
                <meshStandardMaterial color={getChairColor(chair)} />
              </Box>
              {/* Chair legs */}
              {[
                [-0.25, -0.25],
                [0.25, -0.25],
                [0.25, 0.25],
                [-0.25, 0.25],
              ].map((chairPos, j) => (
                <Box key={j} args={[0.04, 0.2, 0.04]} position={[chairPos[0], 0, chairPos[1]]}>
                  <meshStandardMaterial color={getChairColor(chair)} />
                </Box>
              ))}
            </group>
          )
        })}

        {/* Bedroom Furniture */}
        {/* Beds */}
        {getFurnitureItems("beds").map((bed, index) => {
          const offset = index * 0.5
          return (
            <group
              key={bed.uniqueId || bed.id}
              ref={index === 0 ? bedRef : undefined}
              position={[-4 + offset, -0.5, 2 + offset]}
            >
              <Box args={[2.5, 0.4, 3]} position={[0, 0, 0]}>
                <meshStandardMaterial color={getBedColor(bed)} />
              </Box>
              <Box args={[2.5, 0.6, 0.4]} position={[0, 0.5, -1.3]}>
                <meshStandardMaterial color={getBedColor(bed)} />
              </Box>
              <Box args={[2.3, 0.1, 2.8]} position={[0, 0.3, 0]}>
                <meshStandardMaterial color="#ffffff" />
              </Box>
            </group>
          )
        })}

        {/* Nightstands */}
        {getFurnitureItems("nightstands").map((table, index) => {
          const offset = index * 0.5
          return (
            <Box key={table.uniqueId || table.id} args={[0.8, 0.5, 0.8]} position={[-2.7 + offset, -0.25, 1 + offset]}>
              <meshStandardMaterial color={getTableColor(table)} />
            </Box>
          )
        })}

        {/* Office Furniture */}
        {/* Desks */}
        {getFurnitureItems("desks").map((desk, index) => {
          const offset = index * 0.5
          return (
            <Box key={desk.uniqueId || desk.id} args={[2.5, 0.1, 1.2]} position={[2 + offset, -0.1, 2 + offset]}>
              <meshStandardMaterial color={getTableColor(desk)} />
            </Box>
          )
        })}

        {/* Office chairs */}
        {getFurnitureItems("office-chairs").map((chair, index) => {
          const offset = index * 0.5
          return (
            <group key={chair.uniqueId || chair.id} position={[2 + offset, -0.3, 3 + offset]}>
              <Box args={[0.7, 0.1, 0.7]} position={[0, 0, 0]}>
                <meshStandardMaterial color={getChairColor(chair)} />
              </Box>
              <Box args={[0.7, 0.8, 0.1]} position={[0, 0.4, -0.3]}>
                <meshStandardMaterial color={getChairColor(chair)} />
              </Box>
              <Box args={[0.1, 0.8, 0.1]} position={[0, -0.4, 0]}>
                <meshStandardMaterial color="#444444" />
              </Box>
              <Box args={[0.7, 0.05, 0.7]} position={[0, -0.8, 0]}>
                <meshStandardMaterial color="#444444" />
              </Box>
            </group>
          )
        })}

        {/* Bookcases */}
        {getFurnitureItems("bookcases").map((bookcase, index) => {
          const offset = index * 0.5
          return (
            <group key={bookcase.uniqueId || bookcase.id} position={[4 + offset, 0, 2 + offset]}>
              <Box args={[1.5, 2, 0.4]} position={[0, 0, 0]}>
                <meshStandardMaterial color={getTableColor(bookcase)} />
              </Box>
              {/* Shelves */}
              {[0.6, 0, -0.6].map((y, i) => (
                <Box key={i} args={[1.4, 0.05, 0.35]} position={[0, y, 0]}>
                  <meshStandardMaterial color={getTableColor(bookcase) === "#8d6a58" ? "#6d4c41" : "#777777"} />
                </Box>
              ))}
              {/* Books (simplified) */}
              {[0.8, 0.2, -0.4].map((y, i) => (
                <Box key={i} args={[1.2, 0.3, 0.25]} position={[0, y, 0]}>
                  <meshStandardMaterial color={`hsl(${(i * 60 + 180) % 360}, 70%, 50%)`} />
                </Box>
              ))}
            </group>
          )
        })}
      </>
    )
  }

  return (
    <>
      {/* Room floor */}
      <Plane args={[20, 20]} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
        <meshStandardMaterial color="#f5f5f5" />
      </Plane>

      {/* Room walls */}
      <Plane args={[20, 5]} position={[0, 1.5, -10]}>
        <meshStandardMaterial color="#e5e5e5" />
      </Plane>

      <Plane args={[20, 5]} position={[-10, 1.5, 0]} rotation={[0, Math.PI / 2, 0]}>
        <meshStandardMaterial color="#eeeeee" />
      </Plane>

      {/* Room content based on room type */}
      {renderRoomLayout()}
    </>
  )
}
