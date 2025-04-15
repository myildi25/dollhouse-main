import { getRoomImagePath } from "@/lib/constants"

// This file contains data for pre-designed furnished rooms

export const furnishedRoomsData = [
  {
    id: 1,
    name: "Scandinavian Living Room",
    image: getRoomImagePath("livingRoom", "serene-scandinavian-space.png"),
    style: "Scandinavian",
    roomType: "living-room",
    furniture: [
      {
        categoryId: "sofas",
        itemId: 5, // Black Modern Sofa
      },
      {
        categoryId: "coffee-tables",
        itemId: 1, // White Triangular Table
      },
      {
        categoryId: "chairs",
        itemId: 3, // Gray Modern Chair
      },
      {
        categoryId: "lamps",
        itemId: 1, // Floor Lamp
      },
      {
        categoryId: "rugs",
        itemId: 4, // Natural Jute Rug
      },
    ],
  },
  {
    id: 2,
    name: "Mid-Century Modern Dining",
    image: getRoomImagePath("diningRoom", "mid-century-dining-warmth.png"),
    style: "Mid-Century",
    roomType: "dining-room",
    furniture: [
      {
        categoryId: "dining-tables",
        itemId: 8, // Mid-Century Dining Table
      },
      {
        categoryId: "dining-chairs",
        itemId: 9, // Modern Dining Chair
      },
      {
        categoryId: "buffets",
        itemId: 5, // Mid-Century Credenza
      },
    ],
  },
  {
    id: 3,
    name: "Minimalist Bedroom",
    image: getRoomImagePath("bedroom", "serene-minimalist-bedroom.png"),
    style: "Minimalist",
    roomType: "bedroom",
    furniture: [
      {
        categoryId: "beds",
        itemId: 1, // Queen Platform Bed
      },
      {
        categoryId: "nightstands",
        itemId: 2, // Floating Nightstand
      },
      {
        categoryId: "dressers",
        itemId: 9, // Minimalist Dresser
      },
    ],
  },
  {
    id: 4,
    name: "Industrial Office",
    image: getRoomImagePath("office", "modern-industrial-workspace.png"),
    style: "Industrial",
    roomType: "office",
    furniture: [
      {
        categoryId: "desks",
        itemId: 9, // Industrial Desk
      },
      {
        categoryId: "office-chairs",
        itemId: 3, // Task Chair
      },
      {
        categoryId: "bookcases",
        itemId: 7, // Industrial Bookcase
      },
    ],
  },
  {
    id: 5,
    name: "Bohemian Living Room",
    image: getRoomImagePath("livingRoom", "eclectic-bohemian-retreat.png"),
    style: "Bohemian",
    roomType: "living-room",
    furniture: [
      {
        categoryId: "sofas",
        itemId: 4, // Pink Tufted Sofa
      },
      {
        categoryId: "coffee-tables",
        itemId: 7, // Curved Wood Table
      },
      {
        categoryId: "chairs",
        itemId: 7, // Vibrant Velvet Armchair
      },
      {
        categoryId: "rugs",
        itemId: 6, // Moroccan Style Rug
      },
    ],
  },
  {
    id: 6,
    name: "Coastal Bedroom",
    image: getRoomImagePath("bedroom", "seaside-serenity.png"),
    style: "Coastal",
    roomType: "bedroom",
    furniture: [
      {
        categoryId: "beds",
        itemId: 6, // Minimalist Platform Bed
      },
      {
        categoryId: "nightstands",
        itemId: 1, // Wooden Nightstand
      },
      {
        categoryId: "dressers",
        itemId: 5, // Rustic Wood Dresser
      },
    ],
  },
  {
    id: 7,
    name: "Rustic Dining Room",
    image: getRoomImagePath("diningRoom", "cozy-farmhouse-feast.png"),
    style: "Rustic",
    roomType: "dining-room",
    furniture: [
      {
        categoryId: "dining-tables",
        itemId: 5, // Farmhouse Dining Table
      },
      {
        categoryId: "dining-chairs",
        itemId: 2, // Wooden Dining Chair
      },
      {
        categoryId: "buffets",
        itemId: 9, // Rustic Buffet
      },
    ],
  },
  {
    id: 8,
    name: "Contemporary Office",
    image: getRoomImagePath("office", "modern-workspace.png"),
    style: "Contemporary",
    roomType: "office",
    furniture: [
      {
        categoryId: "desks",
        itemId: 8, // Floating Desk
      },
      {
        categoryId: "office-chairs",
        itemId: 1, // Ergonomic Office Chair
      },
      {
        categoryId: "bookcases",
        itemId: 9, // Modular Bookcase
      },
    ],
  },
  {
    id: 9,
    name: "Traditional Living Room",
    image: getRoomImagePath("livingRoom", "classic-comfort.png"),
    style: "Traditional",
    roomType: "living-room",
    furniture: [
      {
        categoryId: "sofas",
        itemId: 2, // Red Traditional Sofa
      },
      {
        categoryId: "coffee-tables",
        itemId: 8, // Dark Wood Table
      },
      {
        categoryId: "chairs",
        itemId: 8, // Classic Wingback
      },
      {
        categoryId: "lamps",
        itemId: 2, // Table Lamp
      },
    ],
  },
]
