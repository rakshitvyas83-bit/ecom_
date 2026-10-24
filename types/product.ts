export type ProductSize = "XS" | "S" | "M" | "L" | "XL" | "XXL";

export type ProductCategory =
  | "Work Wear"
  | "Festive Wear"
  | "Daily Wear"
  | "Premium Collection";

export interface SizeInventory {
  size: ProductSize;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  fabric: string;
  price: number;
  discountPrice?: number;
  stock: number;
  sizes: ProductSize[];
  sizeInventory: SizeInventory[];
  category: ProductCategory;
  images: string[];
  imageIds?: string[];  
  featured: boolean;
  popular: boolean;
  isactive?: boolean;
  isshowcased?: boolean;
  createdAt: string;
}

export interface Category {
  id: string;
  name: ProductCategory;
  description: string;
  image: string;
}

export interface OrderLine {
  productId: string;
  size: ProductSize;
  quantity: number;
  pricePaid: number;
}

export interface OrderDraft {
  customerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
  items: OrderLine[];
  subtotal: number;
  shipping: number;
  total: number;
}
