"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Home } from "lucide-react";
import Link from "next/link";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  isCurrent?: boolean;
}

interface BreadcrumbNavProps {
  items: BreadcrumbItem[];
}

export function BreadcrumbNav({ items }: BreadcrumbNavProps) {
  const isProductPage = items.length >= 3;

  return (
    <>
      {/* Mobile */}
      <div className="sm:hidden">
        <Breadcrumb>
          <BreadcrumbList className="flex-nowrap w-full">
            {/* Home */}
            <BreadcrumbItem className="flex-shrink-0">
              <BreadcrumbLink asChild>
                <Link href="/">
                  <Home
                    size={16}
                    className="text-slate-500 hover:text-slate-900 transition-colors"
                  />
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>

            {isProductPage ? (
              <>
                <BreadcrumbSeparator />

                {/* Category */}
                <BreadcrumbItem className="flex-shrink-0">
                  <BreadcrumbLink asChild>
                    <Link
                      href={items[items.length - 2].href ?? "#"}
                      className="text-primary hover:opacity-80 transition-opacity"
                    >
                      {items[items.length - 2].label}
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbSeparator />

                {/* Product */}
                <BreadcrumbItem className="min-w-0 flex-1">
                  <BreadcrumbPage
                    className="truncate text-slate-500"
                    title={items[items.length - 1].label}
                  >
                    {items[items.length - 1].label}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </>
            ) : (
              items.map((item, index) => {
                const isLast = index === items.length - 1;

                return (
                  <div key={index} className="contents">
                    <BreadcrumbSeparator />

                    <BreadcrumbItem>
                      {isLast || item.isCurrent ? (
                        <BreadcrumbPage>{item.label}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink asChild>
                          <Link
                            href={item.href ?? "#"}
                            className="text-primary hover:opacity-80 transition-opacity"
                          >
                            {item.label}
                          </Link>
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  </div>
                );
              })
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Desktop */}
      <div className="hidden sm:block">
        <Breadcrumb>
          <BreadcrumbList>
            {/* Home */}
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">
                  <Home
                    size={16}
                    className="text-slate-500 hover:text-slate-900 transition-colors"
                  />
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>

            {items.map((item, index) => {
              const isLast = index === items.length - 1;

              return (
                <div key={index} className="contents">
                  <BreadcrumbSeparator />

                  <BreadcrumbItem>
                    {isLast || item.isCurrent ? (
                      <BreadcrumbPage title={item.label}>
                        {item.label}
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link
                          href={item.href ?? "#"}
                          className="text-primary hover:opacity-80 transition-opacity"
                        >
                          {item.label}
                        </Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </div>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </>
  );
}