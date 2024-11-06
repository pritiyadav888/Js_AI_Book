# A/B Testing: News Feed Variations (Chapter 4 Example)

This directory contains a simple A/B testing example using JavaScript to compare different news feed presentations.

## Getting Started

1.  Navigate to this directory: `cd chapter_4/ab-testing-example`
2.  Open `index.html` in your web browser.

## How it Works

This example randomly assigns users to either Group A (control) or Group B (variant):

- **Group A (Control):** Displays news articles in their original order.
- **Group B (Variant):** Displays news articles in a shuffled order. (This is a placeholder; you can easily change to other variations).

The `group-indicator` div shows the user's assigned group. The `news-feed` div displays the news feed content. Console logs simulate event tracking. For a real-world application, replace the simulated tracking with integration to a real analytics platform. The styling is handled by `styles.css`.

## Files

- `index.html`: The main HTML file.
- `script.js`: The JavaScript code for A/B testing logic.
- `styles.css`: CSS for styling the page.

## To Make this a Complete A/B Test:

- Replace the sample `newsData` array in `script.js` with data fetched from a real news API or a more comprehensive dataset.
- Replace the simulated event tracking (`trackEvent` function) with integration into a real analytics service (e.g., Google Analytics).
- Implement more sophisticated variations for Group B to make the comparison more meaningful. Consider different article ordering algorithms or personalized filtering.
