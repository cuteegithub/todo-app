import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useTasks } from "@/hooks/useTasks";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import TaskFilters from "@/components/task-filters";
import TaskItem from "@/components/task-item";
import AddTaskModal from "@/components/add-task-modal";
import FloatingActionButton from "@/components/floating-action-button";
import BottomNavigation from "@/components/bottom-navigation";
import PullToRefresh from "@/components/pull-to-refresh";
import { CompactCalendar } from "@/components/compact-calendar";
import { Skeleton } from "@/components/ui/skeleton";
import type { Task } from "@shared/schema";

export default function Home() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { tasks, isLoading, refetch } = useTasks();
  const { toast } = useToast();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | "active" | "completed" | "high">("all");
  const [searchQuery, setSearchQuery] = useState("");

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

  // Filter tasks based on current filter and search
  const filteredTasks = tasks?.filter((task: Task) => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (!task.title.toLowerCase().includes(query) && 
          !task.description?.toLowerCase().includes(query)) {
        return false;
      }
    }

    // Status/priority filter
    switch (filter) {
      case "active":
        return task.status === "open";
      case "completed":
        return task.status === "completed";
      case "high":
        return task.priority === "high";
      default:
        return true;
    }
  }) || [];

  // Categorize tasks
  const todayTasks = filteredTasks.filter((task: Task) => {
    if (!task.dueDate) return false;
    const today = new Date();
    const taskDate = new Date(task.dueDate);
    return taskDate.toDateString() === today.toDateString();
  });

  const upcomingTasks = filteredTasks.filter((task: Task) => {
    if (!task.dueDate) return true; // Tasks without due date go to upcoming
    const today = new Date();
    const taskDate = new Date(task.dueDate);
    return taskDate > today;
  });

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

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  if (authLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full"></div>
    </div>;
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
                  <h2 className="text-text-primary font-medium text-lg">{getGreeting()}</h2>
                  <p className="text-text-secondary text-sm">{getUserDisplayName()}</p>
                </div>
              </div>
              <button 
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                onClick={() => {
                  toast({
                    title: "Notifications",
                    description: "Notifications feature coming soon!",
                  });
                }}
              >
                <svg className="w-6 h-6 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
            </div>
          </header>

          {/* Task Filters */}
          <TaskFilters 
            filter={filter}
            onFilterChange={setFilter}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            tasks={tasks}
          />

          {/* Main Content - Tasks First */}
          <main className="flex-1 overflow-y-auto pb-24">
            <div className="px-4 py-2">
              {isLoading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="bg-surface p-4 rounded-lg border border-gray-100">
                      <div className="flex items-start space-x-3">
                        <Skeleton className="w-6 h-6 rounded-full mt-1" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-4/5" />
                          <Skeleton className="h-3 w-full" />
                          <Skeleton className="h-3 w-2/3" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredTasks.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-24 h-24 mx-auto mb-6 bg-background rounded-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-text-secondary" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                    </svg>
                  </div>
                  <h3 className="text-text-primary font-medium text-xl mb-2">
                    {searchQuery || filter !== "all" ? "No tasks found" : "No tasks yet"}
                  </h3>
                  <p className="text-text-secondary text-base mb-6 px-8">
                    {searchQuery || filter !== "all" 
                      ? "Try adjusting your search or filter" 
                      : "Start organizing your day by adding your first task"
                    }
                  </p>
                  {!searchQuery && filter === "all" && (
                    <button 
                      onClick={() => setIsAddModalOpen(true)}
                      className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors"
                    >
                      Add Your First Task
                    </button>
                  )}
                </div>
              ) : (
                <div>
                  {/* Today's Tasks */}
                  {todayTasks.length > 0 && (
                    <div className="mb-6 animate-fadeIn">
                      <h3 className="text-text-primary font-medium text-lg mb-3 flex items-center">
                        <svg className="w-5 h-5 text-primary mr-2" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                        </svg>
                        Today's Tasks
                        <span className="ml-2 bg-primary text-white text-xs px-2 py-1 rounded-full animate-pulse">
                          {todayTasks.length}
                        </span>
                      </h3>
                      <div className="space-y-3">
                        {todayTasks.map((task, index) => (
                          <div key={task.id} className="animate-slideInUp" style={{ animationDelay: `${index * 50}ms` }}>
                            <TaskItem task={task} />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Upcoming Tasks */}
                  {upcomingTasks.length > 0 && (
                    <div className="mb-6 animate-fadeIn">
                      <h3 className="text-text-primary font-medium text-lg mb-3 flex items-center">
                        <svg className="w-5 h-5 text-text-secondary mr-2" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z"/>
                        </svg>
                        {todayTasks.length > 0 ? "Upcoming" : "All Tasks"}
                        <span className="ml-2 bg-text-secondary text-white text-xs px-2 py-1 rounded-full animate-pulse">
                          {upcomingTasks.length}
                        </span>
                      </h3>
                      <div className="space-y-3">
                        {upcomingTasks.map((task, index) => (
                          <div key={task.id} className="animate-slideInUp" style={{ animationDelay: `${index * 50 + todayTasks.length * 50}ms` }}>
                            <TaskItem task={task} />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Compact Calendar Section - After Tasks */}
                  {!isLoading && (
                    <div className="mt-8 mb-6">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-text-primary font-medium text-lg flex items-center">
                          <svg className="w-5 h-5 text-primary mr-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                          </svg>
                          Calendar View
                        </h3>
                        <button 
                          className="text-primary text-sm font-medium hover:text-primary-dark transition-colors"
                          onClick={() => window.location.href = '/calendar'}
                        >
                          View Full Calendar →
                        </button>
                      </div>
                      <div className="bg-white rounded-lg border border-gray-200 p-4">
                        <CompactCalendar tasks={tasks || []} />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </main>

          {/* Floating Action Button */}
          <FloatingActionButton onClick={() => setIsAddModalOpen(true)} />

          {/* Bottom Navigation */}
          <BottomNavigation />
        </div>
      </PullToRefresh>

      {/* Add Task Modal */}
      <AddTaskModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
}
