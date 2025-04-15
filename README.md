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


## Implementation Context

### Key Components/Files for 3D Editor

-   **`app/page.tsx`:** The main page component. Holds primary application state (active room, selected items, cart, etc.) which the 3D editor will need to read from and potentially update.
-   **`components/room-preview.tsx`:** (Or similar component rendering the `<Canvas>`) Contains the current basic 3D preview canvas. This will likely be modified or replaced by the new editor logic.
-   **`lib/constants.ts`:** Contains the `getProductImagePath` helper. A similar helper might be needed for model paths.
-   **`data/furniture-data.ts`:** Defines furniture items. Needs `modelPath` added to link items to their 3D models.
-   **`public/assets/3dassets/`:** Contains the `.glb` 3D models.
-   **`public/assets/furniture/`:** Contains the furniture image assets, organized by category.

### State Management Approach

-   Currently, state is primarily managed using `useState` hooks within `app/page.tsx`.
-   The 3D editor components (living within the Design Mode modal and Room Preview card) will require access to shared state (e.g., list of furniture items added to the scene, room dimensions, selected item for manipulation).
-   They will also need to update shared state (e.g., position/rotation of items, added/removed items).


## Future Development: 3D Room Editor

The next major phase of development involves building an interactive 3D room editor using Three.js / React Three Fiber.

**Integration Points:**

This 3D editor functionality should replace or enhance the existing 3D canvas currently used in two main areas:

1.  **"Room Preview" Card (Buy Mode):** The small preview window shown on the right side in the default "Buy Mode". This should evolve from a static visualization to allow basic interactions defined in the requirements (like adding the selected item).
2.  **"Design Mode" Modal:** The large modal view activated by the "Design Mode" button. This will be the primary interface for the full 3D editor, incorporating all the features listed below (manipulation, multi-room, 2D mode toggle, etc.).

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

**Development Considerations:**

-   **Controls:** Explore different controls from `@react-three/drei` (like `TransformControls`) for manipulating objects.
-   **Performance:** Be mindful of performance when loading multiple 3D models. Techniques like instancing (`<Instances>` from drei) or model optimization might be necessary.
-   **2D/3D Sync:** Managing state between the 2D floor plan editor and the 3D view will require careful planning. Ensure transformations and object placements are consistent across both modes.

## Usage

- Select a room type from the top navigation
- Browse furniture categories and select items
- Use the 3D preview to visualize your selections
- Add items to your cart
- Switch to Design Mode for a more immersive experience
- Browse pre-designed rooms for inspiration
