import { Bell, Shield, User, Brain, TrendingUp, Pill, Package, Radio, Camera, Mic, Heart, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useNotifications } from "@/contexts/NotificationContext";
import { NotificationPanel } from "@/components/ui/notification-panel";
import { ProfileMenu } from "@/components/ui/profile-menu";
import { useState } from "react";

export const Header = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userRole] = useState<"admin" | "manager" | "staff" | "supplier">("admin");
  
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

  const navigationItems = [
    { to: "/infinite-memory", icon: Brain, label: "Infinite Memory", variant: "outline" as const },
    { to: "/ml-predictions", icon: TrendingUp, label: "ML Predictions", variant: "outline" as const },
    { to: "/medicine-recommendation", icon: Pill, label: "Enhanced Medicine AI", variant: "outline" as const },
    { to: "/echomed-ai", icon: Heart, label: "EchoMed AI", variant: "outline" as const, special: true },
    { to: "/inventory", icon: Package, label: "Inventory", variant: "outline" as const },
    { to: "/rfid", icon: Radio, label: "RFID", variant: "outline" as const },
    { to: "/skin-analysis", icon: Camera, label: "Skin AI", variant: "outline" as const },
    { to: "/voice-medicine", icon: Mic, label: "Voice Medicine", variant: "outline" as const },
    { to: "/marketplace", icon: Package, label: "Marketplace", variant: "default" as const },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="border-b bg-card shadow-card h-16 flex items-center justify-between px-4 lg:px-6 relative z-50">
        {/* Left Side - Hamburger Button and Logo */}
        <div className="flex items-center gap-4">
          {/* Hamburger Menu Button - Left side */}
          <Button 
            variant="ghost" 
            size="icon"
            className="hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 rounded-full p-2"
            onClick={toggleMobileMenu}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>

          {/* Logo - Clickable to go to landing page */}
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity duration-200 cursor-pointer">
            <Shield className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-xl font-bold text-foreground">MedChain</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">Inventory System</p>
            </div>
          </Link>
        </div>

        {/* Right Side - Actions */}
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 rounded-full p-2"
            onClick={openPanel}
          >
            <Bell className="h-5 w-5" />
            {(unreadCount > 0 || highPriorityCount > 0) && (
              <span className="notification-badge absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg">
                {unreadCount > 0 ? unreadCount : highPriorityCount}
              </span>
            )}
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon"
            className="hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 rounded-full p-2"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
          >
            <User className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Navigation Menu - Always slide-out style */}
      <div className={`fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity duration-300 ${
        isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`} onClick={closeMobileMenu}>
        <div className={`absolute left-0 top-16 w-80 h-full bg-white shadow-xl transform transition-transform duration-300 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`} onClick={(e) => e.stopPropagation()}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-800">Navigation</h2>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={closeMobileMenu}
                className="hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <nav className="space-y-2">
              {navigationItems.map((item, index) => (
                <Link key={index} to={item.to} onClick={closeMobileMenu}>
                  <div className={`flex items-center gap-3 p-3 rounded-lg transition-colors duration-200 ${
                    item.special 
                      ? "bg-gradient-to-r from-pink-50 to-red-50 border border-pink-200 text-pink-700 hover:from-pink-100 hover:to-red-100" 
                      : "hover:bg-gray-50 text-gray-700"
                  }`}>
                    <item.icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </div>
                </Link>
              ))}
            </nav>

            {/* Menu Footer */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="text-sm text-gray-500">
                <p>MedChain Inventory System</p>
                <p className="mt-1">Secure blockchain-powered healthcare inventory management</p>
              </div>
            </div>
          </div>
        </div>
      </div>

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