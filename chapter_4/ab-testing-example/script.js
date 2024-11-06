// Sample news data (replace with a fetch from a real API or a larger dataset)
const newsData = [
    { title: "Tech Giant Unveils New AI Model", category: "technology" },
    { title: "Local Team Wins Championship", category: "sports" },
    { title: "New Climate Report Released", category: "environment" },
    // Add more news items...
];

// Function to randomly assign a user to group A or B
function assignGroup() {
    return Math.random() < 0.5 ? 'A' : 'B'; // 50/50 split
}

const userGroup = assignGroup();
const groupIndicator = document.getElementById('group-indicator');
groupIndicator.textContent = `You are in Group ${userGroup}`;

// Function to generate the news feed for Group A (simple display)
function getNewsFeedA() {
    let html = '';
    newsData.forEach(article => {
        html += `<div class="news-article"><h3>${article.title}</h3><p>${article.category}</p></div>`;
    });
    return html;
}


// Function to generate news feed for Group B (e.g., different order)
function getNewsFeedB() {
    // Create a copy to avoid modifying the original array.
    let shuffledData = [...newsData];

    // Simple shuffle algorithm (Fisher-Yates)
    for (let i = shuffledData.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledData[i], shuffledData[j]] = [shuffledData[j], shuffledData[i]];
    }

    let html = '';
    shuffledData.forEach(article => {
        html += `<div class="news-article"><h3>${article.title}</h3><p>${article.category}</p></div>`;
    });
    return html;
}

const newsFeedContainer = document.getElementById('news-feed');
if (userGroup === 'A') {
    newsFeedContainer.innerHTML = getNewsFeedA();
} else {
    newsFeedContainer.innerHTML = getNewsFeedB();
}

// Simulate tracking events (replace with real analytics integration)
function trackEvent(group, eventName, details) {
    console.log(`Group ${group}: ${eventName}`, details);
    // In a real app, send this to your analytics service (e.g., Google Analytics)
}

newsFeedContainer.addEventListener('click', (event) => {
    const articleTitle = event.target.closest('.news-article')?.querySelector('h3')?.textContent;
    if (articleTitle) {
        trackEvent(userGroup, 'articleClicked', { title: articleTitle });
    }
});
