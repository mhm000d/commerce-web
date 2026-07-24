"use client";

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import { getProductReviews, deleteReview } from '@/lib/api/reviews';
import { ReviewItem } from './review-item';
import { ReviewForm } from './review-form';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import getErrorMessage from '@/lib/error-messages';
import type { components } from '@/types/api';

type RatingResponse = components['schemas']['Commerce.Contracts.Ratings.RatingResponse'];

interface Review extends RatingResponse {
  userId: string;
}

interface ProductReviewsProps {
  productId: string;
  onReviewChange?: () => void;
}

const PAGE_SIZE = 5;

export function ProductReviews({ productId, onReviewChange }: ProductReviewsProps) {
  const router = useRouter();
  const { status, user } = useAuthStore();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState<string>('newest');
  const [showForm, setShowForm] = useState(false);
  const [hasUserReviewed, setHasUserReviewed] = useState(false);

  const fetchReviews = useCallback(
    async (page: number, append = false) => {
      const setLoadingState = page === 1 ? setLoading : setLoadingMore;
      setLoadingState(true);

      try {
        const response = await getProductReviews(productId, {
          page,
          pageSize: PAGE_SIZE,
          sortBy,
        });

        const items = response.data as Review[];
        setTotalPages(response.pagination?.totalPages || 1);

        if (append) {
          setReviews((prev) => [...prev, ...items]);
        } else {
          setReviews(items);
        }

        if (user) {
          setHasUserReviewed(items.some((r) => r.userId === user.id));
        }
      } catch {
        toast.error('Failed to load reviews');
      } finally {
        setLoadingState(false);
      }
    },
    [productId, sortBy, user]
  );

  // ── Initial load / sort change ──
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentPage(1);
    fetchReviews(1, false);
  }, [sortBy, fetchReviews]);

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    fetchReviews(nextPage, true);
  };

  const handleDelete = async (reviewId: string) => {
    const previousReviews = [...reviews];
    setReviews((prev) => prev.filter((r) => r.id !== reviewId));
    
    try {
      await deleteReview(reviewId);
      toast.success('Review deleted.');
      await fetchReviews(1, false);
      onReviewChange?.();
      router.refresh();
    } catch (err) {
      setReviews(previousReviews);
      toast.error(getErrorMessage(err));
    }
  };

  if (loading) {
    return <div className="animate-pulse space-y-4"><div className="h-20 bg-slate-100 rounded" /></div>;
  }

  return (
    <div className="mt-12 border-t border-slate-200 pt-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-slate-900">
          Reviews ({reviews.length > 0 ? reviews.length : '...'})
        </h2>
        {/* Sort dropdown */}
        {reviews.length > 0 && (
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-sm border border-slate-200 rounded-lg bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="newest">Newest</option>
            <option value="highest">Highest Rating</option>
            <option value="lowest">Lowest Rating</option>
          </select>
        )}
      </div>

      {/* Write Review */}
      {status === 'authenticated' && !hasUserReviewed && !showForm && (
        <div>
          <Button onClick={() => setShowForm(true)} className="mb-6">
            Write a Review
          </Button>
          <p className="text-xs text-slate-400 mt-1">
            You can only review products you have purchased.
          </p>
        </div>
      )}

      {showForm && (
        <ReviewForm
          productId={productId}
          onSubmit={() => {
            setShowForm(false);
            fetchReviews(1, false);
            onReviewChange?.();
            router.refresh();
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Review List */}
      {reviews.length === 0 ? (
        <p className="text-slate-500">No reviews yet. Be the first!</p>
      ) : (
        <div className="space-y-2">
          {reviews.map((review) => (
            <ReviewItem
              key={review.id}
              review={{
                id: review.id!,
                userName: review.userName!,
                score: review.score!,
                comment: review.comment ?? null,
                createdAt: review.createdAt!,
                userId: review.userId!,
              }}
              onEdit={() => {
                fetchReviews(1, false);
                onReviewChange?.();
                router.refresh();
              }}
              onDelete={() => handleDelete(review.id!)}
            />
          ))}
        </div>
      )}

      {/* Load More */}
      {currentPage < totalPages && (
        <div className="mt-6 text-center">
          <Button
            variant="outline"
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="gap-2"
          >
            {loadingMore ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              'Load More Reviews'
            )}
          </Button>
        </div>
      )}

      {/* Show total count if loaded */}
      {reviews.length > 0 && currentPage === totalPages && (
        <p className="text-center text-sm text-slate-400 mt-4">
          Showing all {reviews.length} reviews
        </p>
      )}
    </div>
  );
}