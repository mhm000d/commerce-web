"use client";

import { useState, useEffect, useRef, useId } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Search, Loader2, X } from "lucide-react";
import { clientFetch } from "@/lib/client-fetch";
import { useDebounce } from "@/hooks/use-debounce";
import type { ProductSummary } from "@/lib/api/types";
import { SEARCH_PLACEHOLDERS } from "@/constants/search-placeholders";

// Helper to highlight matching text
function highlightText(text: string, query: string): React.ReactNode {
  if (!query || !text) return text;
  const escaped = query.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&');
  const parts = text.split(new RegExp(`(${escaped})`, 'i'));
  const matchRegex = new RegExp(`(${escaped})`, 'i');
  return parts.map((part, i) =>
    matchRegex.test(part) ? (
      <strong key={i} className="font-bold">
        {part}
      </strong>
    ) : (
      part
    )
  );
}

export function SearchAutocomplete() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ProductSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  
  const [placeholder, setPlaceholder] = useState("");
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (isFocused) return;

    let timer: NodeJS.Timeout;
    const currentPhrase = SEARCH_PLACEHOLDERS[currentPhraseIndex];

    if (!isDeleting) {
      if (placeholder.length < currentPhrase.length) {
        timer = setTimeout(() => {
          setPlaceholder(currentPhrase.substring(0, placeholder.length + 1));
        }, 80);
      } else {
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, 1500);
      }
    } else {
      if (placeholder.length > 0) {
        timer = setTimeout(() => {
          setPlaceholder(currentPhrase.substring(0, placeholder.length - 1));
        }, 40);
      } else {
        // Wrap setState calls in setTimeout to avoid cascading renders warning
        timer = setTimeout(() => {
          setIsDeleting(false);
          setCurrentPhraseIndex((prev) => (prev + 1) % SEARCH_PLACEHOLDERS.length);
        }, 500); // 500ms pause before starting typing the next phrase
      }
    }

    return () => clearTimeout(timer);
  }, [placeholder, isDeleting, currentPhraseIndex, isFocused]);

  // ── Debounce the query ──
  const debouncedQuery = useDebounce(query, 300);
  const id = useId();

  // ── Fetch results ──
  useEffect(() => {
    const fetchResults = async () => {
      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      if (!debouncedQuery.trim()) {
        setResults([]);
        setIsOpen(false);
        setLoading(false);
        return;
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;
      setLoading(true);

      try {
        const qs = new URLSearchParams();
        qs.set("Page", "1");
        qs.set("PageSize", "6"); // show up to 6 suggestions
        // use lowercase `search` to match front-end URLs
        qs.set("search", debouncedQuery);

        const res = await clientFetch(`/api/products?${qs}`, {
          signal: controller.signal,
        });

        if (!res.ok) {
          setResults([]);
          setLoading(false);
          return;
        }

        const data = await res.json();
        setResults(data.data || []);
        setIsOpen(true);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [debouncedQuery]);

  // ── Close dropdown on outside click ──
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ── Keyboard navigation ──
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // allow Enter to submit a query even if dropdown is closed
    if (!isOpen && results.length === 0 && !query.trim()) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (results.length === 0) break;
        setSelectedIndex((prev) => (prev < 0 ? 0 : Math.min(prev + 1, results.length - 1)));
        break;
      case "ArrowUp":
        e.preventDefault();
        if (results.length === 0) break;
        setSelectedIndex((prev) => (prev <= 0 ? results.length - 1 : prev - 1));
        break;
      case "Enter": {
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < results.length) {
          // Go to product detail
          router.push(`/products/${results[selectedIndex].id}`);
          setIsOpen(false);
          setQuery("");
          inputRef.current?.blur();
        } else if (query.trim()) {
          // Go to full search results page
          router.push(`/products?search=${encodeURIComponent(query.trim())}`);
          setIsOpen(false);
          setQuery("");
          inputRef.current?.blur();
        }
        break;
      }
      case "Escape":
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setIsOpen(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  // reset selection when results change
  useEffect(() => {
    setSelectedIndex(-1);
  }, [results]);

  // Render
  const showDropdown = isOpen && (results.length > 0 || loading);

  return (
    <div ref={containerRef} className="relative w-full mx-2 sm:mx-4">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
        <input
          ref={inputRef}
          type="text"
          placeholder={isFocused ? "Search Commerce..." : placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            setIsFocused(true);
            if (results.length > 0) setIsOpen(true);
          }}
          onBlur={() => {
            setIsFocused(false);
          }}
          className="w-full pl-11 pr-10 py-2.5 text-sm bg-white text-slate-900 border-0 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-300 shadow-sm"
          aria-label="Search products"
          role="combobox"
          aria-expanded={showDropdown}
          aria-controls={`${id}-listbox`}
          aria-autocomplete="list"
          aria-activedescendant={selectedIndex >= 0 ? `${id}-option-${selectedIndex}` : undefined}
          autoComplete="off"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        )}
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4 animate-spin" />
        )}
      </div>

      {/* ── Dropdown ── */}
      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden z-50">
          {loading ? (
            <div className="p-4 text-center text-sm text-slate-500">Loading...</div>
          ) : results.length === 0 ? (
            <div className="p-4 text-center text-sm text-slate-500">No products found</div>
          ) : (
            <>
              <ul id={`${id}-listbox`} role="listbox" className="max-h-96 overflow-y-auto divide-y divide-slate-100">
                {results.map((product, index) => (
                  <li key={product.id}>
                    <Link
                      href={`/products/${product.id}`}
                      className={`flex items-center gap-3 p-3 hover:bg-indigo-50 transition-colors ${
                        index === selectedIndex ? "bg-indigo-50" : ""
                      }`}
                      onClick={() => {
                        setIsOpen(false);
                        setQuery("");
                      }}
                      onMouseEnter={() => setSelectedIndex(index)}
                    >
                      {product.images?.[0]?.imageUrl ? (
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                          <Image
                            src={product.images[0].imageUrl}
                            alt={product.name || ""}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center text-slate-300 text-xs shrink-0">
                          No img
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p
                          id={`${id}-option-${index}`}
                          role="option"
                          aria-selected={index === selectedIndex}
                          className="text-sm font-medium text-slate-900 truncate"
                        >
                          {highlightText(product.name || "", query)}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
              {/* "View all" link */}
              <div className="border-t border-slate-100 p-2">
                <Link
                  href={`/products?search=${encodeURIComponent(query.trim())}`}
                  className="block text-center text-sm text-indigo-600 hover:underline font-medium py-1"
                  onClick={() => {
                    setIsOpen(false);
                    setQuery("");
                  }}
                >
                  View all results for “{query.trim()}”
                </Link>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}