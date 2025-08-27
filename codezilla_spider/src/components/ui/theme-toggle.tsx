import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { useState, useEffect } from "react";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [isAnimating, setIsAnimating] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleToggle = (e: React.MouseEvent) => {
    // Get mouse position for ripple effect
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePosition({ x, y });

    // Start animation
    setIsAnimating(true);
    
    // Toggle theme with slight delay for smooth animation
    setTimeout(() => {
      toggleTheme();
    }, 150);

    // Reset animation state
    setTimeout(() => {
      setIsAnimating(false);
    }, 600);
  };

  // Create ripple effect
  useEffect(() => {
    if (isAnimating) {
      const overlay = document.createElement('div');
      overlay.className = 'theme-transition-overlay';
      overlay.style.setProperty('--mouse-x', `${mousePosition.x}px`);
      overlay.style.setProperty('--mouse-y', `${mousePosition.y}px`);
      document.body.appendChild(overlay);

      // Trigger animation
      requestAnimationFrame(() => {
        overlay.classList.add('active');
      });

      // Remove overlay after animation
      setTimeout(() => {
        overlay.classList.remove('active');
        setTimeout(() => {
          document.body.removeChild(overlay);
        }, 300);
      }, 300);
    }
  }, [isAnimating, mousePosition]);

  return (
    <div className="theme-toggle-container">
      <Button
        variant="ghost"
        size="icon"
        onClick={handleToggle}
        className="btn-theme-toggle hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950 dark:hover:text-blue-400 rounded-full p-2 relative overflow-hidden"
        aria-label="Toggle theme"
        disabled={isAnimating}
      >
        <div className={`theme-icon ${isAnimating ? 'rotate' : ''}`}>
          {theme === 'light' ? (
            <Moon className="h-5 w-5" />
          ) : (
            <Sun className="h-5 w-5" />
          )}
        </div>
      </Button>
    </div>
  );
}


