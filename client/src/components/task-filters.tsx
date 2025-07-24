import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Task } from "@shared/schema";

interface TaskFiltersProps {
  filter: "all" | "active" | "completed" | "high";
  onFilterChange: (filter: "all" | "active" | "completed" | "high") => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  tasks?: Task[];
}

export default function TaskFilters({ filter, onFilterChange, searchQuery, onSearchChange, tasks = [] }: TaskFiltersProps) {
  const getTaskCount = (filterKey: string) => {
    switch (filterKey) {
      case "all":
        return tasks.length;
      case "active":
        return tasks.filter(task => task.status === "open").length;
      case "completed":
        return tasks.filter(task => task.status === "completed").length;
      case "high":
        return tasks.filter(task => task.priority === "high").length;
      default:
        return 0;
    }
  };

  const filters = [
    { key: "all", label: "All Tasks", icon: "📋" },
    { key: "active", label: "Active", icon: "⚡" },
    { key: "completed", label: "Completed", icon: "✅" },
    { key: "high", label: "High Priority", icon: "🔥" },
  ] as const;

  return (
    <div className="bg-surface px-4 py-3 border-b border-gray-100">
      {/* Search Bar */}
      <div className="relative mb-3">
        <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <Input
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-background rounded-lg border-0 text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Filter Chips */}
      <div className="flex space-x-2 overflow-x-auto pb-1">
        {filters.map(({ key, label, icon }) => {
          const count = getTaskCount(key);
          const isActive = filter === key;
          
          return (
            <Button
              key={key}
              onClick={() => {
                // Add vibration feedback for mobile users
                if (navigator.vibrate) {
                  navigator.vibrate(50);
                }
                onFilterChange(key);
              }}
              variant="ghost"
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap h-auto flex items-center space-x-2 transition-all duration-200 active:scale-95 touch-manipulation ${
                isActive
                  ? "bg-primary text-white hover:bg-primary-dark shadow-lg transform scale-105 ring-2 ring-primary ring-opacity-50"
                  : "bg-background text-text-secondary hover:bg-gray-100 hover:shadow-md hover:scale-102"
              }`}
            >
              <span className="text-base">{icon}</span>
              <span>{label}</span>
              {count > 0 && (
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  isActive 
                    ? "bg-white/20 text-white" 
                    : "bg-primary/10 text-primary"
                }`}>
                  {count}
                </span>
              )}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
