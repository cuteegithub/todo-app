import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { Link } from "wouter";

export default function BottomNavigation() {
  const { toast } = useToast();
  const [location] = useLocation();

  const navItems = [
    { 
      key: "tasks", 
      label: "Tasks", 
      path: "/",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
        </svg>
      )
    },
    { 
      key: "profile", 
      label: "Profile", 
      path: "/profile",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
        </svg>
      )
    },
    { 
      key: "calendar", 
      label: "Calendar", 
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
        </svg>
      )
    },
    { 
      key: "insights", 
      label: "Insights", 
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M5 9.2h3V19H5zM10.6 5h2.8v14h-2.8zm5.6 8H19v6h-2.8z"/>
        </svg>
      )
    },
  ];

  const handleNavClick = (key: string, path?: string) => {
    if (path) {
      // Navigation is handled by Link component
      return;
    }
    
    toast({
      title: "Coming Soon",
      description: `${key.charAt(0).toUpperCase() + key.slice(1)} feature is coming soon!`,
    });
  };

  return (
    <nav className="bg-surface border-t border-gray-100 px-4 py-2">
      <div className="flex justify-around">
        {navItems.map(({ key, label, icon, path }) => {
          const isActive = path ? location === path : false;
          
          return path ? (
            <Link key={key} href={path}>
              <Button
                variant="ghost"
                className={`flex flex-col items-center py-2 px-4 h-auto rounded-lg transition-colors ${
                  isActive
                    ? "text-primary hover:text-primary-dark"
                    : "text-text-secondary hover:text-text-primary hover:bg-gray-100"
                }`}
              >
                <div className="mb-1">
                  {icon}
                </div>
                <span className="text-xs font-medium">{label}</span>
              </Button>
            </Link>
          ) : (
            <Button
              key={key}
              variant="ghost"
              onClick={() => handleNavClick(key, path)}
              className="flex flex-col items-center py-2 px-4 h-auto rounded-lg transition-colors text-text-secondary hover:text-text-primary hover:bg-gray-100"
            >
              <div className="mb-1">
                {icon}
              </div>
              <span className="text-xs font-medium">{label}</span>
            </Button>
          );
        })}
      </div>
    </nav>
  );
}
