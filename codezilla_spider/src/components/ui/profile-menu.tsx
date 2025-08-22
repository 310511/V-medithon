import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Settings, 
  LogOut, 
  ChevronDown,
  Shield,
  Bell,
  Package,
  TrendingUp,
  Brain,
  Pill,
  Crown,
  Star,
  Activity,
  CreditCard,
  HelpCircle,
  Moon,
  Sun,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  Zap,
  Heart,
  Target
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProfileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  userRole?: "admin" | "manager" | "staff" | "supplier";
}

export const ProfileMenu: React.FC<ProfileMenuProps> = ({
  isOpen,
  onClose,
  userRole = "admin"
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { user, signOut } = useAuth();

  const getUserInfo = () => {
    if (user) {
      return {
        name: user.name,
        email: user.email,
        avatar: user.name.split(' ').map(n => n[0]).join(''),
        role: user.role.charAt(0).toUpperCase() + user.role.slice(1),
        color: "bg-gradient-to-br from-blue-500 to-indigo-500",
        status: "online",
        lastActive: "2 minutes ago",
        department: user.department || "General",
        location: user.address?.city || "Main Office",
        joinDate: new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      };
    }
    
    // Fallback for when user is not available
    switch (userRole) {
      case "admin":
        return {
          name: "Admin User",
          email: "admin@medchain.com",
          avatar: "A",
          role: "System Administrator",
          color: "bg-gradient-to-br from-red-500 to-pink-500",
          status: "online",
          lastActive: "2 minutes ago",
          department: "IT & Security",
          location: "Headquarters",
          joinDate: "Jan 2023"
        };
      case "manager":
        return {
          name: "Manager User",
          email: "manager@medchain.com",
          avatar: "M",
          role: "Inventory Manager",
          color: "bg-gradient-to-br from-blue-500 to-indigo-500",
          status: "online",
          lastActive: "5 minutes ago",
          department: "Operations",
          location: "Main Branch",
          joinDate: "Mar 2023"
        };
      case "staff":
        return {
          name: "Staff User",
          email: "staff@medchain.com",
          avatar: "S",
          role: "Medical Staff",
          color: "bg-gradient-to-br from-green-500 to-emerald-500",
          status: "away",
          lastActive: "1 hour ago",
          department: "Medical",
          location: "Ward 3",
          joinDate: "Jun 2023"
        };
      case "supplier":
        return {
          name: "Supplier User",
          email: "supplier@medchain.com",
          avatar: "S",
          role: "Medicine Supplier",
          color: "bg-gradient-to-br from-purple-500 to-violet-500",
          status: "online",
          lastActive: "30 minutes ago",
          department: "Supply Chain",
          location: "Distribution Center",
          joinDate: "Sep 2023"
        };
      default:
        return {
          name: "User",
          email: "user@medchain.com",
          avatar: "U",
          role: "User",
          color: "bg-gradient-to-br from-gray-500 to-slate-500",
          status: "offline",
          lastActive: "2 hours ago",
          department: "General",
          location: "Main Office",
          joinDate: "Dec 2023"
        };
    }
  };

  const getRolePermissions = () => {
    switch (userRole) {
      case "admin":
        return [
          { name: "System Settings", icon: Settings, href: "/admin/settings", color: "text-blue-600", badge: "Admin" },
          { name: "User Management", icon: User, href: "/admin/users", color: "text-green-600", badge: "Admin" },
          { name: "System Analytics", icon: TrendingUp, href: "/admin/analytics", color: "text-purple-600", badge: "Admin" },
          { name: "Security Settings", icon: Shield, href: "/admin/security", color: "text-red-600", badge: "Admin" }
        ];
      case "manager":
        return [
          { name: "Inventory Settings", icon: Package, href: "/manager/inventory-settings", color: "text-blue-600", badge: "Manager" },
          { name: "Staff Management", icon: User, href: "/manager/staff", color: "text-green-600", badge: "Manager" },
          { name: "Reports & Analytics", icon: TrendingUp, href: "/manager/reports", color: "text-purple-600", badge: "Manager" },
          { name: "Notification Settings", icon: Bell, href: "/manager/notifications", color: "text-orange-600", badge: "Manager" }
        ];
      case "staff":
        return [
          { name: "Personal Settings", icon: User, href: "/staff/profile", color: "text-blue-600", badge: "Staff" },
          { name: "Work Schedule", icon: Settings, href: "/staff/schedule", color: "text-green-600", badge: "Staff" },
          { name: "Inventory Access", icon: Package, href: "/staff/inventory", color: "text-purple-600", badge: "Staff" },
          { name: "Notifications", icon: Bell, href: "/staff/notifications", color: "text-orange-600", badge: "Staff" }
        ];
      case "supplier":
        return [
          { name: "Supplier Dashboard", icon: TrendingUp, href: "/supplier/dashboard", color: "text-blue-600", badge: "Supplier" },
          { name: "Product Management", icon: Package, href: "/supplier/products", color: "text-green-600", badge: "Supplier" },
          { name: "Order Management", icon: Settings, href: "/supplier/orders", color: "text-purple-600", badge: "Supplier" },
          { name: "Analytics", icon: Brain, href: "/supplier/analytics", color: "text-orange-600", badge: "Supplier" }
        ];
      default:
        return [
          { name: "Profile Settings", icon: User, href: "/profile", color: "text-blue-600", badge: "User" },
          { name: "Preferences", icon: Settings, href: "/settings", color: "text-green-600", badge: "User" }
        ];
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "bg-green-500";
      case "away": return "bg-yellow-500";
      case "busy": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const userInfo = getUserInfo();
  const permissions = getRolePermissions();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end pt-16">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <Card className="w-96 shadow-2xl border-0 mr-6 mt-2 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md animate-in slide-in-from-top-2 duration-300">
        <CardContent className="p-0">
          {/* User Info Section */}
          <div className="p-6 border-b bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-800 dark:via-blue-950/20 dark:to-indigo-950/20">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="h-16 w-16 ring-4 ring-white dark:ring-gray-800 shadow-lg">
                  <AvatarImage src="" />
                  <AvatarFallback className={`${userInfo.color} text-white font-bold text-lg`}>
                    {userInfo.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(userInfo.status)} rounded-full border-2 border-white dark:border-gray-800`}></div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg">{userInfo.name}</h3>
                  {userRole === "admin" && (
                    <Crown className="h-4 w-4 text-yellow-500 fill-current" />
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{userInfo.email}</p>
                <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-300 dark:border-blue-800">
                  {userInfo.role}
                </Badge>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-2 flex items-center gap-1">
                  <Activity className="h-3 w-3" />
                  {userInfo.lastActive}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-all duration-200"
              >
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
              </Button>
            </div>

            {/* Expanded User Details */}
            {isExpanded && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400">{userInfo.department}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400">{userInfo.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400">Joined {userInfo.joinDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400">Premium Member</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="p-4 border-b border-gray-100 dark:border-gray-800">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Quick Actions
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <Link to="/profile">
                <Button variant="outline" size="sm" className="w-full justify-start text-xs hover:bg-blue-50 dark:hover:bg-blue-950/20 hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-200">
                  <User className="h-3 w-3 mr-2" />
                  Profile
                </Button>
              </Link>
              <Link to="/settings">
                <Button variant="outline" size="sm" className="w-full justify-start text-xs hover:bg-green-50 dark:hover:bg-green-950/20 hover:border-green-200 dark:hover:border-green-800 transition-all duration-200">
                  <Settings className="h-3 w-3 mr-2" />
                  Settings
                </Button>
              </Link>
            </div>
          </div>

          {/* Role-specific Options */}
          {isExpanded && (
            <div className="p-4 border-b border-gray-100 dark:border-gray-800">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Role Options
              </h4>
              <div className="space-y-2">
                {permissions.map((permission, index) => (
                  <Link key={index} to={permission.href}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-xs hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 group"
                    >
                      <permission.icon className={`h-3 w-3 mr-2 ${permission.color}`} />
                      <span className="flex-1 text-left">{permission.name}</span>
                      <Badge variant="outline" className="text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        {permission.badge}
                      </Badge>
                    </Button>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Theme Toggle */}
          <div className="p-4 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Dark Mode</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="rounded-full p-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
              >
                {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 space-y-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
            >
              <HelpCircle className="h-3 w-3 mr-2" />
              Help & Support
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={signOut}
              className="w-full justify-start text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-700 dark:hover:text-red-300 transition-all duration-200"
            >
              <LogOut className="h-3 w-3 mr-2" />
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
