// File paths and structure constants

// Set this to false initially to use the old paths, then gradually transition to true
export const USE_NEW_ASSET_STRUCTURE = false

export const ASSET_PATHS = {
  // Product images by category
  products: {
    sofas: "/assets/products/sofas",
    chairs: "/assets/products/chairs",
    tables: {
      coffee: "/assets/products/tables/coffee",
      dining: "/assets/products/tables/dining",
      side: "/assets/products/tables/side",
    },
    beds: "/assets/products/beds",
    lighting: "/assets/products/lighting",
    storage: {
      tvStands: "/assets/products/storage/tv-stands",
      nightstands: "/assets/products/storage/nightstands",
      dressers: "/assets/products/storage/dressers",
    },
    rugs: "/assets/products/rugs",
    outdoor: {
      seating: "/assets/products/outdoor/seating",
      tables: "/assets/products/outdoor/tables",
      lighting: "/assets/products/outdoor/lighting",
    },
    bathroom: {
      vanities: "/assets/products/bathroom/vanities",
      storage: "/assets/products/bathroom/storage",
      fixtures: "/assets/products/bathroom/fixtures",
    },
    kitchen: {
      islands: "/assets/products/kitchen/islands",
      stools: "/assets/products/kitchen/stools",
      storage: "/assets/products/kitchen/storage",
    },
    office: {
      desks: "/assets/products/office/desks",
      chairs: "/assets/products/office/chairs",
      storage: "/assets/products/office/storage",
    },
    misc: "/assets/products/misc", // Added for images that don't fit elsewhere
  },

  // Room scenes
  rooms: {
    livingRoom: "/assets/rooms/living-room",
    bedroom: "/assets/rooms/bedroom",
    diningRoom: "/assets/rooms/dining-room",
    bathroom: "/assets/rooms/bathroom",
    kitchen: "/assets/rooms/kitchen",
    office: "/assets/rooms/office",
    patio: "/assets/rooms/patio",
  },

  // 3D models (for future implementation)
  models: {
    furniture: "/assets/models/furniture",
    rooms: "/assets/models/rooms",
  },

  // Branding assets
  branding: {
    logos: "/assets/branding/logos",
    patterns: "/assets/branding/patterns",
  },
}

// Product image path helper
export function getProductImagePath(category: string, subcategory: string | null, filename: string): string {
  // Basic structure using category for now.
  // We might need a more complex lookup later to include room_type and item_id if needed.
  return `/assets/furniture/${category}/${filename}`;
}

// Room image path helper
export function getRoomImagePath(roomType: string, filename: string): string {
  return `/${filename}`
}

// Branding asset path helper
export function getBrandingAssetPath(type: string, filename: string): string {
  return `/${filename}`
}

// Database schema structure (for reference)
export const DB_SCHEMA = {
  products: {
    id: "UUID",
    name: "String",
    description: "String",
    price: "Decimal",
    category: "String",
    subcategory: "String",
    manufacturer: "String",
    dimensions: {
      width: "Number",
      height: "Number",
      depth: "Number",
    },
    weight: "Number",
    materials: "Array<String>",
    colors: "Array<String>",
    images: {
      thumbnail: "String", // Path to thumbnail image
      gallery: "Array<String>", // Paths to gallery images
    },
    models: {
      glb: "String", // Path to GLB 3D model
    },
    stock: "Number",
    featured: "Boolean",
    createdAt: "DateTime",
    updatedAt: "DateTime",
  },

  rooms: {
    id: "UUID",
    name: "String",
    type: "String", // living-room, bedroom, etc.
    description: "String",
    furniture: "Array<ProductReference>",
    images: {
      thumbnail: "String",
      gallery: "Array<String>",
    },
    featured: "Boolean",
    createdAt: "DateTime",
    updatedAt: "DateTime",
  },

  users: {
    id: "UUID",
    email: "String",
    name: "String",
    savedRooms: "Array<RoomReference>",
    cart: "Array<ProductReference>",
    orders: "Array<OrderReference>",
    createdAt: "DateTime",
    updatedAt: "DateTime",
  },

  orders: {
    id: "UUID",
    userId: "UUID",
    items: "Array<ProductReference>",
    totalPrice: "Decimal",
    status: "String", // pending, processing, shipped, delivered
    shippingAddress: "Address",
    paymentMethod: "String",
    createdAt: "DateTime",
    updatedAt: "DateTime",
  },
}
