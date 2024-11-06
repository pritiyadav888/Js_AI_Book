// User Profile (simulate personalized preferences)
const userProfile = {
    likedTopics: ["technology", "science"],
    preferredPopularityThreshold: 0.7
};

// Fetch data from `data.json`
async function fetchNewsData() {
    try {
        const response = await fetch('data.json');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching news data:", error);
        return [];
    }
}

// Filter articles based on user preferences
function personalizeNews(articles) {
    return articles.filter(article =>
        userProfile.likedTopics.includes(article.category) &&
        article.popularity >= userProfile.preferredPopularityThreshold
    );
}

// Render news articles to the DOM
function displayNews(articles) {
    const newsContainer = document.getElementById('news-container');
    newsContainer.innerHTML = '';

    if (articles.length === 0) {
        newsContainer.innerHTML = "<p>No matching articles found.</p>";
        return;
    }

    articles.forEach(article => {
        const articleElement = document.createElement('div');
        articleElement.classList.add('article');
        articleElement.innerHTML = `
            <h3>${article.title}</h3>
            <p>Category: ${article.category}</p>
            <p>Popularity Score: ${article.popularity}</p>
            <hr>
        `;
        newsContainer.appendChild(articleElement);
    });
}

// Initialize the dynamic news feed
async function initNewsFeed() {
    const articles = await fetchNewsData();
    const personalizedArticles = personalizeNews(articles);
    displayNews(personalizedArticles);
}

// Run the news feed
initNewsFeed();
