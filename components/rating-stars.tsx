import {Star} from "lucide-react";

export function RatingStars({ average }: { average: number | null | undefined }) {
  // Hide the entire rating area when there are no reviews.
  if (average == null) return null;

  const rounded = Math.round(average);

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            size={12}
            className={
              i <= rounded ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200"
            }
          />
        ))}
      </div>
      <span className="text-xs text-slate-500">{average.toFixed(1)}</span>
    </div>
  );
}
