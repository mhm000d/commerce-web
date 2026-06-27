import {clientFetch} from '@/lib/client-fetch';
import type {RatingResponse, PagedResponse} from '@/lib/api/types';

export async function getProductReviews(
  productId: string,
  params: { page?: number; pageSize?: number; sortBy?: string } = {}
): Promise<PagedResponse<RatingResponse>> {
  const qs = new URLSearchParams();
  if (params.page) qs.set('page', String(params.page));
  if (params.pageSize) qs.set('pageSize', String(params.pageSize));
  if (params.sortBy) qs.set('sortBy', params.sortBy);

  const res = await clientFetch(`/api/products/${productId}/ratings?${qs}`);
  if (!res.ok) throw new Error('Failed to load reviews');
  return res.json();
}

export async function createReview(productId: string, data: { score: number; comment?: string }) {
  const res = await clientFetch(`/api/products/${productId}/ratings`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err?.message || 'Failed to submit review');
  }
  return res.json();
}

export async function updateReview(reviewId: string, data: { score: number; comment?: string }) {
  const res = await clientFetch(`/api/ratings/${reviewId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err?.message || 'Failed to update review');
  }
  return res.json();
}

export async function deleteReview(reviewId: string) {
  const res = await clientFetch(`/api/ratings/${reviewId}`, {method: 'DELETE'});
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err?.message || 'Failed to delete review');
  }
}