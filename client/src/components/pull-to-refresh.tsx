import { ReactNode, useState, useRef, TouchEvent } from "react";

interface PullToRefreshProps {
  onRefresh: () => Promise<void> | void;
  children: ReactNode;
}

export default function PullToRefresh({ onRefresh, children }: PullToRefreshProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [startY, setStartY] = useState(0);
  const [isPulling, setIsPulling] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const maxPullDistance = 80;
  const refreshThreshold = 60;

  const handleTouchStart = (e: TouchEvent) => {
    if (containerRef.current?.scrollTop === 0) {
      setStartY(e.touches[0].clientY);
      setIsPulling(true);
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isPulling || isRefreshing) return;

    const currentY = e.touches[0].clientY;
    const distance = Math.max(0, Math.min(maxPullDistance, currentY - startY));
    
    if (distance > 0) {
      e.preventDefault();
      setPullDistance(distance);
    }
  };

  const handleTouchEnd = async () => {
    if (!isPulling) return;

    setIsPulling(false);

    if (pullDistance >= refreshThreshold && !isRefreshing) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } catch (error) {
        console.error("Refresh failed:", error);
      } finally {
        setIsRefreshing(false);
      }
    }

    setPullDistance(0);
  };

  const refreshProgress = Math.min(pullDistance / refreshThreshold, 1);

  return (
    <div
      ref={containerRef}
      className="h-full overflow-y-auto"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        transform: `translateY(${Math.min(pullDistance, maxPullDistance)}px)`,
        transition: isPulling ? 'none' : 'transform 0.3s ease-out',
      }}
    >
      {/* Pull to refresh indicator */}
      {(pullDistance > 0 || isRefreshing) && (
        <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-center py-4 bg-background/95 backdrop-blur-sm">
          <div className="flex items-center space-x-2">
            <div 
              className={`w-6 h-6 border-2 border-primary border-t-transparent rounded-full transition-transform ${
                isRefreshing ? 'animate-spin' : ''
              }`}
              style={{
                transform: `rotate(${refreshProgress * 360}deg)`,
              }}
            />
            <p className="text-text-secondary text-sm">
              {isRefreshing 
                ? "Refreshing tasks..." 
                : pullDistance >= refreshThreshold 
                  ? "Release to refresh" 
                  : "Pull to refresh"
              }
            </p>
          </div>
        </div>
      )}

      {children}
    </div>
  );
}
