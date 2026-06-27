"use client";

import {useState} from "react";
import {Plus, Minus, FileText, List} from "lucide-react";
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/components/ui/collapsible";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ProductDetailsAccordionProps {
  description: string;
  specifications?: Array<{ key?: string; value?: string }>;
}

export function ProductDetailsAccordion({
                                          description,
                                          specifications,
                                        }: ProductDetailsAccordionProps) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isSpecsOpen, setIsSpecsOpen] = useState(false);

  return (
    <div className="mt-12 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Product Details */}
      <Collapsible open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <CollapsibleTrigger
          className="flex w-full items-center justify-between px-6 py-4 text-left text-base font-semibold text-slate-900 hover:bg-slate-50 transition-colors border-b border-slate-100 select-none">
          <span className="flex items-center gap-2">
            <FileText size={18} className="text-slate-400"/>
            Product Details
          </span>
          {isDetailsOpen ? <Minus size={18} className="text-slate-400"/> : <Plus size={18} className="text-slate-400"/>}
        </CollapsibleTrigger>
        <CollapsibleContent className="px-6 py-4 text-slate-600 leading-relaxed prose prose-slate max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {description}
          </ReactMarkdown>
        </CollapsibleContent>
      </Collapsible>

      {/* Product Specifications */}
      {specifications && specifications.length > 0 && (
        <Collapsible open={isSpecsOpen} onOpenChange={setIsSpecsOpen}>
          <CollapsibleTrigger
            className="flex w-full items-center justify-between px-6 py-4 text-left text-base font-semibold text-slate-900 hover:bg-slate-50 transition-colors border-b border-slate-100 select-none">
            <span className="flex items-center gap-2">
              <List size={18} className="text-slate-400"/>
              Product Specifications
            </span>
            {isSpecsOpen ? <Minus size={18} className="text-slate-400"/> : <Plus size={18} className="text-slate-400"/>}
          </CollapsibleTrigger>
          <CollapsibleContent className="px-6 py-4">
            <div className="space-y-1">
              {specifications.map((spec, index) => (
                <div
                  key={index}
                  className={`grid grid-cols-2 gap-4 px-3 py-2 rounded-lg ${
                    index % 2 === 0 ? "bg-slate-50" : "bg-white"
                  }`}
                >
                  <span className="text-sm font-medium text-slate-600">{spec.key || ""}</span>
                  <span className="text-sm text-slate-900">{spec.value || ""}</span>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
}
