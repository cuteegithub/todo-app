import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface TaskFiltersProps {
  filter: "all" | "active" | "completed" | "high";
  onFilterChange: (filter: "all" | "active" | "completed" | "high") => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function TaskFilters({ filter, onFilterChange, searchQuery, onSearchChange }: TaskFiltersProps) {
  const filters = [
    { key: "all", label: "All Tasks" },
    { key: "active", label: "Active" },
    { key: "completed", label: "Completed" },
    { key: "high", label: "High Priority" },
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
        {filters.map(({ key, label }) => (
          <Button
            key={key}
            onClick={() => onFilterChange(key)}
            variant="ghost"
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap h-auto ${
              filter === key
                ? "bg-primary text-white hover:bg-primary-dark"
                : "bg-background text-text-secondary hover:bg-gray-100"
            }`}
          >
            {label}
          </Button>
        ))}
      </div>
    </div>
  );
}
