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
    image:
      "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=900",
  },
  {
    id: "2",
    name: "Lemon Blueberry Loaf",
    description:
      "Tangy zest lemon pound loaf packed with wild blueberries and sweet icing drizzle.",
    price: 110,
    category: "Loaf Cake",
    image:
      "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&q=80&w=900",
  },
  {
    id: "3",
    name: "Red Velvet Cupcakes (Box of 6)",
    description:
      "Classic red velvet base paired with silky cream cheese frosting.",
    price: 85,
    category: "Cupcakes",
    image:
      "https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?auto=format&fit=crop&q=80&w=900",
  },
  {
    id: "4",
    name: "Vanilla Bean Fudge Cupcakes (Box of 6)",
    description:
      "Fluffy vanilla cupcakes filled with chocolate fudge swirl and sprinkles.",
    price: 80,
    category: "Cupcakes",
    image:
      "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?auto=format&fit=crop&q=80&w=900",
  },
  {
    id: "5",
    name: "Dark Cocoa Slice Cake",
    description:
      "Triple-layered chocolate slice cake topped with gourmet cocoa flakes.",
    price: 95,
    category: "Specialty Cake",
    image:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=900",
  },
  {
    id: "6",
    name: "Classic Carrot Cream Loaf",
    description:
      "Spiced carrot loaf infused with crushed walnuts and smooth cream cheese frosting.",
    price: 115,
    category: "Loaf Cake",
    image:
      "https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&q=80&w=900",
  },
];

export const PRODUCTS_BY_ID = new Map(PRODUCTS.map((p) => [p.id, p]));

export function formatGHS(amount: number) {
  return `GHS ${amount.toFixed(2)}`;
}
