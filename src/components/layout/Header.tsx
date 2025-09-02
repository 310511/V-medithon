import { Bell, Shield, User, Brain, TrendingUp, Pill, Package, Radio, Camera, Mic, Heart, Menu, X, Sparkles, LogIn, UserPlus, Hospital, Stethoscope, Activity, Zap, Settings, Dna, AlertTriangle, Dumbbell, Calculator, Calendar, Target, BarChart3, Activity as ActivityIcon, Disc3, Plane, Utensils, Database, FileText, Link as LinkIcon, Music, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { useNotifications } from "@/contexts/NotificationContext";
import { NotificationPanel } from "@/components/ui/notification-panel";
import { ProfileMenu } from "@/components/ui/profile-menu";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";

export const Header = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userRole] = useState<"admin" | "manager" | "staff" | "supplier">("admin");
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();
  
  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Close mobile menu when Escape key is pressed
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMobileMenuOpen) {
        closeMobileMenu();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMobileMenuOpen]);
  
  const { 
    unreadCount, 
    highPriorityCount, 
    isPanelOpen, 
    openPanel, 
    closePanel,
    notifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll
  } = useNotifications();

  // Tier-based navigation structure for hackathon focus
  const navigationCategories = [
    {
      title: "🎯 TIER 1 - Core Features",
      items: [
        { to: "/meal-insulin", icon: Utensils, label: "Meal Insulin Prediction", highlight: true, tier: 1 },
        { to: "/eeg-glucose", icon: Brain, label: "Phone Bluetooth Glucose", highlight: true, tier: 1 },
        { to: "/dashboard", icon: Activity, label: "Mobile-First Platform", highlight: true, tier: 1 },
        { to: "/rfid", icon: Radio, label: "RFID Scanner", highlight: true, tier: 1 },
        { to: "/marketplace", icon: Package, label: "Marketplace", highlight: true, tier: 1 },
      ]
    },
    {
      title: "💡 TIER 2 - Supporting Features",
      items: [
        { to: "/disease-diagnosis", icon: Stethoscope, label: "AI Disease Diagnosis", tier: 2 },
        { to: "/medical-records", icon: User, label: "Blockchain Medical Records", tier: 2 },
        { to: "/readmission-risk", icon: Hospital, label: "Predictive Analytics", tier: 2 },
        { to: "/echomed-ai", icon: Heart, label: "EchoMed AI Assistant", tier: 2 },
        { to: "/ai-medicine-recommendation", icon: Pill, label: "AI Medicine Recommendation", tier: 2 },
        { to: "/infinite-memory", icon: Database, label: "Infinite Memory", tier: 2 },
        { to: "/ml-predictions", icon: BarChart3, label: "ML Predictions", tier: 2 },
        { to: "/voice-medicine", icon: Mic, label: "Voice Medicine Assistant", tier: 2 },
        { to: "/skin-analysis", icon: Camera, label: "Skin Analysis", tier: 2 },
        { to: "/drone-delivery", icon: Plane, label: "Drone Delivery", tier: 2 },
      ]
    },
    {
      title: "📝 TIER 3 - Additional Features",
      items: [
        { to: "/genetrust", icon: Dna, label: "GeneTrust AI Studio", tier: 3 },
        { to: "/fitness-dashboard", icon: Dumbbell, label: "Fitness Dashboard", tier: 3 },
        { to: "/inventory", icon: Activity, label: "Inventory Management", tier: 3 },
        { to: "/mental-health", icon: Brain, label: "Zenith Wellness", tier: 3 },
        { to: "/insurance-coverage", icon: Shield, label: "Insurance Coverage Model", tier: 3 },
        { to: "/patient-profile", icon: UserCheck, label: "Patient Profile", tier: 3 },
        { to: "/prescriptions", icon: FileText, label: "Prescriptions", tier: 3 },
        { to: "/genechain-dashboard", icon: LinkIcon, label: "GeneChain Dashboard", tier: 3 },
        { to: "/bmi-calculator", icon: Calculator, label: "BMI Calculator", tier: 3 },
        { to: "/period-tracker", icon: Calendar, label: "Period Tracker", tier: 3 },
        { to: "/health-analytics", icon: TrendingUp, label: "Health Analytics", tier: 3 },
        { to: "/spotify-integration", icon: Music, label: "Spotify Integration", tier: 3 },
        { to: "/ai-wellness-planner", icon: Target, label: "AI Wellness Planner", tier: 3 },
        { to: "/enhanced-drone-delivery", icon: Plane, label: "Enhanced Drone Delivery", tier: 3 },
      ]
    }
  ];

  const toggleMobileMenu = () => {
    const newState = !isMobileMenuOpen;
    console.log('Mobile menu toggled:', newState);
    setIsMobileMenuOpen(newState);
  };

  const closeMobileMenu = () => {
    console.log('Mobile menu closed');
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 border-b bg-card shadow-card h-14 sm:h-16 flex items-center justify-between px-3 sm:px-4 lg:px-6 z-50 dark:bg-card dark:border-border backdrop-blur-sm bg-card/95">
        {/* Left Side - Hamburger Button and Logo */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Hamburger Menu Button - Left side */}
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950 dark:hover:text-blue-400 transition-all duration-200 rounded-full p-1.5 sm:p-2"
            onClick={toggleMobileMenu}
          >
            {isMobileMenuOpen ? <X className="h-4 w-4 sm:h-5 sm:w-5" /> : <Menu className="h-4 w-4 sm:h-5 sm:w-5" />}
          </Button>

          {/* Logo - Clickable to go to landing page */}
          <Link to="/" className="flex items-center gap-1.5 sm:gap-2 hover:opacity-80 transition-opacity duration-200 cursor-pointer dark:text-foreground">
            <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-foreground">DoseWise</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">Healthcare AI Platform</p>
            </div>
          </Link>
        </div>

        {/* Right Side - Actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          <ThemeToggle />
          
          {isAuthenticated && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950 dark:hover:text-blue-400 transition-all duration-200 rounded-full p-1.5 sm:p-2"
              onClick={openPanel}
            >
              <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
              {(unreadCount > 0 || highPriorityCount > 0) && (
                <span className="notification-badge absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg">
                  {unreadCount > 0 ? unreadCount : highPriorityCount}
                </span>
              )}
            </Button>
          )}
          
          {isAuthenticated ? (
            <Button 
              variant="ghost" 
              size="icon"
              className="hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950 dark:hover:text-blue-400 transition-all duration-200 rounded-full p-1.5 sm:p-2"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              <User className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          ) : (
            <div className="flex items-center gap-1 sm:gap-2">
              <Link to="/signin">
                <Button variant="outline" size="sm" className="gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3">
                  <LogIn className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Sign In</span>
                </Button>
              </Link>
              <Link to="/signup">
                <Button size="sm" className="gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3">
                  <UserPlus className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Sign Up</span>
                </Button>
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Enhanced Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity duration-300 opacity-100 pointer-events-auto" onClick={closeMobileMenu}>
          <div className="absolute left-0 top-14 sm:top-16 w-72 sm:w-80 h-full bg-white dark:bg-gray-900 shadow-xl transform transition-transform duration-300 translate-x-0 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-3 sm:p-4">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h2 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-200">Navigation</h2>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={closeMobileMenu}
                  className="hover:bg-gray-100 dark:hover:bg-gray-800 p-1.5"
                >
                  <X className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </div>
              
              <nav className="space-y-6">
                {navigationCategories.map((category, categoryIndex) => (
                  <div key={categoryIndex}>
                    <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 px-2">
                      {category.title}
                    </h3>
                    <div className="space-y-1">
                      {category.items.map((item, itemIndex) => {
                        const isActive = location.pathname === item.to;
                        return (
                          <Link key={itemIndex} to={item.to} onClick={closeMobileMenu}>
                            <div className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                              isActive 
                                ? "bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-blue-700 hover:from-blue-100 hover:to-indigo-100 dark:from-blue-950 dark:to-indigo-950 dark:border-blue-800 dark:text-blue-300 dark:hover:from-blue-900 dark:hover:to-indigo-900" 
                                : item.highlight
                                ? "hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 hover:border hover:border-green-200 text-gray-700 dark:hover:from-green-950 dark:hover:to-emerald-950 dark:hover:border-green-800 dark:text-gray-300"
                                : "hover:bg-gray-50 text-gray-700 dark:hover:bg-gray-800 dark:text-gray-300"
                            }`}>
                              <item.icon className={`h-5 w-5 ${item.highlight ? 'text-green-600 dark:text-green-400' : ''}`} />
                              <span className="font-medium">{item.label}</span>
                              {item.highlight && (
                                <span className="ml-auto text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-2 py-1 rounded-full">
                                  New
                                </span>
                              )}
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </nav>

              {/* Menu Footer */}
              <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  <p className="font-medium">MedChain AI Platform</p>
                  <p className="mt-1 text-xs">Advanced healthcare AI & blockchain inventory</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <NotificationPanel
        isOpen={isPanelOpen}
        onClose={closePanel}
        notifications={notifications}
        onMarkAsRead={markAsRead}
        onDelete={deleteNotification}
        onMarkAllAsRead={markAllAsRead}
        onClearAll={clearAll}
      />

      <ProfileMenu
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        userRole={userRole}
      />
    </>
  );
};