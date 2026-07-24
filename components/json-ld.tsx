import type { Product } from "@/lib/api/types";

interface JsonLdProps {
  product: Product;
}

export function JsonLd({ product }: JsonLdProps) {
  const images = product.images?.map((img) => img.imageUrl).filter(Boolean) || [];
  
  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": images,
    "description": product.description,
    "sku": product.id,
    "mpn": product.id,
    "brand": {
      "@type": "Brand",
      "name": "Commerce"
    },
    "category": product.category,
    "offers": {
      "@type": "Offer",
      "url": typeof window !== "undefined" ? window.location.href : undefined,
      "priceCurrency": "USD",
      "price": product.price,
      "itemCondition": "https://schema.org/NewCondition",
      "availability": product.stockQuantity && product.stockQuantity > 0 
        ? "https://schema.org/InStock" 
        : "https://schema.org/OutOfStock",
      "priceValidUntil": new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]
    },
    ...(product.averageRating && product.ratingCount && product.ratingCount > 0 ? {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": product.averageRating,
        "reviewCount": product.ratingCount
      }
    } : {})
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
