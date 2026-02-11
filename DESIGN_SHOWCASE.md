# FlickFinda UI Redesign - Navy Vintage Cinema Theme

## Design Overview

This redesign transforms FlickFinda into an Apple-inspired, premium cinema experience with:
- **Navy vintage deep-blue cinema vibe** - Dark, sophisticated backgrounds (#0A1929, #0D1B2A, #000814)
- **Retro orange accents** - Warm, vintage feel (#FF6B35) for interactive elements
- **Subtle gold details** - Elegant, premium touches (#D4AF37) for highlights and borders

![UI Preview](https://github.com/user-attachments/assets/8ff5c933-d6d7-4f1a-9dec-9134661e8e9a)

## Key Features

### 1. **Embedded Trailer Video Player**
- Theater-style modal with gold curtain effects
- Embedded YouTube player with autoplay
- Graceful fallback for non-embeddable videos
- Keyboard navigation (ESC to close)
- Responsive design for mobile and desktop

### 2. **Apple-Inspired Design System**
- SF Pro Display font family for a native Apple feel
- Glassmorphism effects with backdrop blur
- Smooth animations with Framer Motion
- Consistent shadows and borders throughout

### 3. **Navy Cinema Color Palette**
```css
Cinema Navy: #0A1929, #0D1B2A, #000814
Retro Orange: #FF6B35 (interactive elements)
Gold: #D4AF37 (premium accents)
Apple Gray: #F5F5F7 - #1C1C1E (neutrals)
```

### 4. **Component Updates**

#### **Header**
- Deep blue gradient background with gold border
- Retro orange active state for navigation
- Smooth hover transitions
- Mobile-responsive hamburger menu

#### **MovieCard**
- Glassmorphic cards with navy gradients
- Retro orange rating badges
- Gold award highlights
- Embedded trailer button with cinema gradient
- Expandable plot section with smooth animations

#### **HomePage**
- Navy animated gradient background
- Glass-card search interface
- Retro orange genre buttons
- Responsive grid layout

#### **WatchlistPage & RatingsPage**
- Dark glass overlay cards
- Gold-bordered movie posters
- Retro orange accents for ratings
- Consistent navy theme throughout

### 5. **Button Styles**

#### **Cinema Gradient Button** (`.btn-cinema-gradient`)
Navy blue gradient with retro orange sweep effect on hover

#### **Retro Orange Button** (`.btn-retro-orange`)
Warm orange gradient with gold sweep effect on hover

### 6. **Responsive Design**
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px)
- Touch-friendly button sizes (min 44px height)
- Flexible grid layouts

## Technical Implementation

### Updated Files:
1. `frontend/tailwind.config.js` - New color palette and design tokens
2. `frontend/src/index.css` - Global styles and utility classes
3. `frontend/src/components/TrailerModal.tsx` - New embedded video player
4. `frontend/src/components/MovieCard.tsx` - Integrated trailer modal
5. `frontend/src/components/Header.tsx` - Refined navigation
6. `frontend/src/pages/HomePage.tsx` - Updated search interface
7. `frontend/src/pages/WatchlistPage.tsx` - Dark theme cards
8. `frontend/src/pages/RatingsPage.tsx` - Navy rating cards

### Design Tokens:
- **Cinema Navy Palette**: Deep blues for backgrounds
- **Retro Orange**: `#FF6B35` for CTAs and interactions
- **Gold Metallic**: `#D4AF37` for premium highlights
- **Apple Gray Scale**: Neutral grays for text
- **Shadows**: Apple-inspired drop shadows
- **Borders**: Gold-tinted borders for elegance

## Usage

### Trailer Modal
```tsx
import { TrailerModal } from './components';

<TrailerModal
  isOpen={showTrailer}
  onClose={() => setShowTrailer(false)}
  movieTitle="Inception"
  trailerUrl="https://www.youtube.com/watch?v=..."
/>
```

### Button Classes
```html
<!-- Navy Cinema Gradient -->
<button className="btn-cinema-gradient">Watch Now</button>

<!-- Retro Orange -->
<button className="btn-retro-orange">Get Started</button>

<!-- Glass Card -->
<div className="glass-card">Content</div>

<!-- Dark Glass Card -->
<div className="glass-card-dark">Modal Content</div>
```

## Browser Support
- Modern browsers with CSS backdrop-filter support
- Graceful degradation for older browsers
- Mobile Safari iOS 14+
- Chrome 76+
- Firefox 103+

## Accessibility
- Keyboard navigation support
- ARIA labels on interactive elements
- Focus indicators with retro orange
- Minimum 44px touch targets
- High contrast ratios for text

## Performance
- Optimized animations with GPU acceleration
- Lazy loading for video embeds
- Efficient CSS with Tailwind purging
- Framer Motion for smooth transitions
