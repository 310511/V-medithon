import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Play, 
  Clock, 
  Heart, 
  Brain, 
  Activity, 
  BookOpen, 
  Search, 
  Filter, 
  Star, 
  Users, 
  Eye, 
  Share2, 
  Bookmark, 
  MessageSquare,
  TrendingUp,
  Award,
  Target,
  Zap,
  Sparkles,
  Video,
  Headphones,
  FileText,
  Calendar,
  Clock3,
  CheckCircle,
  ArrowRight,
  ChevronRight,
  ChevronDown,
  Plus,
  Minus
} from 'lucide-react';

interface VideoContent {
  id: string;
  title: string;
  description: string;
  duration: string;
  category: string;
  thumbnail: string;
  views: number;
  rating: number;
  tags: string[];
  featured: boolean;
}

const EchoMedHealthHub = () => {
  const [activeTab, setActiveTab] = useState('featured');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedVideo, setSelectedVideo] = useState<VideoContent | null>(null);

  const categories = [
    { id: 'all', name: 'All', icon: Video, color: 'bg-blue-500' },
    { id: 'nutrition', name: 'Nutrition', icon: Heart, color: 'bg-red-500' },
    { id: 'fitness', name: 'Fitness', icon: Activity, color: 'bg-green-500' },
    { id: 'mental-health', name: 'Mental Health', icon: Brain, color: 'bg-purple-500' },
    { id: 'wellness', name: 'Wellness', icon: Sparkles, color: 'bg-yellow-500' },
    { id: 'medical', name: 'Medical', icon: BookOpen, color: 'bg-indigo-500' }
  ];

  const videos: VideoContent[] = [
    {
      id: '1',
      title: 'Understanding Your Vital Signs',
      description: 'Learn about blood pressure, heart rate, temperature, and respiratory rate.',
      duration: '8:45',
      category: 'medical',
      thumbnail: '/api/placeholder/300/200',
      views: 15420,
      rating: 4.8,
      tags: ['vital signs', 'health monitoring', 'basics'],
      featured: true
    },
    {
      id: '2',
      title: 'Mindful Eating: A Complete Guide',
      description: 'Discover how to develop a healthy relationship with food through mindful eating practices.',
      duration: '12:30',
      category: 'nutrition',
      thumbnail: '/api/placeholder/300/200',
      views: 8920,
      rating: 4.9,
      tags: ['mindful eating', 'nutrition', 'wellness'],
      featured: true
    },
    {
      id: '3',
      title: 'Home Workout: Full Body Circuit',
      description: 'Complete 30-minute full body workout you can do anywhere with no equipment needed.',
      duration: '32:15',
      category: 'fitness',
      thumbnail: '/api/placeholder/300/200',
      views: 23450,
      rating: 4.7,
      tags: ['workout', 'fitness', 'home exercise'],
      featured: false
    },
    {
      id: '4',
      title: 'Stress Management Techniques',
      description: 'Effective techniques to manage stress and improve your mental well-being.',
      duration: '15:20',
      category: 'mental-health',
      thumbnail: '/api/placeholder/300/200',
      views: 18760,
      rating: 4.8,
      tags: ['stress', 'mental health', 'wellness'],
      featured: true
    },
    {
      id: '5',
      title: 'Sleep Hygiene: Better Sleep Tonight',
      description: 'Simple changes to improve your sleep quality and wake up feeling refreshed.',
      duration: '10:45',
      category: 'wellness',
      thumbnail: '/api/placeholder/300/200',
      views: 12340,
      rating: 4.6,
      tags: ['sleep', 'wellness', 'health'],
      featured: false
    },
    {
      id: '6',
      title: 'First Aid Essentials Everyone Should Know',
      description: 'Basic first aid procedures for common injuries and emergencies.',
      duration: '18:30',
      category: 'medical',
      thumbnail: '/api/placeholder/300/200',
      views: 29870,
      rating: 4.9,
      tags: ['first aid', 'emergency', 'safety'],
      featured: true
    }
  ];

  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         video.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         video.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || video.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredVideos = videos.filter(video => video.featured);
  const recentVideos = videos.slice(0, 6);
  const popularVideos = [...videos].sort((a, b) => b.views - a.views).slice(0, 6);

  const formatViews = (views: number) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  };

  const VideoCard = ({ video, variant = 'default' }: { video: VideoContent; variant?: 'default' | 'featured' | 'compact' }) => {
    const category = categories.find(cat => cat.id === video.category);
    
    return (
      <Card 
        className={`cursor-pointer transition-all hover:shadow-lg group ${
          variant === 'featured' ? 'ring-2 ring-blue-500' : ''
        }`}
        onClick={() => setSelectedVideo(video)}
      >
        <div className="relative">
          <div className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-t-lg flex items-center justify-center">
            <div className="text-center">
              <Play className="w-12 h-12 text-gray-400 group-hover:text-blue-500 transition-colors" />
              <p className="text-sm text-gray-500 mt-2">Video Preview</p>
            </div>
          </div>
          <div className="absolute top-2 right-2">
            <Badge variant="secondary" className="bg-black/70 text-white">
              <Clock className="w-3 h-3 mr-1" />
              {video.duration}
            </Badge>
          </div>
          {video.featured && (
            <div className="absolute top-2 left-2">
              <Badge className="bg-blue-500 text-white">
                <Star className="w-3 h-3 mr-1" />
                Featured
              </Badge>
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-blue-600 transition-colors">
                {video.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                {video.description}
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {formatViews(video.views)}
              </span>
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500" />
                {video.rating}
              </span>
            </div>
            {category && (
              <Badge variant="outline" className="text-xs">
                <category.icon className="w-3 h-3 mr-1" />
                {category.name}
              </Badge>
            )}
          </div>
          
          <div className="flex flex-wrap gap-1 mt-3">
            {video.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
            <Video className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Health Hub
            </h2>
            <p className="text-gray-600 dark:text-gray-400">Educational health content and resources</p>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search health topics, videos, or resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create Playlist
          </Button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category.id)}
            className="flex items-center gap-2"
          >
            <category.icon className="w-4 h-4" />
            {category.name}
          </Button>
        ))}
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="featured" className="flex items-center gap-2">
            <Star className="w-4 h-4" />
            Featured
          </TabsTrigger>
          <TabsTrigger value="recent" className="flex items-center gap-2">
            <Clock3 className="w-4 h-4" />
            Recent
          </TabsTrigger>
          <TabsTrigger value="popular" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Popular
          </TabsTrigger>
          <TabsTrigger value="all" className="flex items-center gap-2">
            <Video className="w-4 h-4" />
            All Videos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="featured" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredVideos.map((video) => (
              <VideoCard key={video.id} video={video} variant="featured" />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recent" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentVideos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="popular" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularVideos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="all" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Video Player Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h3 className="text-lg font-semibold">{selectedVideo.title}</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedVideo(null)}
              >
                ×
              </Button>
            </div>
            <div className="p-4">
              <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mb-4">
                <div className="text-center">
                  <Play className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Video Player</p>
                  <p className="text-sm text-gray-400 mt-2">{selectedVideo.title}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {formatViews(selectedVideo.views)} views
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      {selectedVideo.rating} rating
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {selectedVideo.duration}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Bookmark className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300">{selectedVideo.description}</p>
                <div className="flex flex-wrap gap-2">
                  {selectedVideo.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export { EchoMedHealthHub };
