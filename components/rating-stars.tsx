import {Star} from "lucide-react";

export function RatingStars({ average }: { average: number | null | undefined }) {
  if (!average) {
    return <span className="text-xs text-slate-400">No reviews yet</span>;
  }
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            size={12}
            className={
              i <= Math.round(average)
                ? "fill-amber-400 text-amber-400"
                : "fill-slate-200 text-slate-200"
            }
          />
        ))}
      </div>
      <span className="text-xs text-slate-500">{average.toFixed(1)}</span>
    </div>
  );
}
