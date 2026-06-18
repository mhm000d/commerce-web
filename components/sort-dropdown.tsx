'use client';

import { SlidersHorizontal } from 'lucide-react';

interface SortDropdownProps {
  sortBy: string;
  page: number;
  search: string;
  category: string;
}

const SORT_OPTIONS = [
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating_desc", label: "Top Rated" },
];

export function SortDropdown({ sortBy, page, search, category }: SortDropdownProps) {
  const handleSortChange = (value: string) => {
    const qs = new URLSearchParams();
    if (page && page !== 1) qs.set("page", String(page));
    if (search) qs.set("search", search);
    if (category) qs.set("category", category);
    if (value) qs.set("sortBy", value);
    window.location.href = `/products${qs.toString() ? `?${qs}` : ""}`;
  };

  return (
    <div className="flex items-center gap-2">
      <SlidersHorizontal size={16} className="text-slate-400 shrink-0" />
      <select
        onChange={(e) => handleSortChange(e.target.value)}
        defaultValue={sortBy}
        className="text-sm border border-slate-200 rounded-lg bg-white px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
