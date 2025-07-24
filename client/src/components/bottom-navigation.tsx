import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function BottomNavigation() {
  const { toast } = useToast();

  const navItems = [
    { 
      key: "tasks", 
      label: "Tasks", 
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
        </svg>
      ),
      active: true 
    },
    { 
      key: "calendar", 
      label: "Calendar", 
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
        </svg>
      ),
      active: false 
    },
    { 
      key: "insights", 
      label: "Insights", 
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M5 9.2h3V19H5zM10.6 5h2.8v14h-2.8zm5.6 8H19v6h-2.8z"/>
        </svg>
      ),
      active: false 
    },
    { 
      key: "settings", 
      label: "Settings", 
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.82,11.69,4.82,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/>
        </svg>
      ),
      active: false 
    },
  ];

  const handleNavClick = (key: string) => {
    if (key !== "tasks") {
      toast({
        title: "Coming Soon",
        description: `${key.charAt(0).toUpperCase() + key.slice(1)} feature is coming soon!`,
      });
    }
  };

  return (
    <nav className="bg-surface border-t border-gray-100 px-4 py-2">
      <div className="flex justify-around">
        {navItems.map(({ key, label, icon, active }) => (
          <Button
            key={key}
            variant="ghost"
            onClick={() => handleNavClick(key)}
            className={`flex flex-col items-center py-2 px-4 h-auto rounded-lg transition-colors ${
              active
                ? "text-primary hover:text-primary-dark"
                : "text-text-secondary hover:text-text-primary hover:bg-gray-100"
            }`}
          >
            <div className="mb-1">
              {icon}
            </div>
            <span className="text-xs font-medium">{label}</span>
          </Button>
        ))}
      </div>
    </nav>
  );
}
