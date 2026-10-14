export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  categoryId: string;
};

type Item = { name: string; price: number; description?: string; image?: string };

type CategoryDef = {
  id: string;
  name: string;
  tagline: string;
  image: string; // one photo shared by every item in the category (override per item with `image`)
  items: Item[];
};

export const money = (n: number) => `₦${n.toLocaleString("en-US")}`;

const defs: CategoryDef[] = [
  {
    id: "brownie-pots",
    name: "Brownie Pots",
    tagline: "Fudgy brownies with crackly tops.",
    image: "/images/brownie-pots.png",
    items: [
      { name: "Belgian Chocolate Chip Brownie Pot", price: 15000 },
      { name: "Biscoff Brownie Pot", price: 15000 },
      { name: "Nutella & White Chocolate Brownie Pot", price: 15000 },
      { name: "Crushed Maltesers Brownie Pot", price: 15000 },
      { name: "Classic Brownie Pot", price: 15000 },
      { name: "Dubai Chocolate Brownie Pot", price: 15000 },
    ],
  },
  {
    id: "brownie-boxes",
    name: "Brownie & Blondie Boxes",
    tagline: "Boxes made for sharing or gifting.",
    image: "/images/brownie-boxes.png",
    items: [
      { name: "Box of 6 Brownies & Blondies", price: 30000 },
      { name: "Box of 4 Brownies & Blondies", price: 25000 },
      { name: "Fudgy Cheesecake Brownie Box", price: 25000 },
    ],
  },
  {
    id: "banana-bread",
    name: "Banana Bread",
    tagline: "Rich loaves, from classic to double chocolate.",
    image: "/images/banana-bread.png",
    items: [
      { name: "Double Chocolate Loaf", price: 16500, description: "Drenched in chocolate sauce" },
      { name: "Lala's Signature Nutty Loaf", price: 15000 },
      { name: "Pack of 4 Mini Loaves", price: 10000 },
      { name: "Large Cheesecake Loaf", price: 13000 },
      { name: "Large Oreos & Chocolate Chips Loaf", price: 11000 },
      { name: "Nutella & Chocolate Chips Loaf", price: 11000 },
      { name: "Large Classic (Plain) Loaf", price: 10000 },
      { name: "Large Coconut & Chocolate Chips Loaf", price: 11000 },
      { name: "Large Almonds & Dried Fruits Loaf", price: 12000 },
    ],
  },
  {
    id: "stuffed-cookies",
    name: "Stuffed Cookies",
    tagline: "Stuffed cookies in boxes of 2 or 4.",
    image: "/images/stuffed-cookies.png",
    items: [
      { name: "Box of 4 Stuffed Cookies", price: 16500 },
      { name: "Box of 2 Stuffed Cookies", price: 8500 },
    ],
  },
];

export const categories = defs.map((c) => ({
  id: c.id,
  name: c.name,
  tagline: c.tagline,
  items: c.items.map(
    (it, i): Product => ({
      id: `${c.id}-${i + 1}`,
      name: it.name,
      description: it.description ?? "",
      price: it.price,
      image: it.image ?? c.image,
      categoryId: c.id,
    })
  ),
}));

export const specials: Product[] = [
  {
    id: "special-1",
    name: "3 Brownie Pots + Double Chocolate Loaf",
    description: "Pick any 3 brownie pots and tell us your flavours in the order notes",
    price: 60000,
    image: "",
    categoryId: "specials",
  },
  {
    id: "special-2",
    name: "Brownie Pot + Box of 4 + Double Chocolate Loaf",
    description: "1 brownie pot, 1 box of 4 blondies & brownies and 1 double chocolate loaf",
    price: 56500,
    image: "",
    categoryId: "specials",
  },
  { id: "special-3", name: "Sample Box", description: "", price: 20000, image: "", categoryId: "specials" },
];

// Everything that can be ordered. The order API uses this to check prices.
export const products: Product[] = [...categories.flatMap((c) => c.items), ...specials];