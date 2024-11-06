const movieData = {
    movies: [
        { id: 'A', title: 'Action Movie', genre: ['Action', 'Adventure'] },
        { id: 'B', title: 'Comedy Movie', genre: ['Comedy', 'Romance'] },
        { id: 'C', title: 'Sci-Fi Movie', genre: ['Sci-Fi', 'Thriller'] },
        { id: 'D', title: 'Another Action Movie', genre: ['Action', 'Thriller'] },
        { id: 'E', title: 'Romantic Comedy', genre: ['Comedy', 'Romance'] }
    ],
    user: {
        'user1': ['A', 'B'] //Movies user1 liked
    }
};

function recommendMovies(userId) {
    const likedMovies = movieData.user[userId] || [];
    if (likedMovies.length === 0) return "No movies liked yet";

    const likedGenres = new Set();
    likedMovies.forEach(movieId => {
        const movie = movieData.movies.find(m => m.id === movieId);
        if (movie) movie.genre.forEach(genre => likedGenres.add(genre));
    });

    const recommendations = [];
    movieData.movies.forEach(movie => {
        if (!likedMovies.includes(movie.id)) {
            const intersection = [...movie.genre].filter(genre => likedGenres.has(genre));
            if (intersection.length > 0) {
                recommendations.push({ id: movie.id, title: movie.title, matchingGenres: intersection });
            }
        }
    });

    //Sort recommendations by number of matching genres
    recommendations.sort((a, b) => b.matchingGenres.length - a.matchingGenres.length);

    return recommendations;
}

//Handles case where user has no data
console.log("Recommendations for user1:", recommendMovies('user1'));
console.log("Recommendations for user2:", recommendMovies('user2')); 
