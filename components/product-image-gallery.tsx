"use client";

import { useState } from "react";
import Image from "next/image";
import { ProductImage } from "@/lib/api/types";

interface Props {
  images: ProductImage[];
  name: string;
}

export function ProductImageGallery({ images, name }: Props) {
  const [active, setActive] = useState(
    images.find((img) => img.isPrimary) ?? images[0] ?? null
  );

  if (images.length === 0) {
    return (
      <div className="aspect-square bg-slate-100 rounded-xl flex items-center justify-center">
        <span className="text-slate-300">No image</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Main image */}
      <div className="relative aspect-square bg-slate-100 rounded-xl overflow-hidden">
        {active?.imageUrl && (
          <Image
            src={active.imageUrl}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
        )}
      </div>

      {/* Thumbnails — only show if multiple images */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {images.map((img) => (
            <button
              key={img.id}
              onClick={() => setActive(img)}
              className={`relative shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                active?.id === img.id
                  ? "border-indigo-500"
                  : "border-transparent hover:border-slate-300"
              }`}
            >
              {img.imageUrl && (
                <Image
                  src={img.imageUrl}
                  alt={name}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}