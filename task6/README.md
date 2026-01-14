# SMEC App - Social Media Experience Center

A modern, scalable mini social media application built with React, Vite, TailwindCSS, and shadcn/UI.

![SMEC App](https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1200&h=630&fit=crop)

## ✨ Features

### Core Features
- **User Profiles** - Complete profile system with avatars, bios, cover images, and stats
- **Posts & Comments** - Create, like, and comment on posts with image support
- **Like/Follow System** - Full social interaction capabilities
- **Real-time Feed** - Personalized feed based on who you follow
- **Explore Page** - Discover trending content and users
- **Search** - Find users across the platform
- **Notifications** - Stay updated on likes, comments, follows, and mentions
- **Direct Messages** - Chat with other users
- **Settings** - Comprehensive settings with profile editing, privacy, and appearance options
- **Dark Mode** - Beautiful dark theme support

### Technical Features
- 🚀 Built with Vite for lightning-fast development
- 🎨 TailwindCSS for utility-first styling
- 💅 shadcn/UI for beautiful, accessible components
- 📦 Zustand for simple, scalable state management
- 📱 Fully responsive design
- ♿ Accessible components with Radix UI primitives
- 🎭 Smooth animations and transitions

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## 📁 Project Structure

```
src/
├── components/
│   ├── layout/          # Layout components (Navbar, Sidebar)
│   ├── pages/           # Page components
│   ├── post/            # Post-related components
│   ├── profile/         # Profile components
│   └── ui/              # shadcn/UI components
├── data/
│   └── mockData.js      # Mock data for demo
├── lib/
│   └── utils.js         # Utility functions
├── store/
│   └── useStore.js      # Zustand store
├── App.jsx              # Main app component
├── main.jsx             # Entry point
└── index.css            # Global styles
```

## 🎨 Design System

### Colors
- **Primary**: Violet (#8B5CF6) - Used for buttons, links, and highlights
- **Accent**: Pink (#EC4899) - Used for gradients and special elements
- **Background**: Adaptive light/dark modes

### Typography
- **Font Family**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700, 800

### Components
All UI components are built using shadcn/UI with custom styling for the SMEC brand.

## 🔧 Tech Stack

| Technology | Purpose |
|------------|---------|
| React 18 | UI Library |
| Vite 6 | Build Tool |
| TailwindCSS 3 | Styling |
| shadcn/UI | Component Library |
| Radix UI | Accessible Primitives |
| Zustand | State Management |
| Lucide React | Icons |

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🌟 Key Components

### PostCard
The main component for displaying posts with:
- Author info with verified badges
- Post content and images
- Like, comment, share, and save actions
- Expandable comment section

### ProfilePage
Complete profile view with:
- Cover image and avatar
- Bio and metadata
- Followers/Following lists
- Tabbed content (Posts, Media, Likes)

### CreatePost
Rich post creation with:
- Text input with character limit
- Image attachment
- Emoji and location support

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

---

Made with 💜 for the hackathon by SMEC Team
