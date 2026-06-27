"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Star, Pencil, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ReviewForm } from "./review-form";
import { useAuthStore } from "@/store/auth";

interface ReviewItemProps {
  review: {
    id: string;
    userName: string;
    score: number;
    comment: string | null;
    createdAt: string;
    userId: string;
  };
  onEdit: () => void;
  onDelete: () => void;
}

export function ReviewItem({ review, onEdit, onDelete }: ReviewItemProps) {
  const { user } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isAuthor = user?.id === review.userId;

  const handleDelete = async () => {
    setIsDeleting(true);
    await onDelete();
    setIsDeleting(false);
    setDeleteDialogOpen(false);
  };

  if (isEditing) {
    return (
      <ReviewForm
        initialData={{ score: review.score, comment: review.comment || "" }}
        reviewId={review.id}
        onSubmit={() => {
          setIsEditing(false);
          onEdit();
        }}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <div className="border-b border-slate-200 py-4 last:border-0">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-slate-900">{review.userName}</span>
            <span className="text-xs text-slate-400">
              {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
            </span>
          </div>
          <div className="flex items-center gap-1 mt-0.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                size={14}
                className={i <= review.score ? "fill-amber-400 text-amber-400" : "text-slate-200"}
              />
            ))}
          </div>
          {review.comment && (
            <p className="text-sm text-slate-600 mt-1">{review.comment}</p>
          )}
        </div>
        {isAuthor && (
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)}>
              <Pencil size={14} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDeleteDialogOpen(true)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 size={14} />
            </Button>
          </div>
        )}
      </div>

      {/* ─── Delete Confirmation Dialog ─── */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Delete Review</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this review? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Review"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}