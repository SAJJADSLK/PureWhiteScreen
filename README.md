# Pure White Screen

Free screen utility website with no backend, no database, no authentication.

## Features

- ✨ **White Screen** - Bright white screen for lighting
- 💡 **Ring Light** - Virtual ring light simulator
- ⏱️ **Pomodoro Timer** - 25-minute focus sessions
- 🎨 **Color Screen** - Any color you want
- 📱 **Fully Responsive** - Works on desktop, tablet, mobile
- 🚀 **Fast** - Static site, instant loading
- 💰 **AdSense Ready** - Monetize with Google AdSense

## Quick Start

### Development

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Open http://localhost:3000
```

### Production Build

```bash
# Build for production
pnpm build

# Preview production build
pnpm preview
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Go to vercel.com
3. Import your repository
4. Deploy (no environment variables needed!)

### Other Platforms

- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- Any static hosting

## Project Structure

```
pure-white-screen-simple/
├── src/
│   ├── components/
│   │   ├── Navigation.jsx
│   │   └── Footer.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── WhiteScreen.jsx
│   │   ├── RingLight.jsx
│   │   ├── Pomodoro.jsx
│   │   └── ColorScreen.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

## AdSense Setup

1. Replace `ca-pub-3811332485680799` with your AdSense account ID in:
   - `index.html` (meta tag)
   - `src/App.jsx` (banner ad)
   - All tool pages (inline ads)

2. Update ad slot IDs:
   - Each ad needs a unique `data-ad-slot` value
   - Get these from your AdSense dashboard

## No Backend Required

This is a **static website** - no server, no database, no authentication needed.

- All tools run in the browser
- No user data stored
- No API calls
- Just pure frontend

## Technologies

- **React 19** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Google AdSense** - Monetization

## License

MIT

## Support

For issues or suggestions, create a GitHub issue.
