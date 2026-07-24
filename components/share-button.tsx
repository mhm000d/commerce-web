"use client";

import { Share2, Link2, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ShareButtonProps {
  title: string;
  text?: string;
  url?: string;
  className?: string;
}

export function ShareButton({ title, text, url, className }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const [canShare, setCanShare] = useState(false);
  const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "");

  useEffect(() => {
    const checkShare = () => {
      if (typeof navigator !== "undefined" && !!navigator.share) {
        setCanShare(true);
      }
    };
    
    // Use requestAnimationFrame to move the state update out of the synchronous render/effect cycle
    // and satisfy the react-hooks/set-state-in-effect rule
    requestAnimationFrame(checkShare);
  }, []);
  
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: text || `Check out ${title} on Commerce!`,
          url: shareUrl,
        });
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          console.error("Error sharing:", error);
          copyToClipboard();
        }
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
      toast.error("Failed to copy link");
    }
  };

  return (
    <Button
      variant="outline"
      size="icon"
      className={`rounded-full h-10 w-10 border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 transition-all ${className}`}
      onClick={handleShare}
      aria-label={canShare ? "Share product" : "Copy link"}
      title={canShare ? "Share product" : "Copy link"}
    >
      {copied ? (
        <Check className="h-4 w-4 text-emerald-600" />
      ) : canShare ? (
        <Share2 className="h-4 w-4" />
      ) : (
        <Link2 className="h-4 w-4" />
      )}
    </Button>
  );
}
