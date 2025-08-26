import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  CheckCircle, 
  AlertCircle, 
  Info, 
  X, 
  Clock, 
  Package, 
  TrendingUp, 
  Brain,
  Pill,
  Bell,
  Settings,
  Trash2,
  Filter,
  Search,
  Star,
  ExternalLink,
  MessageSquare,
  Zap
} from "lucide-react";
import { useBlockchain } from "@/contexts/BlockchainContext";
import "./notification-panel.css";

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: "success" | "error" | "info" | "warning";
  category: "inventory" | "marketplace" | "ml" | "ai" | "system";
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  priority: "low" | "medium" | "high";
  starred?: boolean;
}

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
  onToggleStar?: (id: string) => void;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onDelete,
  onMarkAllAsRead,
  onClearAll,
  onToggleStar,
}) => {
  const [filter, setFilter] = useState<"all" | "unread" | "high" | "starred">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredNotifications = notifications.filter((notification) => {
    const matchesFilter = filter === "all" || 
      (filter === "unread" && !notification.read) ||
      (filter === "high" && notification.priority === "high") ||
      (filter === "starred" && notification.starred);
    
    const matchesCategory = categoryFilter === "all" || 
      notification.category === categoryFilter;
    
    const matchesSearch = searchQuery === "" || 
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesCategory && matchesSearch;
  });

  const unreadCount = notifications.filter(n => !n.read).length;
  const highPriorityCount = notifications.filter(n => n.priority === "high").length;
  const starredCount = notifications.filter(n => n.starred).length;

  const getNotificationIcon = (category: string) => {
    switch (category) {
      case "inventory":
        return <Package className="h-4 w-4" />;
      case "marketplace":
        return <TrendingUp className="h-4 w-4" />;
      case "ml":
        return <Brain className="h-4 w-4" />;
      case "ai":
        return <Pill className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "success":
        return "border-green-200 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-green-950/20 dark:via-emerald-950/20 dark:to-teal-950/20";
      case "error":
        return "border-red-200 bg-gradient-to-br from-red-50 via-pink-50 to-rose-50 dark:from-red-950/20 dark:via-pink-950/20 dark:to-rose-950/20";
      case "warning":
        return "border-yellow-200 bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-50 dark:from-yellow-950/20 dark:via-orange-950/20 dark:to-amber-950/20";
      default:
        return "border-blue-200 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/20 dark:via-indigo-950/20 dark:to-purple-950/20";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-gradient-to-r from-red-500 to-pink-500";
      case "medium":
        return "bg-gradient-to-r from-yellow-500 to-orange-500";
      default:
        return "bg-gradient-to-r from-green-500 to-emerald-500";
    }
  };

  const getNotificationIconBg = (type: string) => {
    switch (type) {
      case "success":
        return "bg-gradient-to-br from-green-100 to-emerald-100 text-green-600 dark:from-green-900/30 dark:to-emerald-900/30 dark:text-green-400";
      case "error":
        return "bg-gradient-to-br from-red-100 to-pink-100 text-red-600 dark:from-red-900/30 dark:to-pink-900/30 dark:text-red-400";
      case "warning":
        return "bg-gradient-to-br from-yellow-100 to-orange-100 text-yellow-600 dark:from-yellow-900/30 dark:to-orange-900/30 dark:text-yellow-400";
      default:
        return "bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600 dark:from-blue-900/30 dark:to-indigo-900/30 dark:text-blue-400";
    }
  };

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case "inventory":
        return "bg-gradient-to-r from-purple-50 to-violet-50 text-purple-700 border-purple-200 dark:from-purple-950/30 dark:to-violet-950/30 dark:text-purple-300";
      case "marketplace":
        return "bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 border-blue-200 dark:from-blue-950/30 dark:to-cyan-950/30 dark:text-blue-300";
      case "ml":
        return "bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border-green-200 dark:from-green-950/30 dark:to-emerald-950/30 dark:text-green-300";
      case "ai":
        return "bg-gradient-to-r from-pink-50 to-rose-50 text-pink-700 border-pink-200 dark:from-pink-950/30 dark:to-rose-950/30 dark:text-pink-300";
      case "system":
        return "bg-gradient-to-r from-gray-50 to-slate-50 text-gray-700 border-gray-200 dark:from-gray-950/30 dark:to-slate-950/30 dark:text-gray-300";
      default:
        return "bg-gradient-to-r from-gray-50 to-slate-50 text-gray-700 border-gray-200 dark:from-gray-950/30 dark:to-slate-950/30 dark:text-gray-300";
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end pt-16">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <Card className="notification-panel w-[480px] max-h-[calc(100vh-6rem)] shadow-2xl border-0 mr-6 mt-2 glass-effect flex flex-col">
        <CardHeader className="pb-4 border-b bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/20 dark:via-indigo-950/20 dark:to-purple-950/20 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl">
                <Bell className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Notifications
                </CardTitle>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Stay updated with real-time alerts</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Badge variant="destructive" className="text-xs font-semibold px-3 py-1 animate-pulse">
                  {unreadCount}
                </Badge>
              )}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onClose}
                className="hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full p-2 transition-all duration-200"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
            />
          </div>
          
          {/* Filter Controls */}
          <div className="flex flex-wrap gap-2 mt-4">
            {[
              { key: "all", label: "All", count: notifications.length },
              { key: "unread", label: "Unread", count: unreadCount },
              { key: "high", label: "High Priority", count: highPriorityCount },
              { key: "starred", label: "Starred", count: starredCount }
            ].map((filterOption) => (
              <Button
                key={filterOption.key}
                variant={filter === filterOption.key ? "default" : "outline"}
                size="sm"
                className={`rounded-full px-4 py-2 text-xs font-medium transition-all duration-200 ${
                  filter === filterOption.key 
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg" 
                    : "hover:bg-gray-50 dark:hover:bg-gray-800 border-gray-200 dark:border-gray-700"
                }`}
                onClick={() => setFilter(filterOption.key as any)}
              >
                {filterOption.label}
                {filterOption.count > 0 && (
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {filterOption.count}
                  </Badge>
                )}
              </Button>
            ))}
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-1 mt-3">
            {["all", "inventory", "marketplace", "ml", "ai", "system"].map((category) => (
              <Button
                key={category}
                variant={categoryFilter === category ? "default" : "outline"}
                size="sm"
                className={`text-xs rounded-full px-3 py-1 font-medium transition-all duration-200 ${
                  categoryFilter === category 
                    ? "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 border-blue-200 dark:from-blue-900/30 dark:to-indigo-900/30 dark:text-blue-300" 
                    : "hover:bg-gray-50 dark:hover:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400"
                }`}
                onClick={() => setCategoryFilter(category)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onMarkAllAsRead}
              className="rounded-full px-4 py-2 text-xs font-medium hover:bg-green-50 hover:border-green-200 hover:text-green-700 dark:hover:bg-green-950/20 transition-all duration-200"
            >
              <CheckCircle className="h-3 w-3 mr-1" />
              Mark All Read
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onClearAll}
              className="rounded-full px-4 py-2 text-xs font-medium hover:bg-red-50 hover:border-red-200 hover:text-red-700 dark:hover:bg-red-950/20 transition-all duration-200"
            >
              <Trash2 className="h-3 w-3 mr-1" />
              Clear All
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0 flex-1 min-h-0">
          <ScrollArea className="h-full">
            {filteredNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                <div className="p-6 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-full mb-6">
                  <Bell className="h-12 w-12" />
                </div>
                <p className="text-lg font-medium text-gray-500 dark:text-gray-400">No notifications</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">You're all caught up!</p>
                <div className="mt-4 flex gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            ) : (
              <div className="space-y-3 p-4">
                {filteredNotifications.map((notification, index) => (
                  <Card
                    key={notification.id}
                    className={`notification-item hover-lift ${getNotificationColor(notification.type)} ${
                      !notification.read ? "ring-2 ring-blue-200 dark:ring-blue-800 shadow-lg" : "shadow-sm"
                    } transition-all duration-300 hover:shadow-xl hover:scale-[1.02] cursor-pointer group border-0 overflow-hidden relative`}
                    onClick={() => onMarkAsRead(notification.id)}
                    style={{
                      animationDelay: `${index * 50}ms`
                    }}
                  >
                    {notification.starred && (
                      <div className="absolute top-2 right-2 z-10">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      </div>
                    )}
                    
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 mt-1">
                          <div className={`p-3 rounded-xl ${getNotificationIconBg(notification.type)} shadow-sm`}>
                            {getNotificationIcon(notification.category)}
                          </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                                  {notification.title}
                                </h4>
                                <div className={`w-2 h-2 rounded-full ${getPriorityColor(notification.priority)} animate-pulse shadow-sm`} />
                              </div>
                              <p className="text-gray-600 dark:text-gray-300 mb-3 leading-relaxed text-sm line-clamp-2">
                                {notification.message}
                              </p>
                              <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 flex-wrap">
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {formatTimestamp(notification.timestamp)}
                                </div>
                                <Badge 
                                  variant="outline" 
                                  className={`text-xs px-2 py-1 rounded-full ${getCategoryBadgeColor(notification.category)}`}
                                >
                                  {notification.category}
                                </Badge>
                                {notification.actionUrl && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 px-2 text-xs hover:bg-blue-50 dark:hover:bg-blue-950/20 hover:text-blue-600 dark:hover:text-blue-400"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      window.open(notification.actionUrl, '_blank');
                                    }}
                                  >
                                    <ExternalLink className="h-3 w-3 mr-1" />
                                    View
                                  </Button>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200 flex-shrink-0">
                              {onToggleStar && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 hover:bg-yellow-100 dark:hover:bg-yellow-950/20 hover:text-yellow-600 dark:hover:text-yellow-400 rounded-full"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onToggleStar(notification.id);
                                  }}
                                >
                                  <Star className={`h-4 w-4 ${notification.starred ? 'text-yellow-500 fill-current' : ''}`} />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 hover:bg-red-100 dark:hover:bg-red-950/20 hover:text-red-600 dark:hover:text-red-400 rounded-full"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDelete(notification.id);
                                }}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};
