import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useTasks } from "@/hooks/useTasks";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Calendar } from "@/components/calendar";
import BottomNavigation from "@/components/bottom-navigation";
import PullToRefresh from "@/components/pull-to-refresh";

export default function CalendarPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { tasks, isLoading, refetch } = useTasks();
  const { toast } = useToast();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, authLoading, toast]);

  const getUserDisplayName = () => {
    if ((user as any)?.firstName && (user as any)?.lastName) {
      return `${(user as any).firstName} ${(user as any).lastName}`;
    }
    if ((user as any)?.firstName) return (user as any).firstName;
    if ((user as any)?.email) return (user as any).email;
    return "User";
  };

  const getUserInitials = () => {
    if ((user as any)?.firstName && (user as any)?.lastName) {
      return `${(user as any).firstName[0]}${(user as any).lastName[0]}`.toUpperCase();
    }
    if ((user as any)?.firstName) return (user as any).firstName[0].toUpperCase();
    if ((user as any)?.email) return (user as any).email[0].toUpperCase();
    return "U";
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-surface min-h-screen relative overflow-hidden">
      <PullToRefresh onRefresh={async () => { await refetch(); }}>
        <div className="min-h-screen flex flex-col">
          {/* App Header */}
          <header className="bg-surface shadow-sm border-b border-gray-100 px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {/* User avatar */}
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center overflow-hidden">
                  {(user as any)?.profileImageUrl ? (
                    <img 
                      src={(user as any).profileImageUrl} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-white text-sm font-medium">{getUserInitials()}</span>
                  )}
                </div>
                <div>
                  <h2 className="text-text-primary font-medium text-lg">Calendar</h2>
                  <p className="text-text-secondary text-sm">{getUserDisplayName()}</p>
                </div>
              </div>
              <button 
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                onClick={() => {
                  toast({
                    title: "View Options",
                    description: "Calendar view options coming soon!",
                  });
                }}
              >
                <svg className="w-6 h-6 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </button>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto pb-24">
            <div className="px-4 py-4">
              {isLoading ? (
                <div className="bg-surface p-6 rounded-lg border border-gray-100">
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 rounded"></div>
                      <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                      <div className="h-3 bg-gray-200 rounded w-4/6"></div>
                    </div>
                  </div>
                </div>
              ) : (
                <Calendar tasks={tasks || []} />
              )}

              {/* Calendar Stats */}
              {!isLoading && tasks && tasks.length > 0 && (
                <div className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-100">
                  <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                    <svg className="w-5 h-5 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
                    </svg>
                    Task Overview
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-white p-3 rounded-lg border border-blue-200">
                      <div className="text-2xl font-bold text-blue-600">
                        {tasks.filter(t => t.status === 'open').length}
                      </div>
                      <div className="text-gray-600">Active Tasks</div>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-green-200">
                      <div className="text-2xl font-bold text-green-600">
                        {tasks.filter(t => t.status === 'completed').length}
                      </div>
                      <div className="text-gray-600">Completed</div>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-orange-200">
                      <div className="text-2xl font-bold text-orange-600">
                        {tasks.filter(t => t.priority === 'high').length}
                      </div>
                      <div className="text-gray-600">High Priority</div>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-purple-200">
                      <div className="text-2xl font-bold text-purple-600">
                        {tasks.filter(t => {
                          if (!t.dueDate) return false;
                          const today = new Date();
                          const taskDate = new Date(t.dueDate);
                          return taskDate.toDateString() === today.toDateString();
                        }).length}
                      </div>
                      <div className="text-gray-600">Due Today</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </main>

          {/* Bottom Navigation */}
          <BottomNavigation />
        </div>
      </PullToRefresh>
    </div>
  );
}