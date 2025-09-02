// Spotify Web API integration
const SPOTIFY_CLIENT_ID = '13df0934fc61463789326b9bacea2110';
const SPOTIFY_REDIRECT_URI = window.location.origin + '/spotify-callback';

// Spotify API endpoints
const SPOTIFY_API_BASE = 'https://api.spotify.com/v1';
const SPOTIFY_AUTH_URL = 'https://accounts.spotify.com/authorize';

// Scopes needed for the application
const SPOTIFY_SCOPES = [
  'user-read-playback-state',
  'user-modify-playback-state',
  'user-read-currently-playing',
  'playlist-read-private',
  'playlist-read-collaborative',
  'user-library-read',
  'user-top-read',
  'user-read-recently-played'
].join(' ');

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: Array<{
    id: string;
    name: string;
  }>;
  album: {
    id: string;
    name: string;
    images: Array<{
      url: string;
      height: number;
      width: number;
    }>;
  };
  duration_ms: number;
  external_urls: {
    spotify: string;
  };
  preview_url: string | null;
  uri: string;
}

export interface SpotifyPlaylist {
  id: string;
  name: string;
  description: string;
  images: Array<{
    url: string;
    height: number;
    width: number;
  }>;
  tracks: {
    total: number;
  };
  external_urls: {
    spotify: string;
  };
  uri: string;
}

class SpotifyAPI {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  constructor() {
    // Try to get stored tokens
    this.accessToken = localStorage.getItem('spotify_access_token');
    this.refreshToken = localStorage.getItem('spotify_refresh_token');
  }

  // Get authorization URL
  getAuthUrl(): string {
    const params = new URLSearchParams({
      client_id: SPOTIFY_CLIENT_ID,
      response_type: 'code',
      redirect_uri: SPOTIFY_REDIRECT_URI,
      scope: SPOTIFY_SCOPES,
      show_dialog: 'true'
    });

    return `${SPOTIFY_AUTH_URL}?${params.toString()}`;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  // Get access token (this would normally be done server-side for security)
  async getAccessToken(): Promise<string | null> {
    if (this.accessToken) {
      return this.accessToken;
    }

    // For demo purposes, we'll use a mock token
    // In production, this should be handled server-side
    console.warn('Spotify API: Using mock token for demo. In production, implement proper OAuth flow.');
    return 'mock_token_for_demo';
  }

  // Check if Spotify API is properly configured
  isApiConfigured(): boolean {
    // For now, we'll assume the API key might not be properly configured
    // In a real app, you'd check if the client ID is valid
    return false; // Force fallback mode for demo
  }

  // Search for tracks by mood/genre
  async searchTracksByMood(mood: string, limit: number = 20): Promise<SpotifyTrack[]> {
    // For demo purposes, always use mock data
    // In production, you'd implement the real Spotify API calls here
    console.log(`Searching for ${mood} tracks (using mock data for demo)`);
    return this.getMockTracksForMood(mood);
    
    /* Real Spotify API implementation (commented out for demo):
    try {
      const token = await this.getAccessToken();
      if (!token) {
        throw new Error('No access token available');
      }

      // Map moods to Spotify search queries
      const moodQueries = {
        calm: 'ambient relaxation peaceful',
        focused: 'instrumental classical focus concentration',
        energetic: 'upbeat energetic motivational',
        sleep: 'sleep meditation ambient nature sounds',
        melancholic: 'sad emotional contemplative'
      };

      const query = moodQueries[mood as keyof typeof moodQueries] || mood;
      
      const response = await fetch(
        `${SPOTIFY_API_BASE}/search?q=${encodeURIComponent(query)}&type=track&limit=${limit}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Spotify API error: ${response.status}`);
      }

      const data = await response.json();
      return data.tracks.items || [];
    } catch (error) {
      console.error('Error searching Spotify tracks:', error);
      // Return mock data as fallback
      return this.getMockTracksForMood(mood);
    }
    */
  }

  // Get featured playlists
  async getFeaturedPlaylists(limit: number = 20): Promise<SpotifyPlaylist[]> {
    // For demo purposes, always use mock data
    console.log(`Fetching featured playlists (using mock data for demo)`);
    return this.getMockPlaylists();
  }

  // Get user's recently played tracks
  async getRecentlyPlayed(limit: number = 20): Promise<SpotifyTrack[]> {
    // For demo purposes, always use mock data
    console.log(`Fetching recently played tracks (using mock data for demo)`);
    return this.getMockTracksForMood('calm').slice(0, 5);
  }

  // Mock data fallback
  private getMockTracksForMood(mood: string): SpotifyTrack[] {
    const mockTracks: Record<string, SpotifyTrack[]> = {
      calm: [
        {
          id: '1',
          name: 'Weightless',
          artists: [{ id: '1', name: 'Marconi Union' }],
          album: {
            id: '1',
            name: 'Different Colours',
            images: [{ url: 'https://via.placeholder.com/300/3B82F6/FFFFFF?text=Weightless', height: 300, width: 300 }]
          },
          duration_ms: 490000,
          external_urls: { spotify: 'https://open.spotify.com/track/1' },
          preview_url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
          uri: 'spotify:track:1'
        },
        {
          id: '2',
          name: 'Claire de Lune',
          artists: [{ id: '2', name: 'Debussy' }],
          album: {
            id: '2',
            name: 'Suite Bergamasque',
            images: [{ url: 'https://via.placeholder.com/300/8B5CF6/FFFFFF?text=Claire+de+Lune', height: 300, width: 300 }]
          },
          duration_ms: 332000,
          external_urls: { spotify: 'https://open.spotify.com/track/2' },
          preview_url: null,
          uri: 'spotify:track:2'
        }
      ],
      sleep: [
        {
          id: '6',
          name: 'Deep Sleep',
          artists: [{ id: '6', name: 'Nature Sounds' }],
          album: {
            id: '6',
            name: 'Sleep Therapy',
            images: [{ url: 'https://via.placeholder.com/300/8B5CF6/FFFFFF?text=Deep+Sleep', height: 300, width: 300 }]
          },
          duration_ms: 600000,
          external_urls: { spotify: 'https://open.spotify.com/track/6' },
          preview_url: null,
          uri: 'spotify:track:6'
        },
        {
          id: '7',
          name: 'Meditation Flow',
          artists: [{ id: '7', name: 'Zen Master' }],
          album: {
            id: '7',
            name: 'Mindful Moments',
            images: [{ url: 'https://via.placeholder.com/300/6B7280/FFFFFF?text=Meditation', height: 300, width: 300 }]
          },
          duration_ms: 930000,
          external_urls: { spotify: 'https://open.spotify.com/track/7' },
          preview_url: null,
          uri: 'spotify:track:7'
        }
      ],
      focused: [
        {
          id: '8',
          name: 'Focus Mode',
          artists: [{ id: '8', name: 'Productivity Sounds' }],
          album: {
            id: '8',
            name: 'Concentration',
            images: [{ url: 'https://via.placeholder.com/300/10B981/FFFFFF?text=Focus', height: 300, width: 300 }]
          },
          duration_ms: 1500000,
          external_urls: { spotify: 'https://open.spotify.com/track/8' },
          preview_url: null,
          uri: 'spotify:track:8'
        }
      ],
      energetic: [
        {
          id: '9',
          name: 'Energy Boost',
          artists: [{ id: '9', name: 'Motivational Music' }],
          album: {
            id: '9',
            name: 'High Energy',
            images: [{ url: 'https://via.placeholder.com/300/F59E0B/FFFFFF?text=Energy', height: 300, width: 300 }]
          },
          duration_ms: 225000,
          external_urls: { spotify: 'https://open.spotify.com/track/9' },
          preview_url: null,
          uri: 'spotify:track:9'
        }
      ],
      melancholic: [
        {
          id: '5',
          name: 'The Scientist',
          artists: [{ id: '5', name: 'Coldplay' }],
          album: {
            id: '5',
            name: 'A Rush of Blood to the Head',
            images: [{ url: 'https://via.placeholder.com/300/EF4444/FFFFFF?text=The+Scientist', height: 300, width: 300 }]
          },
          duration_ms: 309000,
          external_urls: { spotify: 'https://open.spotify.com/track/5' },
          preview_url: null,
          uri: 'spotify:track:5'
        }
      ]
    };

    return mockTracks[mood] || mockTracks.calm;
  }

  private getMockPlaylists(): SpotifyPlaylist[] {
    return [
      {
        id: '1',
        name: 'Calm & Peaceful',
        description: 'Soothing melodies for relaxation and stress relief',
        images: [{ url: 'https://via.placeholder.com/300/3B82F6/FFFFFF?text=Calm', height: 300, width: 300 }],
        tracks: { total: 45 },
        external_urls: { spotify: 'https://open.spotify.com/playlist/1' },
        uri: 'spotify:playlist:1'
      },
      {
        id: '2',
        name: 'Focus & Concentration',
        description: 'Instrumental tracks to enhance productivity',
        images: [{ url: 'https://via.placeholder.com/300/10B981/FFFFFF?text=Focus', height: 300, width: 300 }],
        tracks: { total: 32 },
        external_urls: { spotify: 'https://open.spotify.com/playlist/2' },
        uri: 'spotify:playlist:2'
      },
      {
        id: '3',
        name: 'Energy Boost',
        description: 'Upbeat tracks to lift your mood and energy',
        images: [{ url: 'https://via.placeholder.com/300/F59E0B/FFFFFF?text=Energy', height: 300, width: 300 }],
        tracks: { total: 28 },
        external_urls: { spotify: 'https://open.spotify.com/playlist/3' },
        uri: 'spotify:playlist:3'
      },
      {
        id: '4',
        name: 'Sleep & Meditation',
        description: 'Gentle sounds for better sleep and mindfulness',
        images: [{ url: 'https://via.placeholder.com/300/8B5CF6/FFFFFF?text=Sleep', height: 300, width: 300 }],
        tracks: { total: 52 },
        external_urls: { spotify: 'https://open.spotify.com/playlist/4' },
        uri: 'spotify:playlist:4'
      }
    ];
  }

  // Convert Spotify track to our internal format
  convertSpotifyTrack(spotifyTrack: SpotifyTrack) {
    return {
      id: spotifyTrack.id,
      name: spotifyTrack.name,
      artist: spotifyTrack.artists.map(a => a.name).join(', '),
      album: spotifyTrack.album.name,
      duration: this.formatDuration(spotifyTrack.duration_ms),
      image: spotifyTrack.album.images[0]?.url || 'https://via.placeholder.com/150',
      uri: spotifyTrack.uri,
      previewUrl: spotifyTrack.preview_url,
      externalUrl: spotifyTrack.external_urls.spotify,
      mood: this.detectMoodFromTrack(spotifyTrack)
    };
  }

  // Convert Spotify playlist to our internal format
  convertSpotifyPlaylist(spotifyPlaylist: SpotifyPlaylist) {
    return {
      id: spotifyPlaylist.id,
      name: spotifyPlaylist.name,
      description: spotifyPlaylist.description,
      image: spotifyPlaylist.images[0]?.url || 'https://via.placeholder.com/150',
      trackCount: spotifyPlaylist.tracks.total,
      externalUrl: spotifyPlaylist.external_urls.spotify,
      uri: spotifyPlaylist.uri,
      mood: this.detectMoodFromPlaylist(spotifyPlaylist)
    };
  }

  private formatDuration(ms: number): string {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  private detectMoodFromTrack(track: SpotifyTrack): string {
    const name = track.name.toLowerCase();
    const artist = track.artists.map(a => a.name.toLowerCase()).join(' ');
    const album = track.album.name.toLowerCase();

    if (name.includes('sleep') || name.includes('meditation') || name.includes('zen')) {
      return 'sleep';
    }
    if (name.includes('focus') || name.includes('concentration') || name.includes('study')) {
      return 'focused';
    }
    if (name.includes('energy') || name.includes('boost') || name.includes('motivation')) {
      return 'energetic';
    }
    if (name.includes('sad') || name.includes('melancholic') || name.includes('emotional')) {
      return 'melancholic';
    }
    return 'calm';
  }

  private detectMoodFromPlaylist(playlist: SpotifyPlaylist): string {
    const name = playlist.name.toLowerCase();
    const description = playlist.description.toLowerCase();

    if (name.includes('sleep') || name.includes('meditation')) {
      return 'sleep';
    }
    if (name.includes('focus') || name.includes('concentration')) {
      return 'focused';
    }
    if (name.includes('energy') || name.includes('boost')) {
      return 'energetic';
    }
    if (name.includes('sad') || name.includes('melancholic')) {
      return 'melancholic';
    }
    return 'calm';
  }
}

export const spotifyAPI = new SpotifyAPI();
