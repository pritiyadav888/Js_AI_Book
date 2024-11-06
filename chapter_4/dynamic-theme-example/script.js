// Simulate fetching user theme preference (replace with actual data fetching)
function getUserThemePreference() {
  // In a real app, fetch this from a cookie, local storage, database, etc.
  const storedTheme = localStorage.getItem('userTheme');
  if (storedTheme) {
    return storedTheme;
  } else {
    // Default theme if none is stored
    return 'light';
  }
}

// Function to apply the theme
function applyTheme(theme) {
  document.body.classList.remove('light', 'dark', 'blue'); // Remove existing themes
  document.body.classList.add(theme);
  localStorage.setItem('userTheme', theme); //Store the theme selection
}

// Get the user's theme preference
const userTheme = getUserThemePreference();

// Apply the theme on page load
applyTheme(userTheme);


// Example of adding a theme selector (optional)
const themeSelector = document.createElement('select');
themeSelector.id = 'themeSelector';
themeSelector.innerHTML = `
  <option value="light">Light</option>
  <option value="dark">Dark</option>
  <option value="blue">Blue</option>
`;
document.body.appendChild(themeSelector);


themeSelector.addEventListener('change', (event) => {
  applyTheme(event.target.value);
});
