export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  colors: string[];
  material: string;
  reviews: number;
  badge?: string;
};
export const categories = [
  "All Products",
  "Home & Office",
  "Toys & Collectibles",
  "Gaming Accessories",
  "Organization",
  "Phone Accessories",
  "Parts & Replacements",
];
export const colors = [
  { name: "Red", value: "#ed1429" },
  { name: "Black", value: "#141414" },
  { name: "Gray", value: "#8e9093" },
  { name: "White", value: "#f2f2f2" },
  { name: "Blue", value: "#2768d3" },
  { name: "Green", value: "#218a70" },
];
export const materials = ["PLA", "PETG", "ABS", "TPU", "ASA"];
export const products: Product[] = [
  {
    id: "wolf",
    name: "Geometric Wolf",
    category: "Toys & Collectibles",
    price: 18,
    image: "wolf",
    colors: ["Black", "Gray", "White"],
    material: "PLA",
    reviews: 24,
    badge: "Bestseller",
  },
  {
    id: "phone",
    name: "Adjustable Phone Stand",
    category: "Phone Accessories",
    price: 12.99,
    image: "phone",
    colors: ["Black", "Red", "White"],
    material: "PLA",
    reviews: 36,
  },
  {
    id: "planters",
    name: "Succulent Planters · Set of 3",
    category: "Home & Office",
    price: 25,
    image: "planters",
    colors: ["Black", "Gray", "White"],
    material: "PLA",
    reviews: 18,
  },
  {
    id: "dragon",
    name: "Articulated Dragon",
    category: "Toys & Collectibles",
    price: 28,
    image: "dragon",
    colors: ["Red", "Black", "Blue", "Green"],
    material: "PLA",
    reviews: 42,
    badge: "Fan favorite",
  },
  {
    id: "cable",
    name: "Cable Organizer",
    category: "Organization",
    price: 14,
    image: "cable",
    colors: ["Black", "White", "Gray"],
    material: "TPU",
    reviews: 27,
  },
  {
    id: "controller",
    name: "Controller Stand",
    category: "Gaming Accessories",
    price: 16,
    image: "controller",
    colors: ["Black", "Red", "Blue"],
    material: "PETG",
    reviews: 31,
  },
  {
    id: "gear",
    name: "Precision Replacement Gear",
    category: "Parts & Replacements",
    price: 9,
    image: "gear",
    colors: ["Black", "Gray"],
    material: "ABS",
    reviews: 12,
  },
  {
    id: "panels",
    name: "Hex Wall Panels · Set of 6",
    category: "Home & Office",
    price: 22,
    image: "panels",
    colors: ["Red", "Black", "Gray"],
    material: "PLA",
    reviews: 19,
  },
  {
    id: "dice",
    name: "Dice Tower",
    category: "Gaming Accessories",
    price: 30,
    image: "dice",
    colors: ["Black", "Red"],
    material: "PLA",
    reviews: 21,
  },
  {
    id: "mini-dragon",
    name: "Pocket Articulated Dragon",
    category: "Toys & Collectibles",
    price: 16,
    image: "dragon",
    colors: ["Red", "Blue"],
    material: "PLA",
    reviews: 16,
  },
  {
    id: "outdoor-planters",
    name: "Outdoor Succulent Planter Set",
    category: "Home & Office",
    price: 32,
    image: "planters",
    colors: ["Gray", "White"],
    material: "ASA",
    reviews: 8,
  },
  {
    id: "desk-kit",
    name: "Desk Cable Organizer · XL",
    category: "Organization",
    price: 20,
    image: "cable",
    colors: ["Black", "Gray"],
    material: "PETG",
    reviews: 14,
  },
];
export const money = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    value,
  );
