export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
}

export const PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Signature Chocolate Loaf",
    description:
      "Rich, moist cocoa loaf cake topped with dark chocolate glaze. Baked fresh every Friday.",
    price: 120,
    category: "Loaf Cake",
    image: "/images/chocolate-loaf.jpg",
  },
  {
    id: "2",
    name: "Lemon Blueberry Loaf",
    description:
      "Tangy zest lemon pound loaf packed with wild blueberries and sweet icing drizzle.",
    price: 110,
    category: "Loaf Cake",
    image: "/images/lemon-blueberry-loaf.jpg",
  },
  {
    id: "3",
    name: "Red Velvet Cupcakes (Box of 6)",
    description:
      "Classic red velvet base paired with silky cream cheese frosting.",
    price: 85,
    category: "Cupcakes",
    image: "/images/red-velvet-cupcakes.jpg",
  },
  {
    id: "4",
    name: "Vanilla Bean Fudge Cupcakes (Box of 6)",
    description:
      "Fluffy vanilla cupcakes filled with chocolate fudge swirl and sprinkles.",
    price: 80,
    category: "Cupcakes",
    image: "/images/vanilla-fudge-cupcakes.jpg",
  },
  {
    id: "5",
    name: "Dark Cocoa Slice Cake",
    description:
      "Triple-layered chocolate slice cake topped with gourmet cocoa flakes.",
    price: 95,
    category: "Specialty Cake",
    image: "/images/dark-cocoa-slice.jpg",
  },
  {
    id: "6",
    name: "Classic Carrot Cream Loaf",
    description:
      "Spiced carrot loaf infused with crushed walnuts and smooth cream cheese frosting.",
    price: 115,
    category: "Loaf Cake",
    image: "/images/carrot-cream-loaf.jpg",
  },
];

export const PRODUCTS_BY_ID = new Map(PRODUCTS.map((p) => [p.id, p]));

export function formatGHS(amount: number) {
  return `GHS ${amount.toFixed(2)}`;
}
