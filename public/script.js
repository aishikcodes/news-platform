// API Configuration — server proxies all requests so keys stay backend-only
const API_BASE = "/api";

let currentCategory = "general";
let allNews = [];
let currentQuizAnswers = [];
let searchTimeout = null;

function getBookmarks() {
    try {
        return JSON.parse(localStorage.getItem("newspop_bookmarks") || "[]");
    } catch { return []; }
}

function saveBookmarks(bm) {
    localStorage.setItem("newspop_bookmarks", JSON.stringify(bm));
}

// Demo News Data (fallback)
const demoNews = [
    {
        source: { name: "TechCrunch" },
        title: "AI Revolution: GPT-6 Released with Quantum Computing Integration",
        description: "OpenAI unveils GPT-6 with unprecedented quantum-enhanced reasoning, transforming AI capabilities across industries.",
        urlToImage: "https://images.unsplash.com/photo-1677442d019e857ab43cb3ee40c40a8e?w=500&h=300&fit=crop",
        publishedAt: "2026-04-22T10:30:00Z",
        url: "https://techcrunch.com",
        category: "technology"
    },
    {
        source: { name: "BBC Sports" },
        title: "Barcelona Dominates Champions League with Record-Breaking Victory",
        description: "Barcelona secures their 8th Champions League title with a spectacular 4-0 win against Manchester United.",
        urlToImage: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500&h=300&fit=crop",
        publishedAt: "2026-04-22T09:15:00Z",
        url: "https://bbc.com/sport",
        category: "sports"
    },
    {
        source: { name: "Bloomberg" },
        title: "Global Markets Surge as AI-Driven Economy Hits New Milestones",
        description: "Stock markets worldwide reach unprecedented highs driven by AI innovations and sustainable energy breakthroughs.",
        urlToImage: "https://images.unsplash.com/photo-1611974789882-8235c10d7d4a?w=500&h=300&fit=crop",
        publishedAt: "2026-04-22T08:45:00Z",
        url: "https://bloomberg.com",
        category: "business"
    },
    {
        source: { name: "Health News" },
        title: "Breakthrough Gene Therapy Eliminates Rare Genetic Disorders",
        description: "Scientists announce successful gene therapy trials that have cured previously incurable genetic conditions.",
        urlToImage: "https://images.unsplash.com/photo-1576091160550-112173f7f869?w=500&h=300&fit=crop",
        publishedAt: "2026-04-22T07:20:00Z",
        url: "https://healthnews.com",
        category: "health"
    },
    {
        source: { name: "Variety" },
        title: "Virtual Reality Film Festival Breaks Attendance Records",
        description: "The first global VR film festival attracts millions of viewers with immersive storytelling experiences.",
        urlToImage: "https://images.unsplash.com/photo-1533109752211-118fcf4312f5?w=500&h=300&fit=crop",
        publishedAt: "2026-04-22T06:00:00Z",
        url: "https://variety.com",
        category: "entertainment"
    },
    {
        source: { name: "Tech News" },
        title: "Neuralink Achieves Full Brain-Computer Interface Success",
        description: "Elon Musk's Neuralink announces successful human trials with revolutionary brain-computer interface technology.",
        urlToImage: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=500&h=300&fit=crop",
        publishedAt: "2026-04-21T15:30:00Z",
        url: "https://technews.com",
        category: "technology"
    },
    {
        source: { name: "CNN Business" },
        title: "Space Tourism Becomes Mainstream with New Orbital Hotels",
        description: "Private space companies launch luxury orbital hotels, making space travel accessible to the general public.",
        urlToImage: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=500&h=300&fit=crop",
        publishedAt: "2026-04-21T14:15:00Z",
        url: "https://cnn.com/business",
        category: "business"
    },
    {
        source: { name: "ESPN" },
        title: "Olympic Games Feature AI-Enhanced Training Programs",
        description: "Athletes at the 2026 Olympics showcase incredible performances enabled by AI-powered training technologies.",
        urlToImage: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500&h=300&fit=crop",
        publishedAt: "2026-04-21T13:45:00Z",
        url: "https://espn.com",
        category: "sports"
    },
    {
        source: { name: "Medical Journal" },
        title: "Nanobots Successfully Treat Cancer at Cellular Level",
        description: "Revolutionary nanobot technology demonstrates 95% success rate in targeted cancer cell destruction.",
        urlToImage: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=500&h=300&fit=crop",
        publishedAt: "2026-04-21T12:30:00Z",
        url: "https://medicaljournal.com",
        category: "health"
    },
    {
        source: { name: "Hollywood Reporter" },
        title: "AI-Generated Films Win Academy Awards",
        description: "For the first time, AI-created films dominate the Academy Awards, revolutionizing the entertainment industry.",
        urlToImage: "https://images.unsplash.com/photo-1489599735734-79b4b9c0c8b?w=500&h=300&fit=crop",
        publishedAt: "2026-04-21T11:00:00Z",
        url: "https://hollywoodreporter.com",
        category: "entertainment"
    },
    {
        source: { name: "Wired" },
        title: "Quantum Internet Goes Live in Major Cities",
        description: "The world's first quantum internet network launches, providing unbreakable encryption for global communications.",
        urlToImage: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=500&h=300&fit=crop",
        publishedAt: "2026-04-20T16:45:00Z",
        url: "https://wired.com",
        category: "technology"
    },
    {
        source: { name: "Forbes" },
        title: "Sustainable Energy Revolution: Fusion Power Online",
        description: "Commercial fusion power plants begin operation, providing unlimited clean energy to millions of homes.",
        urlToImage: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=500&h=300&fit=crop",
        publishedAt: "2026-04-20T15:20:00Z",
        url: "https://forbes.com",
        category: "business"
    }
];

// Initialize
document.addEventListener("DOMContentLoaded", () => {
    console.log("Initializing NewsPop...");
    initTheme();
    loadInitialNews();
    initWeather();
    setupEventListeners();
    setupScrollListener();
});

function setupEventListeners() {
    const searchInput = document.getElementById("searchInput");
    searchInput.addEventListener("input", () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            const query = searchInput.value.trim();
            if (query.length >= 3) searchNews();
            else if (query.length === 0) loadInitialNews();
        }, 400);
    });
    searchInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            clearTimeout(searchTimeout);
            searchNews();
        }
    });
}

function setupScrollListener() {
    const backToTop = document.getElementById("backToTop");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 600) {
            backToTop.classList.remove("hidden");
        } else {
            backToTop.classList.add("hidden");
        }
    });
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function showToast(message, type = "info") {
    const container = document.getElementById("toastContainer");
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    const icon = type === "success" ? "fa-check-circle" : type === "error" ? "fa-exclamation-circle" : "fa-info-circle";
    toast.innerHTML = `<i class="fas ${icon}"></i> <span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function initTheme() {
    const saved = localStorage.getItem("newspop_theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (saved === "dark" || (!saved && prefersDark)) {
        document.body.classList.add("dark-mode");
        document.getElementById("themeIcon").className = "fas fa-sun";
    }
}

function toggleTheme() {
    const body = document.body;
    const icon = document.getElementById("themeIcon");
    if (body.classList.contains("dark-mode")) {
        body.classList.remove("dark-mode");
        icon.className = "fas fa-moon";
        localStorage.setItem("newspop_theme", "light");
    } else {
        body.classList.add("dark-mode");
        icon.className = "fas fa-sun";
        localStorage.setItem("newspop_theme", "dark");
    }
}

function toggleMenu() {
    const menu = document.getElementById("navMenu");
    const hamburger = document.getElementById("hamburger");
    const overlay = document.getElementById("mobileOverlay");
    menu.classList.toggle("active");
    hamburger.classList.toggle("active");
    overlay.classList.toggle("active");
}

function showLoading(show) {
    const spinner = document.getElementById("loadingSpinner");
    const skeleton = document.getElementById("skeletonLoader");
    if (show) {
        spinner.classList.remove("hidden");
        skeleton.classList.remove("hidden");
    } else {
        spinner.classList.add("hidden");
        skeleton.classList.add("hidden");
    }
}

function updateSectionTitle(title, count) {
    document.getElementById("sectionTitle").textContent = title;
    document.getElementById("sectionCount").textContent = count ? `${count} articles` : "";
}

function readingTime(text) {
    if (!text) return "1 min";
    const words = text.split(/\s+/).length;
    const mins = Math.ceil(words / 200);
    return `${mins} min read`;
}

function bookmarkArticle(encodedUrl, btn) {
    const url = decodeURIComponent(encodedUrl);
    const article = allNews.find(a => a.url === url) || demoNews.find(a => a.url === url) || { url, title: "Article", description: "", source: { name: "News" }, publishedAt: new Date().toISOString(), urlToImage: "" };
    let bm = getBookmarks();
    const idx = bm.findIndex(a => a.url === url);
    if (idx >= 0) {
        bm.splice(idx, 1);
        btn.classList.remove("bookmarked");
        btn.innerHTML = '<i class="far fa-bookmark"></i>';
        showToast("Removed from saved", "info");
    } else {
        bm.push(article);
        btn.classList.add("bookmarked");
        btn.innerHTML = '<i class="fas fa-bookmark"></i>';
        showToast("Article saved!", "success");
    }
    saveBookmarks(bm);
}

function isBookmarked(url) {
    return getBookmarks().some(a => a.url === url);
}

async function shareArticle(encodedUrl) {
    const url = decodeURIComponent(encodedUrl);
    const article = allNews.find(a => a.url === url) || demoNews.find(a => a.url === url) || { url, title: "", description: "" };
    if (navigator.share) {
        try {
            await navigator.share({ title: article.title, text: article.description, url });
        } catch (err) {
            if (err.name !== "AbortError") copyToClipboard(url);
        }
    } else {
        copyToClipboard(url);
    }
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => showToast("Link copied!", "success")).catch(() => showToast("Failed to copy", "error"));
}

function showBookmarks() {
    const modal = document.getElementById("bookmarksModal");
    const container = document.getElementById("bookmarksContainer");
    const bm = getBookmarks();
    modal.classList.remove("hidden");
    if (bm.length === 0) {
        container.innerHTML = `<p class="empty-state"><i class="far fa-bookmark"></i><br>No saved articles yet.<br>Click the bookmark icon on any article to save it here.</p>`;
        return;
    }
    container.innerHTML = "";
    bm.forEach(article => {
        const card = createNewsCard(article);
        container.appendChild(card);
    });
}

function closeBookmarks() {
    document.getElementById("bookmarksModal").classList.add("hidden");
}

function loadInitialNews() {
    console.log("Loading initial news...");
    showLoading(true);
    updateSectionTitle("Latest News", 0);

    fetchNewsFromAPI("general")
        .then(news => {
            if (news && news.length > 0) {
                allNews = news;
                displayNews(allNews);
                updateSectionTitle("Latest News", allNews.length);
            } else {
                console.log("Using demo data as fallback...");
                allNews = demoNews;
                displayNews(demoNews);
                updateSectionTitle("Trending Stories", demoNews.length);
            }
            showLoading(false);
        })
        .catch(error => {
            console.error("Error loading news:", error);
            allNews = demoNews;
            displayNews(demoNews);
            updateSectionTitle("Trending Stories", demoNews.length);
            showLoading(false);
        });
}

function fetchNewsFromAPI(query) {
    return new Promise((resolve, reject) => {
        const url = `${API_BASE}/news?q=${encodeURIComponent(query || "general")}`;
        console.log("Fetching from:", url);

        fetch(url)
            .then(res => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
            .then(data => {
                if (data.articles) {
                    resolve(data.articles);
                } else {
                    resolve(null);
                }
            })
            .catch(error => {
                console.error("API Error:", error);
                reject(error);
            });
    });
}

function displayNews(news) {
    const newsGrid = document.getElementById("newsGrid");
    newsGrid.innerHTML = "";
    
    if (!news || news.length === 0) {
        newsGrid.innerHTML = "<p style='grid-column: 1/-1; text-align: center; padding: 2rem;'>No news articles found. Try a different search or category.</p>";
        return;
    }
    
    news.forEach(article => {
        // Skip articles without images
        if (!article.urlToImage) return;
        
        const card = createNewsCard(article);
        newsGrid.appendChild(card);
    });
}

function createNewsCard(article) {
    const card = document.createElement("div");
    card.className = "news-card";

    const date = new Date(article.publishedAt || Date.now());
    const formattedDate = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
    });
    const rt = readingTime(article.description || article.title);
    const bookmarked = isBookmarked(article.url);
    const bookmarkIcon = bookmarked ? "fas fa-bookmark" : "far fa-bookmark";
    const bookmarkClass = bookmarked ? "bookmarked" : "";

    const safeUrl = encodeURIComponent(article.url).replace(/'/g, "%27");
    const safeTitle = (article.title || "").replace(/"/g, '&quot;');

    card.innerHTML = `
        <img src="${article.urlToImage || ""}" alt="${safeTitle}" class="news-image" onerror="this.src='https://via.placeholder.com/320x200?text=News+Image'">
        <div class="news-content">
            <span class="news-source">${article.source?.name || "News"}</span>
            <h3 class="news-title">${article.title || "Untitled"}</h3>
            <p class="news-desc">${article.description || "Read more for details about this story."}</p>
            <div class="news-footer">
                <div style="display:flex;align-items:center;gap:0.6rem;">
                    <span class="news-date">${formattedDate}</span>
                    <span class="read-time"><i class="far fa-clock"></i> ${rt}</span>
                </div>
                <div class="card-actions">
                    <button class="${bookmarkClass}" onclick="event.stopPropagation(); bookmarkArticle('${safeUrl}', this)" title="Save" aria-label="Save article">
                        <i class="${bookmarkIcon}"></i>
                    </button>
                    <button onclick="event.stopPropagation(); shareArticle('${safeUrl}')" title="Share" aria-label="Share article">
                        <i class="fas fa-share-alt"></i>
                    </button>
                    <button class="news-link" onclick="openArticle('${safeUrl}')">Read More</button>
                </div>
            </div>
        </div>
    `;

    return card;
}

function searchNews() {
    const query = document.getElementById("searchInput").value.trim();

    if (!query) {
        showToast("Please enter a search term", "error");
        return;
    }

    showLoading(true);
    updateSectionTitle(`Results for "${query}"`, 0);

    const filtered = demoNews.filter(article =>
        (article.title || "").toLowerCase().includes(query.toLowerCase()) ||
        (article.description || "").toLowerCase().includes(query.toLowerCase())
    );

    fetchNewsFromAPI(query)
        .then(news => {
            if (news && news.length > 0) {
                displayNews(news);
                updateSectionTitle(`Results for "${query}"`, news.length);
            } else {
                displayNews(filtered);
                updateSectionTitle(`Results for "${query}"`, filtered.length);
            }
            showLoading(false);
        })
        .catch(() => {
            displayNews(filtered);
            updateSectionTitle(`Results for "${query}"`, filtered.length);
            showLoading(false);
        });
}

function switchCategory(category, el) {
    console.log("Switching to category:", category);
    currentCategory = category;

    document.querySelectorAll(".category-btn").forEach(btn => btn.classList.remove("active"));
    document.querySelectorAll(".nav-link").forEach(link => link.classList.remove("active"));

    if (el) {
        el.classList.add("active");
    }
    const catBtn = document.querySelector(`.category-btn[data-cat="${category}"]`);
    if (catBtn) catBtn.classList.add("active");
    const navLink = document.querySelector(`.nav-link[onclick*="'${category}'"]`);
    if (navLink) navLink.classList.add("active");

    const categoryMap = {
        "general": "general",
        "business": "business",
        "tech": "technology",
        "technology": "technology",
        "sports": "sports",
        "health": "health",
        "entertainment": "entertainment"
    };

    const categoryKey = categoryMap[category] || "general";
    const filtered = demoNews.filter(article =>
        !article.category || article.category === categoryKey || category === "general"
    );

    showLoading(true);
    updateSectionTitle(categoryKey.charAt(0).toUpperCase() + categoryKey.slice(1) + " News", 0);

    fetchNewsFromAPI(category === "general" ? "general" : categoryKey)
        .then(news => {
            if (news && news.length > 0) {
                allNews = news;
                displayNews(allNews);
                updateSectionTitle(categoryKey.charAt(0).toUpperCase() + categoryKey.slice(1) + " News", allNews.length);
            } else {
                allNews = filtered;
                displayNews(filtered);
                updateSectionTitle(categoryKey.charAt(0).toUpperCase() + categoryKey.slice(1) + " News", filtered.length);
            }
            showLoading(false);
        })
        .catch(() => {
            allNews = filtered;
            displayNews(filtered);
            updateSectionTitle(categoryKey.charAt(0).toUpperCase() + categoryKey.slice(1) + " News", filtered.length);
            showLoading(false);
        });
}

function openArticle(encodedUrl) {
    const url = decodeURIComponent(encodedUrl);
    window.open(url, "_blank");
}

function initWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
            },
            (error) => {
                console.log("Geolocation denied or unavailable, falling back to Jakarta:", error.message);
                fetchWeatherByCity("Jakarta");
            },
            { enableHighAccuracy: false, timeout: 10000, maximumAge: 600000 }
        );
    } else {
        fetchWeatherByCity("Jakarta");
    }
}

function fetchWeatherByCoords(lat, lon) {
    const url = `${API_BASE}/weather?lat=${lat}&lon=${lon}`;
    fetch(url)
        .then(res => res.json())
        .then(data => {
            if (data.main) {
                updateWeatherUI(data);
            } else {
                fetchWeatherByCity("Jakarta");
            }
        })
        .catch(() => fetchWeatherByCity("Jakarta"));
}

function fetchWeatherByCity(city) {
    const url = `${API_BASE}/weather?city=${encodeURIComponent(city)}`;
    fetch(url)
        .then(res => res.json())
        .then(data => {
            if (data.main) updateWeatherUI(data);
        })
        .catch(error => console.error("Weather fetch error:", error));
}

function updateWeatherUI(data) {
    const temp = Math.round(data.main.temp);
    const description = data.weather[0].main;
    const iconCode = data.weather[0].icon;

    document.getElementById("weatherCity").textContent = data.name;
    document.getElementById("weatherTemp").textContent = `${temp}°C`;
    document.getElementById("weatherDesc").textContent = description;

    const iconMap = {
        "01d": "fas fa-sun",
        "01n": "fas fa-moon",
        "02d": "fas fa-cloud-sun",
        "02n": "fas fa-cloud-moon",
        "03d": "fas fa-cloud",
        "03n": "fas fa-cloud",
        "04d": "fas fa-cloud",
        "04n": "fas fa-cloud",
        "09d": "fas fa-cloud-rain",
        "09n": "fas fa-cloud-rain",
        "10d": "fas fa-cloud-sun-rain",
        "10n": "fas fa-cloud-moon-rain",
        "11d": "fas fa-bolt",
        "11n": "fas fa-bolt",
        "13d": "fas fa-snowflake",
        "13n": "fas fa-snowflake",
        "50d": "fas fa-smog",
        "50n": "fas fa-smog"
    };

    document.getElementById("weatherIcon").className = iconMap[iconCode] || "fas fa-cloud";
}

// Quiz Functionality
async function openQuiz() {
    const modal = document.getElementById("quizModal");
    modal.classList.remove("hidden");
    
    showLoading(true);
    
    try {
        const response = await fetch("https://opentdb.com/api.php?amount=5&type=multiple&category=26");
        const data = await response.json();
        
        if (data.results && data.results.length > 0) {
            displayQuizQuestions(data.results);
        } else {
            displayDemoQuiz();
        }
    } catch (error) {
        console.error("Quiz error:", error);
        displayDemoQuiz();
    }
    
    showLoading(false);
}

function displayQuizQuestions(questions) {
    const quizContainer = document.getElementById("quizContainer");
    quizContainer.innerHTML = "";
    currentQuizAnswers = questions.map(q => decodeHTML(q.correct_answer));

    document.getElementById("submitQuizBtn").classList.remove("hidden");
    document.getElementById("retryQuizBtn").classList.add("hidden");
    document.getElementById("quizResult").innerHTML = "";

    questions.forEach((question, index) => {
        const answers = [...question.incorrect_answers, question.correct_answer].sort(() => Math.random() - 0.5);

        const questionDiv = document.createElement("div");
        questionDiv.className = "quiz-question";
        questionDiv.dataset.index = index;
        questionDiv.innerHTML = `
            <h4>${index + 1}. ${decodeHTML(question.question)}</h4>
            ${answers.map(answer => `
                <label class="quiz-option">
                    <input type="radio" name="q${index}" value="${decodeHTML(answer)}">
                    <span>${decodeHTML(answer)}</span>
                </label>
            `).join("")}
        `;
        quizContainer.appendChild(questionDiv);
    });
}

function displayDemoQuiz() {
    const demoQuestions = [
        {
            question: "Which planet is the largest in our solar system?",
            options: ["Saturn", "Jupiter", "Neptune", "Uranus"],
            correct: "Jupiter"
        },
        {
            question: "What is the capital of France?",
            options: ["London", "Paris", "Berlin", "Madrid"],
            correct: "Paris"
        },
        {
            question: "Who wrote 'Romeo and Juliet'?",
            options: ["Jane Austen", "Charles Dickens", "William Shakespeare", "Mark Twain"],
            correct: "William Shakespeare"
        },
        {
            question: "What is the smallest country in the world?",
            options: ["Monaco", "Liechtenstein", "Vatican City", "San Marino"],
            correct: "Vatican City"
        },
        {
            question: "How many continents are there?",
            options: ["5", "6", "7", "8"],
            correct: "7"
        }
    ];

    const quizContainer = document.getElementById("quizContainer");
    quizContainer.innerHTML = "";
    currentQuizAnswers = demoQuestions.map(q => q.correct);

    document.getElementById("submitQuizBtn").classList.remove("hidden");
    document.getElementById("retryQuizBtn").classList.add("hidden");
    document.getElementById("quizResult").innerHTML = "";

    demoQuestions.forEach((q, index) => {
        const questionDiv = document.createElement("div");
        questionDiv.className = "quiz-question";
        questionDiv.dataset.index = index;
        questionDiv.innerHTML = `
            <h4>${index + 1}. ${q.question}</h4>
            ${q.options.map(option => `
                <label class="quiz-option">
                    <input type="radio" name="q${index}" value="${option}">
                    <span>${option}</span>
                </label>
            `).join("")}
        `;
        quizContainer.appendChild(questionDiv);
    });
}

function decodeHTML(html) {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}

function submitQuiz() {
    const quizContainer = document.getElementById("quizContainer");
    const questions = quizContainer.querySelectorAll(".quiz-question");
    let score = 0;
    let total = questions.length;
    let resultHTML = "";

    questions.forEach((q, index) => {
        const selected = document.querySelector(`input[name="q${index}"]:checked`);
        const userAnswer = selected ? selected.value : null;
        const correctAnswer = currentQuizAnswers[index];
        const isCorrect = userAnswer === correctAnswer;
        if (isCorrect) score++;

        const statusClass = userAnswer ? (isCorrect ? "result-correct" : "result-wrong") : "result-wrong";
        const statusIcon = isCorrect ? "<i class='fas fa-check'></i>" : userAnswer ? "<i class='fas fa-times'></i>" : "<i class='fas fa-minus'></i>";
        const displayAnswer = userAnswer || "Not answered";

        resultHTML += `<div class="result-item ${statusClass}">${statusIcon} <strong>Q${index + 1}:</strong> ${displayAnswer} ${!isCorrect && correctAnswer ? `(Correct: ${correctAnswer})` : ""}</div>`;
    });

    const pct = Math.round((score / total) * 100);
    let message = pct >= 80 ? "Outstanding!" : pct >= 60 ? "Good job!" : pct >= 40 ? "Keep practicing!" : "Better luck next time!";

    const resultDiv = document.getElementById("quizResult");
    resultDiv.innerHTML = `
        <h3 style="text-align: center; margin-bottom: 1rem;">Quiz Complete!</h3>
        <div style="background: var(--light-bg); padding: 1rem; border-radius: 8px; margin-bottom: 1rem; text-align: center;">
            <p style="font-size: 1.5rem; font-weight: 700; color: var(--secondary-color);">Score: ${score} / ${total}</p>
            <p style="color: var(--text-light); font-weight: 600;">${message}</p>
        </div>
        <div style="max-height: 200px; overflow-y: auto;">
            ${resultHTML}
        </div>
    `;

    document.getElementById("submitQuizBtn").classList.add("hidden");
    document.getElementById("retryQuizBtn").classList.remove("hidden");
}

function closeQuiz() {
    document.getElementById("quizModal").classList.add("hidden");
    document.getElementById("quizResult").innerHTML = "";
    document.getElementById("submitQuizBtn").classList.remove("hidden");
    document.getElementById("retryQuizBtn").classList.add("hidden");
}

// Close modal when clicking outside
window.onclick = function(event) {
    const quizModal = document.getElementById("quizModal");
    const bookmarksModal = document.getElementById("bookmarksModal");
    if (event.target === quizModal) {
        closeQuiz();
    }
    if (event.target === bookmarksModal) {
        closeBookmarks();
    }
}
