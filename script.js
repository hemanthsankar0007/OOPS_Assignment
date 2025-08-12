// Movie recommendation system
class MovieMatcher {
    constructor() {
        this.movies = [];
        this.userPreferences = {
            name: '',
            genres: []
        };
        this.recommendedMovies = [];
        this.currentRecommendationIndex = 0;
        
        this.init();
    }

    async init() {
        await this.loadMovies();
        this.setupEventListeners();
        this.addPosterHoverEffects();
    }

    async loadMovies() {
        try {
            const response = await fetch('movies-data.json');
            const data = await response.json();
            this.movies = data.movies;
        } catch (error) {
            console.error('Error loading movie data:', error);
            // Fallback data in case JSON loading fails
            this.movies = this.getFallbackMovies();
        }
    }

    getFallbackMovies() {
        return [
            {
                title: "The Avengers",
                genres: ["Action", "Adventure", "Sci-Fi"],
                year: 2012,
                rating: 8.0,
                description: "Earth's mightiest heroes must come together and learn to fight as a team.",
                streamingLinks: [
                    { platform: "Disney+", url: "https://www.disneyplus.com" },
                    { platform: "Amazon Prime", url: "https://www.amazon.com/prime" }
                ]
            },
            {
                title: "Interstellar",
                genres: ["Drama", "Sci-Fi", "Thriller"],
                year: 2014,
                rating: 8.6,
                description: "A team of explorers travel through a wormhole in space.",
                streamingLinks: [
                    { platform: "Netflix", url: "https://www.netflix.com" },
                    { platform: "Hulu", url: "https://www.hulu.com" }
                ]
            }
        ];
    }

    setupEventListeners() {
        const form = document.getElementById('movieForm');
        const getMoreButton = document.getElementById('getMoreMovies');

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmission();
        });

        getMoreButton.addEventListener('click', () => {
            this.showMoreRecommendations();
        });

        // Add smooth scrolling to recommendations
        const submitButton = document.querySelector('.submit-btn');
        submitButton.addEventListener('click', () => {
            setTimeout(() => {
                const recommendationsSection = document.getElementById('recommendations');
                if (recommendationsSection.style.display !== 'none') {
                    recommendationsSection.scrollIntoView({ behavior: 'smooth' });
                }
            }, 500);
        });
    }

    addPosterHoverEffects() {
        const posters = document.querySelectorAll('.poster');
        posters.forEach(poster => {
            poster.addEventListener('mouseenter', () => {
                poster.style.filter = 'brightness(1.2)';
            });
            
            poster.addEventListener('mouseleave', () => {
                poster.style.filter = 'brightness(1)';
            });
        });
    }

    handleFormSubmission() {
        const userName = document.getElementById('userName').value.trim();
        const selectedGenres = this.getSelectedGenres();

        if (!userName) {
            this.showError('Please enter your name!');
            return;
        }

        if (selectedGenres.length === 0) {
            this.showError('Please select at least one genre!');
            return;
        }

        this.userPreferences = {
            name: userName,
            genres: selectedGenres
        };

        this.generateRecommendations();
        this.displayRecommendations();
    }

    getSelectedGenres() {
        const checkboxes = document.querySelectorAll('.genre-option input[type="checkbox"]:checked');
        return Array.from(checkboxes).map(checkbox => checkbox.value);
    }

    generateRecommendations() {
        // Score movies based on genre matches
        const scoredMovies = this.movies.map(movie => {
            const genreMatches = movie.genres.filter(genre => 
                this.userPreferences.genres.includes(genre)
            ).length;
            
            const genreScore = genreMatches / movie.genres.length;
            const ratingScore = movie.rating / 10;
            
            // Combined score: 70% genre match + 30% rating
            const totalScore = (genreScore * 0.7) + (ratingScore * 0.3);
            
            return {
                ...movie,
                score: totalScore,
                genreMatches: genreMatches
            };
        });

        // Sort by score and filter out movies with no genre matches
        this.recommendedMovies = scoredMovies
            .filter(movie => movie.genreMatches > 0)
            .sort((a, b) => b.score - a.score);

        // If we don't have enough recommendations, add some high-rated movies
        if (this.recommendedMovies.length < 6) {
            const additionalMovies = this.movies
                .filter(movie => !this.recommendedMovies.find(rec => rec.title === movie.title))
                .sort((a, b) => b.rating - a.rating)
                .slice(0, 6 - this.recommendedMovies.length);
            
            this.recommendedMovies.push(...additionalMovies);
        }

        this.currentRecommendationIndex = 0;
    }

    displayRecommendations() {
        const recommendationsSection = document.getElementById('recommendations');
        const recommendationsTitle = document.getElementById('recommendationsTitle');
        const movieGrid = document.getElementById('movieGrid');

        recommendationsTitle.textContent = `Hey ${this.userPreferences.name}! Here are your personalized movie recommendations:`;
        
        movieGrid.innerHTML = '';
        this.showRecommendationBatch();
        
        recommendationsSection.style.display = 'block';
    }

    showRecommendationBatch() {
        const movieGrid = document.getElementById('movieGrid');
        const batchSize = 6;
        const endIndex = Math.min(
            this.currentRecommendationIndex + batchSize, 
            this.recommendedMovies.length
        );

        for (let i = this.currentRecommendationIndex; i < endIndex; i++) {
            const movie = this.recommendedMovies[i];
            const movieCard = this.createMovieCard(movie);
            movieGrid.appendChild(movieCard);
        }

        this.currentRecommendationIndex = endIndex;

        // Hide "Get More" button if we've shown all recommendations
        const getMoreButton = document.getElementById('getMoreMovies');
        if (this.currentRecommendationIndex >= this.recommendedMovies.length) {
            getMoreButton.style.display = 'none';
        } else {
            getMoreButton.style.display = 'block';
        }
    }

    showMoreRecommendations() {
        this.showRecommendationBatch();
    }

    createMovieCard(movie) {
        const movieCard = document.createElement('div');
        movieCard.className = 'movie-card';
        
        const genreTags = movie.genres.map(genre => 
            `<span class="genre-tag">${genre}</span>`
        ).join('');

        const streamingLinks = movie.streamingLinks.map(link => 
            `<a href="${link.url}" target="_blank" class="streaming-link">${link.platform}</a>`
        ).join('');

        const matchIndicator = movie.genreMatches ? 
            `<div class="match-indicator">✨ ${movie.genreMatches} genre match${movie.genreMatches > 1 ? 'es' : ''}!</div>` : '';

        movieCard.innerHTML = `
            <h4>${movie.title}</h4>
            <div class="movie-info">
                <span class="movie-rating">⭐ ${movie.rating}</span>
                <span class="movie-year">${movie.year}</span>
            </div>
            ${matchIndicator}
            <div class="movie-genres">
                ${genreTags}
            </div>
            <p>${movie.description}</p>
            <div class="streaming-links">
                <strong>Watch on:</strong><br>
                ${streamingLinks}
            </div>
        `;

        // Add entrance animation
        movieCard.style.opacity = '0';
        movieCard.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            movieCard.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            movieCard.style.opacity = '1';
            movieCard.style.transform = 'translateY(0)';
        }, 100);

        return movieCard;
    }

    showError(message) {
        // Create or update error message
        let errorDiv = document.querySelector('.error-message');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.style.cssText = `
                background: #ff6b6b;
                color: white;
                padding: 15px;
                border-radius: 10px;
                margin: 20px 0;
                text-align: center;
                font-weight: 500;
                animation: shake 0.5s ease-in-out;
            `;
            document.querySelector('.form-container').appendChild(errorDiv);
        }

        errorDiv.textContent = message;
        
        // Remove error message after 3 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, 3000);
    }
}

// Add shake animation for error messages
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
    
    .match-indicator {
        background: linear-gradient(45deg, #10ac84, #1dd1a1);
        color: white;
        padding: 8px 12px;
        border-radius: 20px;
        font-size: 0.9rem;
        font-weight: 600;
        margin-bottom: 10px;
        text-align: center;
        box-shadow: 0 2px 10px rgba(29, 209, 161, 0.3);
    }
    
    .movie-card {
        position: relative;
        overflow: hidden;
    }
    
    .movie-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
        transition: left 0.5s;
    }
    
    .movie-card:hover::before {
        left: 100%;
    }
`;
document.head.appendChild(style);

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MovieMatcher();
});

// Add some fun interactions
document.addEventListener('DOMContentLoaded', () => {
    // Add floating animation to hero posters
    const posters = document.querySelectorAll('.poster');
    posters.forEach((poster, index) => {
        poster.style.animationDelay = `${index * 0.2}s`;
        poster.classList.add('floating');
    });
});

// Add floating animation CSS
const floatingStyle = document.createElement('style');
floatingStyle.textContent = `
    @keyframes floating {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
    }
    
    .floating {
        animation: floating 3s ease-in-out infinite;
    }
    
    .poster:nth-child(even) {
        animation-direction: reverse;
    }
`;
document.head.appendChild(floatingStyle);