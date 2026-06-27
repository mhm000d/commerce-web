"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {Home} from "lucide-react";
import Link from "next/link";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  isCurrent?: boolean;
}

interface BreadcrumbNavProps {
  items: BreadcrumbItem[];
}

export function BreadcrumbNav({items}: BreadcrumbNavProps) {
  const nodes: React.ReactNode[] = [];

  // Home always first
  nodes.push(
    <BreadcrumbItem key="home">
      <BreadcrumbLink asChild>
        <Link href="/">
          <Home size={16} className="text-slate-500 hover:text-slate-900 transition-colors"/>
        </Link>
      </BreadcrumbLink>
    </BreadcrumbItem>
  );

  // Add items with separators in between
  items.forEach((item, index) => {
    // Separator before each item
    nodes.push(<BreadcrumbSeparator key={`sep-${index}`}/>);
    const isLast = index === items.length - 1;
    nodes.push(
      <BreadcrumbItem key={index}>
        {isLast || item.isCurrent ? (
          <BreadcrumbPage>{item.label}</BreadcrumbPage>
        ) : (
          <BreadcrumbLink asChild>
            <Link href={item.href || "#"}>{item.label}</Link>
          </BreadcrumbLink>
        )}
      </BreadcrumbItem>
    );
  });

  return (
    <Breadcrumb>
      <BreadcrumbList>{nodes}</BreadcrumbList>
    </Breadcrumb>
  );
}
