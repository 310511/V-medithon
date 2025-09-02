import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Disc3, 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Volume2, 
  Heart,
  Clock,
  TrendingUp,
  Brain,
  Heart as HeartIcon,
  Activity,
  Moon,
  Sun,
  Zap,
  ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';
import { spotifyAPI, SpotifyTrack, SpotifyPlaylist } from '@/services/spotifyApi';

interface SpotifyIntegrationProps {
  className?: string;
}

interface Track {
  id: string;
  name: string;
  artist: string;
  album: string;
  duration: string;
  image: string;
  uri: string;
  mood: string;
}

interface Playlist {
  id: string;
  name: string;
  description: string;
  image: string;
  trackCount: number;
  mood: string;
}

export const SpotifyIntegration: React.FC<SpotifyIntegrationProps> = ({ className }) => {
  const [activeTab, setActiveTab] = useState('recommendations');
  const [currentMood, setCurrentMood] = useState('calm');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [volume, setVolume] = useState(50);
  const [recommendedTracks, setRecommendedTracks] = useState<Track[]>([]);
  const [moodPlaylists, setMoodPlaylists] = useState<Playlist[]>([]);
  const [recentTracks, setRecentTracks] = useState<Track[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize Spotify data
  useEffect(() => {
    const initializeSpotify = async () => {
      setIsLoading(true);
      
      try {
        // Check authentication status
        const authenticated = spotifyAPI.isAuthenticated();
        setIsAuthenticated(authenticated);
        
        // Initialize audio element
        const audio = new Audio();
        audio.volume = volume / 100;
        setAudioElement(audio);
        
        // Load initial data
        await loadMoodRecommendations(currentMood);
        await loadPlaylists();
        await loadRecentTracks();
        
      } catch (error) {
        console.error('Error initializing Spotify:', error);
        toast.error('Failed to load Spotify data. Using offline mode.');
      } finally {
        setIsLoading(false);
      }
    };

    initializeSpotify();
  }, []);

  // Load mood-based recommendations
  const loadMoodRecommendations = async (mood: string) => {
    try {
      const spotifyTracks = await spotifyAPI.searchTracksByMood(mood, 20);
      const tracks = spotifyTracks.map(track => spotifyAPI.convertSpotifyTrack(track));
      setRecommendedTracks(tracks);
      
      // Set first track as current if none is set
      if (!currentTrack && tracks.length > 0) {
        setCurrentTrack(tracks[0]);
      }
    } catch (error) {
      console.error('Error loading mood recommendations:', error);
    }
  };

  // Load playlists
  const loadPlaylists = async () => {
    try {
      const spotifyPlaylists = await spotifyAPI.getFeaturedPlaylists(20);
      const playlists = spotifyPlaylists.map(playlist => spotifyAPI.convertSpotifyPlaylist(playlist));
      setMoodPlaylists(playlists);
    } catch (error) {
      console.error('Error loading playlists:', error);
    }
  };

  // Load recent tracks
  const loadRecentTracks = async () => {
    try {
      const spotifyTracks = await spotifyAPI.getRecentlyPlayed(10);
      const tracks = spotifyTracks.map(track => spotifyAPI.convertSpotifyTrack(track));
      setRecentTracks(tracks);
    } catch (error) {
      console.error('Error loading recent tracks:', error);
    }
  };

  // Update volume when changed
  useEffect(() => {
    if (audioElement) {
      audioElement.volume = volume / 100;
    }
  }, [volume, audioElement]);

  // Cleanup audio element on unmount
  useEffect(() => {
    return () => {
      if (audioElement) {
        audioElement.pause();
        audioElement.src = '';
      }
    };
  }, [audioElement]);

  // Reload recommendations when mood changes
  useEffect(() => {
    if (currentMood) {
      loadMoodRecommendations(currentMood);
    }
  }, [currentMood]);

  const getMoodRecommendations = (mood: string) => {
    const moodTracks = {
      calm: recommendedTracks.filter(track => ['calm', 'relaxed', 'peaceful', 'sleep', 'meditation'].includes(track.mood)),
      focused: recommendedTracks.filter(track => ['focused', 'concentrated', 'calm', 'peaceful'].includes(track.mood)),
      energetic: recommendedTracks.filter(track => ['energetic', 'upbeat'].includes(track.mood)),
      sleep: recommendedTracks.filter(track => ['sleep', 'meditation', 'calm', 'peaceful', 'relaxed'].includes(track.mood)),
      melancholic: recommendedTracks.filter(track => ['melancholic', 'contemplative', 'peaceful'].includes(track.mood))
    };
    
    const filteredTracks = moodTracks[mood as keyof typeof moodTracks] || [];
    
    // Debug logging
    console.log(`Mood: ${mood}, Found ${filteredTracks.length} tracks:`, filteredTracks.map(t => t.name));
    
    // If no tracks found for the mood, return all tracks as fallback
    if (filteredTracks.length === 0) {
      console.log('No tracks found for mood, returning all tracks as fallback');
      return recommendedTracks;
    }
    
    return filteredTracks;
  };

  const playTrack = async (track: Track) => {
    if (audioElement) {
      try {
        // Stop current track if playing
        audioElement.pause();
        audioElement.currentTime = 0;
        
        // Set new track
        setCurrentTrack(track);
        
        // Use preview URL if available, otherwise use fallback
        const audioUrl = (track as any).previewUrl || track.uri;
        audioElement.src = audioUrl;
        
        // Play the track
        await audioElement.play();
        setIsPlaying(true);
        
        // Find track index for navigation
        const trackIndex = recommendedTracks.findIndex(t => t.id === track.id);
        setCurrentTrackIndex(trackIndex);
        
        // Show notification
        toast.success(`Now playing: ${track.name} by ${track.artist}`);
      } catch (error) {
        console.error('Error playing track:', error);
        // Fallback: just update UI without actual audio
        setCurrentTrack(track);
        setIsPlaying(true);
        toast.info(`Track loaded: ${track.name} (Preview not available)`);
      }
    }
  };

  const togglePlayPause = async () => {
    if (audioElement && currentTrack) {
      try {
        if (isPlaying) {
          audioElement.pause();
          setIsPlaying(false);
          toast.info('Music paused');
        } else {
          if (audioElement.src) {
            await audioElement.play();
            setIsPlaying(true);
            toast.success('Music resumed');
          } else {
            // If no source, play current track
            await playTrack(currentTrack);
          }
        }
      } catch (error) {
        console.error('Error toggling play/pause:', error);
        // Fallback: just toggle UI state
        setIsPlaying(!isPlaying);
      }
    }
  };

  const skipToNext = () => {
    const nextIndex = (currentTrackIndex + 1) % recommendedTracks.length;
    const nextTrack = recommendedTracks[nextIndex];
    if (nextTrack) {
      playTrack(nextTrack);
    }
  };

  const skipToPrevious = () => {
    const prevIndex = currentTrackIndex === 0 ? recommendedTracks.length - 1 : currentTrackIndex - 1;
    const prevTrack = recommendedTracks[prevIndex];
    if (prevTrack) {
      playTrack(prevTrack);
    }
  };

  const playPlaylist = (playlist: Playlist) => {
    // Find tracks that match the playlist mood
    const playlistTracks = recommendedTracks.filter(track => track.mood === playlist.mood);
    if (playlistTracks.length > 0) {
      playTrack(playlistTracks[0]);
    }
  };

  const getMoodIcon = (mood: string) => {
    switch (mood) {
      case 'calm': return <Heart className="h-4 w-4" />;
      case 'focused': return <Brain className="h-4 w-4" />;
      case 'energetic': return <Zap className="h-4 w-4" />;
      case 'sleep': return <Moon className="h-4 w-4" />;
      case 'melancholic': return <HeartIcon className="h-4 w-4" />;
      default: return <Disc3 className="h-4 w-4" />;
    }
  };

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'calm': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'focused': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'energetic': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'sleep': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'melancholic': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
          Music for Mental Health
        </h1>
        <p className="text-muted-foreground">AI-powered music recommendations based on your mood and wellbeing</p>
        
        {/* Demo Mode Notice */}
        <div className="mt-4">
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Disc3 className="h-4 w-4 text-blue-600" />
              <h4 className="font-medium text-blue-800 dark:text-blue-200">Demo Mode</h4>
            </div>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              This is a demo version with sample tracks. In production, this would connect to Spotify's real API for live music data and playback.
            </p>
            <div className="mt-3">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.open('https://developer.spotify.com/dashboard', '_blank')}
                className="text-blue-600 border-blue-300 hover:bg-blue-100 dark:text-blue-400 dark:border-blue-600 dark:hover:bg-blue-900/20"
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                Setup Spotify API
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Current Player */}
      {currentTrack && (
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <img 
                src={currentTrack.image} 
                alt={currentTrack.album}
                className="w-16 h-16 rounded-lg"
              />
              <div className="flex-1">
                <h3 className="font-semibold">{currentTrack.name}</h3>
                <p className="text-sm text-muted-foreground">{currentTrack.artist}</p>
                <p className="text-xs text-muted-foreground">{currentTrack.album}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={skipToPrevious}>
                  <SkipBack className="h-4 w-4" />
                </Button>
                <Button onClick={togglePlayPause} size="sm">
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                <Button variant="outline" size="sm" onClick={skipToNext}>
                  <SkipForward className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Volume2 className="h-4 w-4" />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={(e) => setVolume(parseInt(e.target.value))}
                  className="w-20"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Mood Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            How are you feeling today?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={currentMood} onValueChange={setCurrentMood}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="calm">😌 Calm & Relaxed</SelectItem>
              <SelectItem value="focused">🧠 Focused & Productive</SelectItem>
              <SelectItem value="energetic">⚡ Energetic & Motivated</SelectItem>
              <SelectItem value="sleep">😴 Sleep & Meditation</SelectItem>
              <SelectItem value="melancholic">💭 Melancholic & Contemplative</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="playlists">Mood Playlists</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
        </TabsList>

        <TabsContent value="recommendations" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              Recommendations for {currentMood === 'sleep' ? 'Sleep & Meditation' : 
                                  currentMood === 'calm' ? 'Calm & Relaxed' :
                                  currentMood === 'focused' ? 'Focused & Productive' :
                                  currentMood === 'energetic' ? 'Energetic & Motivated' :
                                  currentMood === 'melancholic' ? 'Melancholic & Contemplative' : currentMood}
            </h3>
            <div className="flex items-center gap-2">
              {isLoading && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
              )}
              <Badge variant="outline" className="text-sm">
                {getMoodRecommendations(currentMood).length} tracks
              </Badge>
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading recommendations from Spotify...</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {getMoodRecommendations(currentMood).map(track => (
              <Card key={track.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <img 
                      src={track.image} 
                      alt={track.album}
                      className="w-12 h-12 rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">{track.name}</h4>
                      <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className={getMoodColor(track.mood)}>
                          {getMoodIcon(track.mood)}
                          <span className="ml-1 capitalize">{track.mood}</span>
                        </Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {track.duration}
                        </span>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => playTrack(track)}
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="playlists" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {moodPlaylists.map(playlist => (
              <Card key={playlist.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <img 
                      src={playlist.image} 
                      alt={playlist.name}
                      className="w-16 h-16 rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold">{playlist.name}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{playlist.description}</p>
                      <div className="flex items-center gap-2 mt-3">
                        <Badge variant="outline" className={getMoodColor(playlist.mood)}>
                          {getMoodIcon(playlist.mood)}
                          <span className="ml-1 capitalize">{playlist.mood}</span>
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {playlist.trackCount} tracks
                        </span>
                      </div>
                    </div>
                    <Button size="sm" onClick={() => playPlaylist(playlist)}>
                      <Play className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recent" className="space-y-4">
          <div className="space-y-3">
            {recentTracks.map(track => (
              <Card key={track.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    <img 
                      src={track.image} 
                      alt={track.album}
                      className="w-10 h-10 rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">{track.name}</h4>
                      <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={getMoodColor(track.mood)}>
                        {getMoodIcon(track.mood)}
                      </Badge>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => playTrack(track)}
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Wellness Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Music & Mental Health Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20">
              <h4 className="font-medium text-blue-800 dark:text-blue-200">For Stress Relief</h4>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                Listen to slow, instrumental music with 60-80 BPM to reduce cortisol levels and promote relaxation.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/20">
              <h4 className="font-medium text-green-800 dark:text-green-200">For Focus</h4>
              <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                Classical music or nature sounds can improve concentration and cognitive performance.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-950/20">
              <h4 className="font-medium text-purple-800 dark:text-purple-200">For Sleep</h4>
              <p className="text-sm text-purple-700 dark:text-purple-300 mt-1">
                White noise or gentle ambient music can help you fall asleep faster and improve sleep quality.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950/20">
              <h4 className="font-medium text-yellow-800 dark:text-yellow-200">For Energy</h4>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                Upbeat music with 120-140 BPM can boost mood and increase energy levels naturally.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
