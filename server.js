require("dotenv").config();
const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

const NEWS_API_KEY = process.env.NEWS_API_KEY;
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

app.use(express.static(path.join(__dirname, "public")));

// Proxy News API
app.get("/api/news", async (req, res) => {
    const { q, category } = req.query;
    let url;
    if (q === "general" || !q) {
        url = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${NEWS_API_KEY}`;
    } else {
        url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(q)}&sortBy=publishedAt&apiKey=${NEWS_API_KEY}`;
    }
    try {
        const response = await fetch(url);
        const data = await response.json();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Proxy Weather API
app.get("/api/weather", async (req, res) => {
    const { lat, lon, city } = req.query;
    let url;
    if (lat && lon) {
        url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${WEATHER_API_KEY}`;
    } else {
        url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city || "Jakarta")}&units=metric&appid=${WEATHER_API_KEY}`;
    }
    try {
        const response = await fetch(url);
        const data = await response.json();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`NewsPop server running at http://localhost:${PORT}`);
});
