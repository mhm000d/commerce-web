"use client";

import { useState } from 'react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { createReview, updateReview } from '@/lib/api/reviews';
import getErrorMessage from '@/lib/error-messages';

interface ReviewFormProps {
  productId?: string;
  reviewId?: string;
  initialData?: { score: number; comment: string };
  onCancel?: () => void;
  onSubmit: () => void;
}

export function ReviewForm({
                             productId,
                             reviewId,
                             initialData,
                             onCancel,
                             onSubmit,
                           }: ReviewFormProps) {
  const [score, setScore] = useState(initialData?.score || 0);
  const [comment, setComment] = useState(initialData?.comment || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (score === 0) {
      toast.error('Please select a rating.');
      return;
    }
    setLoading(true);
    try {
      if (reviewId) {
        await updateReview(reviewId, { score, comment: comment.trim() || undefined });
        toast.success('Review updated.');
      } else if (productId) {
        await createReview(productId, { score, comment: comment.trim() || undefined });
        toast.success('Review submitted.');
      }
      setScore(0);
      setComment('');
      onSubmit();
    } catch (err: unknown) {
      const errorData = err as { response?: { data?: { code?: string } } };
      if (errorData?.response?.data?.code === 'NOT_PURCHASED') {
        toast.error('You can only review products you have purchased.');
      } else {
        toast.error(getErrorMessage(err));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      <div className="flex items-center gap-1">
        <span className="text-sm font-medium text-slate-700">Your rating:</span>
        {[1, 2, 3, 4, 5].map((i) => (
          <button
            key={i}
            type="button"
            onClick={() => setScore(i)}
            className="focus:outline-none transition-colors"
          >
            <Star
              size={24}
              className={i <= score ? 'fill-amber-400 text-amber-400' : 'text-slate-300 hover:text-slate-400'}
            />
          </button>
        ))}
        {score > 0 && <span className="text-sm text-slate-500 ml-2">{score} / 5</span>}
      </div>
      <Textarea
        placeholder="Write your review (optional)"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={3}
      />
      <div className="flex gap-2">
        <Button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : reviewId ? 'Update Review' : 'Submit Review'}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}