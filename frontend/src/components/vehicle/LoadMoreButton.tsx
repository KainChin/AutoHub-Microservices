import React from 'react';
import { ChevronDown, Loader2 } from 'lucide-react';
import { Button } from '../common/Button';

interface LoadMoreButtonProps {
  hasMore: boolean;
  remainingCount: number;
  isLoading?: boolean;
  onLoadMore: () => void;
}

export const LoadMoreButton: React.FC<LoadMoreButtonProps> = ({
  hasMore,
  remainingCount,
  isLoading = false,
  onLoadMore
}) => {
  if (!hasMore) return null;

  return (
    <div className="flex flex-col items-center justify-center pt-8 pb-4">
      <Button
        variant="secondary"
        size="lg"
        onClick={onLoadMore}
        disabled={isLoading}
        className="rounded-full gap-2 px-8 py-3 bg-slate-900/80 border-slate-700/80 hover:bg-slate-800 hover:border-slate-500 shadow-xl"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-red-500" />
            <span>Đang tải thêm...</span>
          </>
        ) : (
          <>
            <span>Xem Thêm Xe ({remainingCount} xe còn lại)</span>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </>
        )}
      </Button>
    </div>
  );
};
