# 📰 NewsPop — Modern News Platform

<p align="center">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5">
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express">
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS">
</p>

<p align="center">
  <b>A sleek, feature-rich news aggregation platform with real-time weather, interactive quizzes, bookmarks, and dark mode.</b>
</p>

---

## ✨ What's New (2024 Modernization)

| Feature | Description |
|---------|-------------|
| 🌙 **Dark Mode** | Seamless light/dark theme toggle with persistent preference storage |
| 🔖 **Bookmarks** | Save articles for later reading with localStorage persistence |
| 📍 **Geolocation Weather** | Auto-detects your exact location for real-time weather |
| 🔍 **Debounced Search** | Smart search that waits for typing to finish before fetching |
| 🎯 **Real Quiz Scoring** | Live trivia with actual score calculation and answer feedback |
| 🔔 **Toast Notifications** | Elegant non-blocking alerts instead of intrusive popups |
| 📤 **Share Articles** | Native Web Share API + clipboard fallback |
| ⬆️ **Back to Top** | Smooth scroll button appears when scrolling down |
| 💀 **Skeleton Loaders** | Shimmer loading placeholders while content fetches |
| 🎨 **Glassmorphism UI** | Modern frosted-glass effects and smooth animations |

---

## 🚀 Live Demo

[View Live Demo](https://your-deployment-url.vercel.app) *(Deploy to Vercel/Netlify/Railway)*

![NewsPop Screenshot](https://github.com/user-attachments/assets/6ddbb399-2801-493c-8325-ea6fb18936fe)

---

## 📦 Features

### 📰 News Aggregation
- Fetches real-time headlines from **NewsAPI**
- Category filtering: All News, Business, Sports, Health, Entertainment, Technology
- Smart search with debouncing (400ms delay)
- Reading time estimation for each article

### 🌤️ Smart Weather Widget
- **Auto-detects your location** using browser geolocation
- Falls back to Jakarta if permission denied
- Real-time temperature, conditions, and animated icons
- One-tap location refresh

### 🎯 Interactive Quiz Challenge
- 5-question trivia from OpenTDB API
- Real-time score tracking with per-question feedback
- "Try Again" option with new questions
- Fun, engaging UI with smooth transitions

### 🔖 Bookmarks System
- Click 💾 to save any article
- Persistent storage via localStorage
- Dedicated bookmarks modal to view saved articles
- One-click remove from saved list

### 🌓 Dark Mode
- Toggle in the navbar (☀️/🌙 icon)
- Respects system preference on first load
- Smooth CSS variable transitions
- All components fully themed

### 📱 Mobile-First Responsive
- Glassmorphism mobile menu with overlay
- Touch-friendly card interactions
- Adaptive grid layouts
- Optimized skeleton loaders for all screen sizes

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | HTML5, CSS3, Vanilla JavaScript (ES6+) |
| **Styling** | Tailwind CSS + Custom CSS Variables |
| **Backend** | Node.js + Express |
| **Icons** | Font Awesome 6 |
| **Fonts** | Google Fonts (Poppins) |
| **APIs** | NewsAPI, OpenWeatherAPI, OpenTDB |

---

## 📋 Prerequisites

- **Node.js** 18+ installed
- **NewsAPI Key** ([Get free key](https://newsapi.org/register))
- **OpenWeatherAPI Key** ([Get free key](https://home.openweathermap.org/users/sign_up))

---

## 🔧 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/aishikcodes/news-platform.git
cd news-platform
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
NEWS_API_KEY=your_newsapi_key_here
WEATHER_API_KEY=your_openweather_key_here
```

> ⚠️ **Security Note**: Never commit `.env` files. The `.gitignore` already excludes them.

### 4. Start the Server

```bash
npm start
```

The app will run at `http://localhost:3000`

---

## 📁 Project Structure

```
news-platform/
├── .env                  # API keys (gitignored)
├── .gitignore           # Excludes node_modules and .env
├── package.json         # Dependencies & scripts
├── server.js            # Express backend with API proxies
├── README.md            # This file
├── public/              # Static frontend files
│   ├── index.html       # Main HTML structure
│   ├── style.css        # Custom styles + Tailwind
│   ├── script.js        # All JavaScript logic
│   └── assets/          # Images, icons, etc.
└── src/
    └── input.css        # Tailwind entry point
```

---

## 🎯 Usage Guide

### Browse News
1. Open the homepage — latest headlines load automatically
2. Click category buttons to filter by topic
3. Use the search bar for keyword searches

### Save Articles
1. Hover over any news card
2. Click the **bookmark icon** (💾)
3. View saved articles via "Saved" in the navbar

### Take the Quiz
1. Click **"Quiz"** in the navbar
2. Answer 5 trivia questions
3. Submit to see your score with detailed feedback
4. Click "Try Again" for new questions

### Check Weather
1. Allow location access when prompted
2. Your **exact city** and current weather appear instantly
3. Refresh the page to update

### Toggle Dark Mode
1. Click the **sun/moon icon** in the top-right
2. Preference persists across sessions

---

## 🔒 API Security

This app uses a **backend proxy pattern** to protect API keys:

```
Frontend → Express Server (/api/...) → External APIs
```

- ✅ API keys never exposed to browser
- ✅ Rate limiting ready (implement in `server.js`)
- ✅ Easy to add authentication later

---

## 🚀 Deployment

### Deploy to Vercel

```bash
npm i -g vercel
vercel
```

### Deploy to Railway/Render

1. Push code to GitHub
2. Connect repository to Railway/Render
3. Add environment variables in dashboard:
   - `NEWS_API_KEY`
   - `WEATHER_API_KEY`
4. Deploy!

### Environment Variables for Production

Set these in your hosting platform:

```env
NEWS_API_KEY=your_production_key
WEATHER_API_KEY=your_production_key
PORT=3000
```

---

## 🛣️ Roadmap

- [ ] User authentication (Firebase/Auth0)
- [ ] Article comments system
- [ ] Push notifications for breaking news
- [ ] PWA support for offline reading
- [ ] Multi-language support
- [ ] Advanced news filters (date range, source)

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — see [LICENSE](LICENSE) for details.

---

## 🙏 Acknowledgments

- [NewsAPI](https://newsapi.org) for news data
- [OpenWeather](https://openweathermap.org) for weather data
- [OpenTDB](https://opentdb.com) for trivia questions
- [Tailwind CSS](https://tailwindcss.com) for styling utilities

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/aishikcodes">@aishikcodes</a>
</p>

