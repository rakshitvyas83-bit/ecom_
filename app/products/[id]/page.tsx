import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetailClient } from "@/components/product/ProductDetailClient";
import { getProductById, listProducts } from "@/lib/products";
import { cache } from "react";

interface ProductPageProps {
  params: { id: string };
}


export const dynamic = "force-dynamic";
export const revalidate = 0; // add this line

const getCachedProductById = cache(getProductById);

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await getCachedProductById(params.id);

  if (!product) {
    return {
      title: "Product Not Found",
      robots: { index: false, follow: false },
    };
  }

  const description = product.description
    ? `${product.name}: ${product.description}`
    : `Shop ${product.name} from Kota Karigari Official. Explore ${product.category.toLowerCase()} in Kota Doria and contemporary Indian ethnic wear.`;
  const image = product.images[0];

  return {
    title: `${product.name} | ${product.category}`,
    description: description.slice(0, 160),
    keywords: [product.name, "Kota Karigari", "Kota Doria", product.category, product.fabric],
    alternates: { canonical: `/products/${encodeURIComponent(product.id)}` },
    openGraph: {
      type: "website",
      title: `${product.name} | Kota Karigari Official`,
      description: description.slice(0, 200),
      url: `/products/${encodeURIComponent(product.id)}`,
      ...(image ? { images: [{ url: image, alt: product.name }] } : {}),
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getCachedProductById(params.id);

  if (!product) notFound();

  const products = await listProducts();
  const related = products
    .filter((item) => item.category === product.category && item.id !== product.id)
    .slice(0, 3);

  return <ProductDetailClient product={product} related={related} />;
}
