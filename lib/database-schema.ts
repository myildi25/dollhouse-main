/**
 * This file provides a reference for the database schema.
 * It's not used in the application directly but serves as documentation
 * for the next developer who will implement the database.
 */

export interface Product {
  id: string // UUID
  name: string
  description: string
  price: number
  category: string
  subcategory?: string
  manufacturer: string
  dimensions?: {
    width: number
    height: number
    depth: number
  }
  weight?: number
  materials: string[]
  colors: string[]
  images: {
    thumbnail: string // Path to thumbnail image
    gallery: string[] // Paths to gallery images
  }
  models?: {
    glb?: string // Path to GLB 3D model
  }
  stock: number
  featured: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Room {
  id: string // UUID
  name: string
  type: string // living-room, bedroom, etc.
  description: string
  furniture: ProductReference[]
  images: {
    thumbnail: string
    gallery: string[]
  }
  featured: boolean
  createdAt: Date
  updatedAt: Date
}

export interface ProductReference {
  productId: string
  categoryId: string
  itemId: number
  quantity: number
}

export interface User {
  id: string // UUID
  email: string
  name: string
  savedRooms: string[] // Array of Room IDs
  cart: ProductReference[]
  orders: string[] // Array of Order IDs
  createdAt: Date
  updatedAt: Date
}

export interface Order {
  id: string // UUID
  userId: string
  items: ProductReference[]
  totalPrice: number
  status: "pending" | "processing" | "shipped" | "delivered"
  shippingAddress: Address
  paymentMethod: string
  createdAt: Date
  updatedAt: Date
}

export interface Address {
  street: string
  city: string
  state: string
  postalCode: string
  country: string
}

// Example queries for future database implementation

/**
 * Example: Get all products in a category
 *
 * SELECT * FROM products WHERE category = 'sofas';
 */

/**
 * Example: Get featured rooms
 *
 * SELECT * FROM rooms WHERE featured = true;
 */

/**
 * Example: Get a user's cart with product details
 *
 * SELECT u.id, p.*
 * FROM users u
 * JOIN products p ON p.id = ANY(u.cart)
 * WHERE u.id = 'user_id';
 */

/**
 * Example: Get orders for a user
 *
 * SELECT * FROM orders WHERE userId = 'user_id';
 */
