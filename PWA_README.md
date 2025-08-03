# PWA (Progressive Web App) Setup

AutomataVerse is now configured as a Progressive Web App (PWA), allowing users to install it on their devices for a native app-like experience.

## Features Implemented

### ✅ **Core PWA Features**
- **Web App Manifest**: Properly configured with app metadata, icons, and display settings
- **Service Worker**: Automated caching and offline functionality using Workbox
- **Installability**: Users can install the app on their devices
- **Offline Support**: Basic offline functionality for cached resources

### ✅ **Enhanced Mobile Experience**
- Optimized viewport settings
- Touch-friendly interface
- Status bar styling for iOS
- Windows tile configuration
- Apple touch icons

## Files Added/Modified

### New Files
- `public/browserconfig.xml` - Windows tile configuration
- `src/components/PWAInstallPrompt.tsx` - Install prompt component
- `PWA_README.md` - This documentation file

### Modified Files
- `package.json` - Added `next-pwa` dependency
- `public/manifest.json` - Enhanced with additional PWA fields
- `src/app/layout.tsx` - Added manifest link and PWA meta tags
- `next.config.mjs` - Already configured with next-pwa

## How to Use the PWA Install Prompt

1. **Import the component** in your main layout or page:
```tsx
import PWAInstallPrompt from '@/components/PWAInstallPrompt';

// Add it to your component
<PWAInstallPrompt />
```

2. **The prompt will automatically show** when:
   - The user visits on a supported browser
   - The app meets PWA installability criteria
   - The browser fires the `beforeinstallprompt` event

## Testing PWA Features

### Development
```bash
npm run dev
```
PWA features are disabled in development mode for faster builds.

### Production
```bash
npm run build
npm start
```

### Testing Installation
1. Open the app in Chrome/Edge
2. Look for the install button in the address bar
3. Or use the custom install prompt component
4. The app can be installed on:
   - Desktop (Chrome, Edge, Safari)
   - Android (Chrome, Samsung Internet)
   - iOS (Safari - Add to Home Screen)

## PWA Checklist

- ✅ Web App Manifest configured
- ✅ Service Worker registered
- ✅ HTTPS served (required for production)
- ✅ Icons (192x192, 512x512)
- ✅ Responsive design
- ✅ Fast loading performance

## Browser Support

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| Install | ✅ | ⚠️ | ⚠️ | ✅ |
| Service Worker | ✅ | ✅ | ✅ | ✅ |
| Offline | ✅ | ✅ | ✅ | ✅ |
| Manifest | ✅ | ✅ | ⚠️ | ✅ |

⚠️ = Limited support or requires "Add to Home Screen"

## Deployment Notes

1. **HTTPS Required**: PWAs require HTTPS in production
2. **Service Worker Scope**: Service worker operates from the root domain
3. **Cache Strategy**: Uses Workbox for intelligent caching
4. **Updates**: Service worker updates automatically on new deployments

## Customization

### Icons
Replace icons in `public/logo/png/` with your own:
- `3.png` (192x192) - Standard icon
- `6.png` (512x512) - High-res icon

### Colors
Update theme colors in:
- `public/manifest.json` - `theme_color`, `background_color`
- `src/app/layout.tsx` - Meta theme-color

### Install Prompt
Customize the install prompt component in `src/components/PWAInstallPrompt.tsx`

## Troubleshooting

### PWA Not Installing
1. Check browser console for manifest errors
2. Verify all required icons exist
3. Ensure HTTPS in production
4. Test the lighthouse PWA audit

### Service Worker Issues
1. Clear browser cache and hard reload
2. Check Network tab for SW registration
3. Verify service worker in DevTools > Application

### Cache Problems
1. Update service worker to force cache refresh
2. Use "Update on reload" in DevTools > Application > Service Workers
