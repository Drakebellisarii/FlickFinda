# FlickFinda React UI - Component Overview

## Design System

### Color Palette
- **Primary Background**: #0F172A (Navy)
- **Secondary Background**: #1E293B (Dark Slate)
- **Dark Background**: #020617 (Darkest Navy)
- **Accent Color**: #F59E0B (Gold/Amber)
- **Accent Light**: #FCD34D (Light Gold)
- **Text Primary**: #F8FAFC (Off-white)
- **Text Secondary**: #CBD5E1 (Light Slate)

### Typography
- **Headings**: Playfair Display (serif, elegant)
- **Body Text**: Inter (sans-serif, modern)

### Components Overview

## 1. Header Component
Located at: `frontend/src/components/Header.tsx`

**Features:**
- Sticky navigation bar with glass-morphism effect
- Logo: "FlickFinda" in Playfair Display with gold accent
- Navigation links: Home, Watchlist, Ratings
- Active route highlighting
- Logout button with confirmation dialog
- Mobile-responsive hamburger menu
- Smooth animations on scroll

**Design:**
- Dark navy background with subtle transparency
- Gold underline for active page
- Hover effects with smooth transitions

## 2. MovieCard Component
Located at: `frontend/src/components/MovieCard.tsx`

**Features:**
- Movie poster with fallback placeholder
- Title in large Playfair Display font
- Year, Genre, Runtime badges
- Three rating boxes: IMDb, Rotten Tomatoes, Metacritic
  - Color-coded by rating (green/yellow/red)
- Director and cast information
- Expandable plot/reviews section
- Awards section with trophy icon
- Three action buttons:
  1. Add to Watchlist (⭐ icon)
  2. Mark as Watched (✓ icon, opens rating modal)
  3. Watch Trailer (▶ icon, opens YouTube)
- Success/error messages with smooth animations

**Rating Modal:**
- Slider for 1-10 rating
- Optional review textarea
- Submit/Cancel buttons
- Smooth fade-in animation

**Design:**
- Card with dark slate background
- Gold border on hover
- Smooth shadow transitions
- Responsive grid layout

## 3. LoadingSkeleton Component
Located: `frontend/src/components/LoadingSkeleton.tsx`

**Features:**
- Matches MovieCard layout exactly
- Animated pulse effect on all elements
- Shows during data fetching
- Multiple skeletons can render in grid

**Design:**
- Gray/slate animated rectangles
- Smooth pulse animation
- Maintains layout to prevent content shift

## 4. ErrorMessage Component
Located: `frontend/src/components/ErrorMessage.tsx`

**Features:**
- Warning icon (⚠️)
- Error title and detailed message
- Dismissible with smooth animation
- Auto-dismiss after 5 seconds

**Design:**
- Gold/amber gradient background
- Dark text for readability
- Rounded corners with shadow
- Slide-in animation

## 5. HomePage
Located: `frontend/src/pages/HomePage.tsx`

**Layout:**
```
+------------------------------------------+
| Header                                   |
+------------------------------------------+
| [Search Input: "I want a movie about..."]|
| [Streaming: Dropdown] [# Movies: 1-6]   |
| [Get Suggestions Button]                 |
+------------------------------------------+
| Genre Buttons:                           |
| [Action] [Comedy] [Drama] [Horror]       |
| [Sci-Fi] [Random]                        |
+------------------------------------------+
| Movie Results Grid:                      |
| +-------+ +-------+ +-------+            |
| | Card  | | Card  | | Card  |            |
| +-------+ +-------+ +-------+            |
+------------------------------------------+
```

**Features:**
- Large search input with placeholder
- Streaming service filter (Netflix, Hulu, etc.)
- Number of titles selector (1-6)
- Genre quick-select buttons with icons
- Loading skeletons while fetching
- Error message display for API failures
- Responsive grid (1-3 columns based on screen size)

## 6. WatchlistPage
Located: `frontend/src/pages/WatchlistPage.tsx`

**Layout:**
```
+------------------------------------------+
| Header                                   |
+------------------------------------------+
| Watchlist (X movies)                     |
+------------------------------------------+
| +-------+ +-------+ +-------+            |
| | Movie | | Movie | | Movie |            |
| | Card  | | Card  | | Card  |            |
| |[Remove]| [Remove]| [Remove]|           |
| +-------+ +-------+ +-------+            |
+------------------------------------------+
```

**Features:**
- Movie cards with remove button
- Grid layout
- Empty state: "Your watchlist is empty" with CTA
- Loading state
- Smooth remove animations

## 7. RatingsPage
Located: `frontend/src/pages/RatingsPage.tsx`

**Layout:**
```
+------------------------------------------+
| Header                                   |
+------------------------------------------+
| My Ratings (X movies)                    |
+------------------------------------------+
| +-------+ +-------+ +-------+            |
| | Movie | | Movie | | Movie |            |
| | ⭐⭐⭐⭐⭐  | | ⭐⭐⭐⭐⭐  | | ⭐⭐⭐⭐⭐  |    |
| | Review| | Review| | Review|            |
| | [Edit]| | [Edit]| | [Edit]|            |
| |[Delete]| [Delete]| [Delete]|           |
| +-------+ +-------+ +-------+            |
+------------------------------------------+
```

**Features:**
- Compact movie cards with thumbnail
- Visual star rating (1-10 stars)
- Review text preview
- Edit button (opens modal)
- Delete button with confirmation
- Edit modal with pre-filled data
- Empty state message

## Animation Effects

### Page Transitions
- Fade in on mount
- Stagger children for sequential appearance

### Card Interactions
- Scale on hover (1.02x)
- Shadow elevation
- Border color change to gold

### Button States
- Disabled state: opacity 50%, cursor not-allowed
- Loading state: pulse animation
- Hover: slight scale and color shift

### Error/Success Messages
- Slide in from top
- Auto-dismiss with fade out
- Smooth height transitions

## Responsive Breakpoints

- **Mobile** (< 640px): Single column, stacked layout
- **Tablet** (640px - 1024px): 2 columns for cards
- **Desktop** (> 1024px): 3 columns for cards

## Accessibility Features

- Semantic HTML elements
- ARIA labels on interactive elements
- Keyboard navigation support
- Focus indicators
- Alt text for images
- Color contrast meets WCAG AA standards

## Performance Optimizations

- Lazy loading images
- Code splitting by route
- Tree-shaking unused code
- Minified production build
- Gzip compression
- Browser caching with versioned assets

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES6+ features
- CSS Grid and Flexbox
- CSS custom properties (variables)
