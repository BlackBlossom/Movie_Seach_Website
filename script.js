// Theme Toggle
function calculateSettingAsThemeString({ localStorageTheme, systemSettingDark }) {
    if (localStorageTheme !== null) {
        return localStorageTheme;
    }
    return systemSettingDark.matches ? "dark" : "light";
}

function updateButtonIcon(buttonEl, isDark) {
    buttonEl.innerHTML = isDark 
        ? '<i class="fas fa-sun"></i>'  // Sun icon for light mode
        : '<i class="fas fa-moon"></i>'; // Moon icon for dark mode
}

function updateThemeOnHtml(theme) {
    document.documentElement.setAttribute("data-theme", theme);
}

const button = document.querySelector("[data-theme-toggle]");
const localStorageTheme = localStorage.getItem("theme");
const systemSettingDark = window.matchMedia("(prefers-color-scheme: dark)");

let currentThemeSetting = calculateSettingAsThemeString({ localStorageTheme, systemSettingDark });

updateButtonIcon(button, currentThemeSetting === "dark");
updateThemeOnHtml(currentThemeSetting);

button.addEventListener("click", () => {
    const newTheme = currentThemeSetting === "dark" ? "light" : "dark";

    localStorage.setItem("theme", newTheme);
    updateButtonIcon(button, newTheme === "dark");
    updateThemeOnHtml(newTheme);

    currentThemeSetting = newTheme;
});

// Movie Search Functionality
document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');
    const movieGrid = document.getElementById('movieGrid');
    const errorDiv = document.getElementById('error');
    const searchButton = searchForm.querySelector('button');
    const buttonText = searchButton.querySelector('.button-text');
    const loader = searchButton.querySelector('.loader');

    const API_KEY = '231a231c';

    searchForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const search = searchInput.value.trim();
        if (!search) return;

        // Show loading state
        searchButton.disabled = true;
        // buttonText.classList.add('hidden');
        // loader.classList.remove('hidden');
        errorDiv.classList.add('hidden');
        movieGrid.innerHTML = '';

        try {
            const response = await fetch(`https://www.omdbapi.com/?s=${encodeURIComponent(search)}&apikey=${API_KEY}`);
            const data = await response.json();

            if (data.Response === 'True') {
                displayMovies(data.Search);
            } else {
                showError(data.Error || 'No movies found');
            }
        } catch (err) {
            showError('Failed to fetch movies');
        } finally {
            // Reset loading state
            searchButton.disabled = false;
            buttonText.classList.remove('hidden');
            loader.classList.add('hidden');
        }
    });

    function displayMovies(movies) {
        movieGrid.innerHTML = movies.map(movie => `
            <div class="movie-card" id="movieCard">
                <div class="movie-poster">
                    <img 
                        src="${movie.Poster !== 'N/A' 
                            ? movie.Poster 
                            : 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=400&q=80'
                        }" 
                        alt="${movie.Title}"
                        loading="lazy"
                    >
                </div>
                <div class="movie-info">
                    <h3 class="movie-title">${movie.Title}</h3>
                    <div class="movie-details">
                        <span>${movie.Year}</span>
                        <span>${movie.Type}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    function showError(message) {
        errorDiv.textContent = message;
        errorDiv.classList.remove('hidden');
    }
});

//Movie Card Details pop-up
