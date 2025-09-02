# 🌐 DoseWise Healthcare AI - Domain Setup Guide

## Current Status
- **Vercel URL**: `v-medithon.vercel.app` (working)
- **Backend APIs**: All deployed on Render
- **Status**: Ready for custom domain

## Recommended Domains

### Health Tech Domains
- `dosewise.health` - Perfect for healthcare
- `dosewise-ai.com` - AI-focused
- `medithon.health` - Medical marathon theme
- `healthai.tech` - Health + AI + Tech

### Domain Registrars
1. **Namecheap** - Best prices, good support
2. **Google Domains** - Simple setup
3. **GoDaddy** - Popular choice
4. **Cloudflare** - Free privacy protection

## DNS Configuration

### For Any Domain (.com, .health, .ai, etc.)
```
Type: A
Name: @
Value: 76.76.19.61

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

## Vercel Domain Setup Steps

1. **Go to Vercel Dashboard**
2. **Select your project**
3. **Settings → Domains**
4. **Add Domain**
5. **Enter your domain**
6. **Follow DNS instructions**
7. **Wait for propagation (5-30 minutes)**

## Environment Variables (Already Set)
```
VITE_MEAL_INSULIN_API_URL=https://dosewise-backend.onrender.com
VITE_INFINITE_MEMORY_API_URL=https://dosewise-infinite-memory.onrender.com
VITE_FLASK_API_URL=https://dosewise-flask.onrender.com
VITE_SPOTIFY_CLIENT_ID=your_spotify_client_id
```

## SSL Certificate
- **Automatic**: Vercel provides free SSL
- **Status**: HTTPS enabled by default
- **Renewal**: Automatic

## Performance Optimization
- **CDN**: Global edge network
- **Caching**: Automatic static asset caching
- **Compression**: Gzip/Brotli enabled
- **Mobile**: Optimized for mobile devices

## Monitoring
- **Uptime**: 99.9% SLA
- **Analytics**: Built-in Vercel Analytics
- **Logs**: Real-time deployment logs
- **Alerts**: Email notifications for issues

## Next Steps
1. Choose and purchase domain
2. Add domain to Vercel
3. Configure DNS records
4. Wait for propagation
5. Test your custom domain
6. Update any hardcoded URLs

## Support
- **Vercel Docs**: https://vercel.com/docs
- **DNS Help**: Contact your domain registrar
- **Issues**: Check Vercel dashboard logs
