# Dollhouse Furniture Showcase

A modern, interactive furniture showcase application that allows users to visualize and design rooms with various furniture pieces.

## Features

- **Room Selection**: Browse different room types including living room, bedroom, dining room, bathroom, kitchen, office, and patio
- **Furniture Browsing**: Explore a wide range of furniture items organized by category
- **3D Visualization**: See how furniture pieces look together in a 3D room preview
- **Design Mode**: Create custom room designs by selecting and arranging furniture
- **Furnished Rooms**: Browse pre-designed room templates for inspiration
- **Shopping Cart**: Add items to cart and proceed to checkout
- **Responsive Design**: Works on desktop and mobile devices

## Project Structure

- `app/`: Next.js App Router pages and layouts
- `components/`: Reusable React components
- `data/`: Static data for furniture and rooms
- `lib/`: Utility functions and constants
- `public/`: Static assets including furniture images

## Technologies

- **Next.js**: React framework for server-rendered applications
- **React Three Fiber**: 3D rendering for room visualization
- **Tailwind CSS**: Utility-first CSS framework for styling
- **TypeScript**: Type-safe JavaScript
- **Shadcn UI**: Component library for consistent design

## Getting Started

1. **Clone the repository:**

2. **Install dependencies:** This project uses `npm`. Due to potential dependency conflicts, use the `--legacy-peer-deps` flag:
    ```bash
    npm install --legacy-peer-deps
    ```
3. **Run the development server:**
    ```bash
    npm run dev
    ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Proposed Asset Structure

To improve organization and make it easier to manage furniture assets (images and 3D models), the following structure within the `public` directory is recommended:

```
public/
├── assets/
│   ├── furniture/
│   │   ├── [room_type]/         # e.g., living-room, bedroom
│   │   │   ├── [category_id]/     # e.g., sofas, beds
│   │   │   │   ├── [item_id]/       # e.g., modern-sectional, platform-bed-123
│   │   │   │   │   ├── thumbnail.png # Primary image for lists/cards
│   │   │   │   │   ├── image.png     # Larger/detail image (if different)
│   │   │   │   │   └── model.glb     # The 3D model file
│   │   │   │   └── ... (more items)
│   │   │   └── ... (more categories)
│   │   └── ... (more room types)
│   ├── rooms/                   # For pre-made room layouts or assets
│   │   └── ...
│   └── textures/                # Shared textures (wood, fabric, etc.)
│       └── ...
├── logo.png
├── subtle-pattern.png # Note: This is currently missing (404 error)
└── ... (other existing public files like favicons etc.)
```

**Note on Current Asset Locations:**
- **Images:** Most images listed in `data/furniture-data.ts` have been moved to `public/assets/furniture/[category_id]/[filename].jpeg` (or `.png`/`.webp`). However, many images listed in the data file were missing from the original `public` folder. Please verify image locations and add any missing files to the correct category folder.
- **3D Models:** The initial set of `.glb` files (`bed.glb`, `couch.glb`, `couch2.glb`, `couch3.glb`, `rug.glb`, `table.glb`) have been moved to `public/assets/3dassets/`.

**Action Required:**
-   Verify and complete the image migration into `public/assets/furniture/[category_id]/`. Add any missing image files referenced in `data/furniture-data.ts`.
-   Add remaining `.glb` files to `public/assets/3dassets/`.
-   Update the paths in `data/furniture-data.ts` to correctly reference the `.glb` models for each item (e.g., add a `modelPath` property to each item pointing to `/assets/3dassets/couch.glb`).
-   Ensure the `subtle-pattern.png` file is added to `public/`.

## Future Development: 3D Room Editor

The next major phase of development involves building an interactive 3D room editor using Three.js / React Three Fiber.

**Core Requirements:**

1.  **Basic Room:**
    *   Start with a simple, square, empty 3D room defined by walls, floor, and ceiling.
    *   Use basic materials and lighting.
2.  **Furniture Placement:**
    *   When a user selects a furniture item (e.g., from the "Recommendations" or "Buy Mode" lists), its corresponding `.glb` model should be loaded and placed inside the 3D room.
    *   Allow users to select which room the furniture goes into via a dropdown if multiple rooms exist.
3.  **Manipulation:**
    *   Users should be able to click and drag furniture items within the room to move them.
    *   Implement rotation controls for selected furniture (e.g., using gizmos or keyboard shortcuts).
4.  **Collision Detection:**
    *   Furniture items should collide with each other and with the room's walls.
    *   Prevent furniture from being moved outside the boundaries of the room.
5.  **Multi-Room System:**
    *   Add a UI button (e.g., a '+' icon) accessible in both the "Room Preview" and "Design Mode" views.
    *   Clicking this button should add a new, empty room adjacent to the currently viewed room.
    *   The system needs to manage multiple rooms and their contents.
6.  **2D Floor Plan Mode:**
    *   Implement a toggle or separate view for a 2D top-down floor plan editor.
    *   Allow users to drag the corners/vertices of the room(s) to resize and reshape them.
    *   Provide tools to add architectural elements like windows and doors onto the walls in the 2D view.
7.  **Synchronization:**
    *   Changes made in the 2D floor plan (room shape, window/door placement) should be reflected accurately in the 3D view.
    *   Windows and doors added in 2D should appear as openings or appropriate models in the 3D walls.

**Data:**
-   Furniture data is sourced from `data/furniture-data.ts`.
-   Image paths are generated dynamically using `getProductImagePath` in `lib/constants.ts`, pointing to `public/assets/furniture/[category_id]/[filename]...`.
-   **The initial `.glb` 3D models for development are located in `public/assets/3dassets/` (e.g., `couch.glb`, `bed.glb`). You will need to update `data/furniture-data.ts` to include paths to these models for each furniture item.**

## Usage

- Select a room type from the top navigation
- Browse furniture categories and select items
- Use the 3D preview to visualize your selections
- Add items to your cart
- Switch to Design Mode for a more immersive experience
- Browse pre-designed rooms for inspiration

Now let's create a simplified SafeImage component without migration-related code:

```
[v0-no-op-code-block-prefix]"use client"

import Image, { type ImageProps } from "next/image"
import { useState } from "react"

interface SafeImageProps extends Omit<ImageProps, "src"> {
  src: string | null | undefined
  fallbackSrc?: string
  itemName?: string
}

export default function SafeImage({ src, fallbackSrc, itemName = "item", alt, ...props }: SafeImageProps) {
  const [error, setError] = useState(false)

  // Generate a fallback src if none provided
  const defaultFallback = `/placeholder.svg?height=${props.height || 100}&width=${props.width || 100}&query=${encodeURIComponent(itemName)}`

  // Handle image load error
  const handleError = () => {
    console.warn(`Failed to load image: ${src}`)
    setError(true)
  }

  // Use a valid source or fallback
  const validSrc = error ? fallbackSrc || defaultFallback : src

  return (
    <div className="flex items-center justify-center h-full w-full">
      <Image
        {...props}
        src={validSrc || "/placeholder.svg"}
        alt={alt || itemName}
        onError={handleError}
        className={`object-contain ${props.className || ""} ${
          validSrc && (validSrc.includes("sofa") || validSrc.endsWith(".jpeg")) ? "sofa-image" : ""
        }`}
      />
    </div>
  )
}
