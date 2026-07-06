"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ProductImage } from "@/lib/api/types";

interface Props {
  images: ProductImage[];
  name: string;
}

function GalleryImage({
  src,
  alt,
  className,
  priority = false,
  onClick,
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  onClick?: () => void;
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div className="relative h-full w-full" onClick={onClick}>
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 animate-pulse rounded-inherit bg-slate-100" />
      )}

      {hasError ? (
        <div className="absolute inset-0 flex items-center justify-center rounded-inherit bg-slate-100 text-center text-sm text-slate-400">
          Image unavailable
        </div>
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          className={`${className} ${isLoaded ? "opacity-100" : "opacity-0"}`}
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority={priority}
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
        />
      )}
    </div>
  );
}

export function ProductImageGallery({ images, name }: Props) {
  const [active, setActive] = useState(
    images.find((img) => img.isPrimary) ?? images[0] ?? null
  );
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [showZoomPreview, setShowZoomPreview] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!isLightboxOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsLightboxOpen(false);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        setActive((current) => {
          const currentIndex = images.findIndex((img) => img.id === current?.id);
          const nextIndex = (currentIndex + 1) % images.length;
          return images[nextIndex] ?? current;
        });
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        setActive((current) => {
          const currentIndex = images.findIndex((img) => img.id === current?.id);
          const prevIndex = (currentIndex - 1 + images.length) % images.length;
          return images[prevIndex] ?? current;
        });
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [images, isLightboxOpen]);

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
      <div className="relative aspect-square overflow-visible rounded-xl bg-white p-2 sm:p-4">
        {active?.imageUrl && (
          <div
            className="relative h-full w-full"
            onMouseMove={(event) => {
              const rect = event.currentTarget.getBoundingClientRect();
              setMousePosition({
                x: ((event.clientX - rect.left) / rect.width) * 100,
                y: ((event.clientY - rect.top) / rect.height) * 100,
              });
              setShowZoomPreview(true);
            }}
            onMouseEnter={() => setShowZoomPreview(true)}
            onMouseLeave={() => setShowZoomPreview(false)}
            onTouchStart={() => setShowZoomPreview(true)}
            onTouchEnd={() => setShowZoomPreview(false)}
          >
            <button
              type="button"
              className="group h-full w-full cursor-zoom-in overflow-hidden rounded-xl"
              onClick={() => setIsLightboxOpen(true)}
            >
              <GalleryImage
                src={active.imageUrl}
                alt={name}
                className="object-contain transition-transform duration-200 group-hover:scale-[1.02]"
                priority
              />
            </button>

            {showZoomPreview && (
              <>
                <div
                  className="pointer-events-none absolute z-10 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_0_0_1px_rgba(15,23,42,0.2)]"
                  style={{
                    left: `${mousePosition.x}%`,
                    top: `${mousePosition.y}%`,
                  }}
                />
                <div className="pointer-events-none absolute left-full top-1/2 z-20 ml-4 block h-72 w-72 -translate-y-1/2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl sm:h-80 sm:w-80">
                  <div className="relative h-full w-full">
                    <Image
                      src={active.imageUrl}
                      alt={`${name} zoom preview`}
                      fill
                      className="object-contain"
                      sizes="320px"
                      style={{
                        transform: "scale(2.3)",
                        transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
                      }}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Thumbnails — only show if multiple images */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {images.map((img) => (
            <button
              key={img.id}
              onClick={() => setActive(img)}
              className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 bg-white transition-colors ${
                active?.id === img.id
                  ? "border-indigo-500"
                  : "border-transparent hover:border-slate-300"
              }`}
            >
              {img.imageUrl && (
                <GalleryImage src={img.imageUrl} alt={name} className="object-cover" />
              )}
            </button>
          ))}
        </div>
      )}

      {isLightboxOpen && active?.imageUrl && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 sm:p-8"
          onClick={() => setIsLightboxOpen(false)}
        >
          <div className="relative h-full max-h-[90vh] w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              className="absolute right-2 top-2 z-10 rounded-full bg-white/90 px-3 py-2 text-sm font-medium text-slate-700 shadow hover:bg-white"
            >
              Close
            </button>

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() =>
                    setActive((current) => {
                      const currentIndex = images.findIndex((img) => img.id === current?.id);
                      const prevIndex = (currentIndex - 1 + images.length) % images.length;
                      return images[prevIndex] ?? current;
                    })
                  }
                  className="absolute left-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-xl text-slate-700 shadow hover:bg-white"
                  aria-label="Previous image"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setActive((current) => {
                      const currentIndex = images.findIndex((img) => img.id === current?.id);
                      const nextIndex = (currentIndex + 1) % images.length;
                      return images[nextIndex] ?? current;
                    })
                  }
                  className="absolute right-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-xl text-slate-700 shadow hover:bg-white"
                  aria-label="Next image"
                >
                  ›
                </button>
              </>
            )}

            <div className="relative h-full w-full overflow-hidden rounded-2xl bg-white p-3 sm:p-5">
              <GalleryImage src={active.imageUrl} alt={name} className="object-contain" priority />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}