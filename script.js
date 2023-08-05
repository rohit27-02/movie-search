// JavaScript code for API calls and other functionalities
const apiKey = 'a97d7639'; // Replace with your actual OMDB API key

// Function to fetch movie details by IMDb ID
function getMovieDetailsById(imdbID) {

    return fetch(`https://www.omdbapi.com/?i=${imdbID}&apikey=${apiKey}`)
        .then(response => response.json())
        .catch(error => {
            console.error('Error fetching movie data:', error);
            return null;
        });
}

// Function to add a movie to a playlist
function addMovieToPlaylist(playlistType, imdbID) {
    getMovieDetailsById(imdbID)
        .then(movie => {
            if (movie) {
                const playlistName = prompt(`Enter the name of the ${playlistType} playlist you want to add this movie to:`);
                if (playlistName !== null) {
                    let playlists = JSON.parse(localStorage.getItem(`${playlistType}Playlists`)) || {};

                    if (!playlists[playlistName]) {
                        playlists[playlistName] = {}; // Initialize an object for the playlist
                    }

                    // Use IMDb ID as the key for the movie in the playlist
                    playlists[playlistName][imdbID] = movie;
                    console.log(playlists)

                    localStorage.setItem(`${playlistType}Playlists`, JSON.stringify(playlists));
                    alert(`The movie "${movie.Title}" has been added to the ${playlistType} playlist "${playlistName}"!`);
                }
            } else {
                console.error('Error fetching movie details.');
            }
        });
}


document.getElementById('searchButton').addEventListener('click', () => {
    const searchInput = document.getElementById('searchInput').value;
    // Implement OMDB API call here to search for movies based on searchInput
    // Display the search results in the #searchResults div
    fetch(`https://www.omdbapi.com/?s=${searchInput}&apikey=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            // Handle the API response here
            console.log(data);
            // Clear previous results
            document.getElementById('searchResults').innerHTML = '';

            // Check if data.Response is "True" (i.e., API call successful)
            if (data.Response === 'True') {
                // Loop through the movies and display them in the container
                data.Search.forEach(movie => {
                    const movieItem = document.createElement('div');
                    movieItem.classList.add('movie-item');
                    movieItem.innerHTML = `
                        <img src="${movie.Poster === 'N/A' ? 'placeholder.jpg' : movie.Poster}" alt="${movie.Title}">
                        <div>
                            <h3>${movie.Title}</h3>
                            <p>Year: ${movie.Year}</p>
                            <p>Type: ${movie.Type}</p>
                            <button class="add-to-public" onclick="addMovieToPlaylist('public', '${movie.imdbID}')">Add to Public Playlist</button>
                            <button class="add-to-private" onclick="addMovieToPlaylist('private', '${movie.imdbID}')">Add to Private Playlist</button>

                        </div>
                    `;
                    document.getElementById('searchResults').appendChild(movieItem);
                });
            } else {
                // Handle the case when no movies are found
                const noResults = document.createElement('p');
                noResults.textContent = 'No movies found.';
                document.getElementById('searchResults').appendChild(noResults);
            }
        })
        .catch(error => {
            console.error('Error fetching movie data:', error);
        });

});


document.getElementById('createPublicPlaylist').addEventListener('click', () => {
    const playlistInput = document.getElementById('playlistInput').value.trim();

    if (playlistInput !== '') {
        // Check if the playlist already exists
        const existingPublicPlaylists = JSON.parse(localStorage.getItem('publicPlaylists')) || [];
        if (!existingPublicPlaylists.includes(playlistInput)) {
            existingPublicPlaylists.push(playlistInput);
            localStorage.setItem('publicPlaylists', JSON.stringify(existingPublicPlaylists));
            displayPlaylists('public');
        } else {
            alert('Playlist already exists.');
        }
    } else {
        alert('Please enter a valid playlist name.');
    }
});

document.getElementById('createPrivatePlaylist').addEventListener('click', () => {
    const playlistInput = document.getElementById('playlistInput').value.trim();

    if (playlistInput !== '') {
        // Check if the playlist already exists
        const existingPrivatePlaylists = JSON.parse(localStorage.getItem('privatePlaylists')) || [];
        if (!existingPrivatePlaylists.includes(playlistInput)) {
            existingPrivatePlaylists.push(playlistInput);
            localStorage.setItem('privatePlaylists', JSON.stringify(existingPrivatePlaylists));
            displayPlaylists('private');
        } else {
            alert('Playlist already exists.');
        }
    } else {
        alert('Please enter a valid playlist name.');
    }
});

// Function to display playlists
function displayPlaylists(type) {
    const playlistsDiv = document.getElementById(`${type}Playlists`);
    playlistsDiv.innerHTML = '';
    const playlists = JSON.parse(localStorage.getItem(`${type}Playlists`)) || [];

    const playlistsHeading = document.createElement('h1');
    playlistsHeading.textContent = `${type} Playlists`;
    playlistsDiv.appendChild(playlistsHeading);


    if (playlists.length === 0) {
        const noPlaylistsMsg = document.createElement('p');
        noPlaylistsMsg.textContent = `No ${type} playlists found.`;
        playlistsDiv.appendChild(noPlaylistsMsg);
    } else {

        playlists.forEach(playlist => {
            const playlistItem = document.createElement('div');
            playlistItem.classList.add('playlist-item');
            playlistItem.textContent = playlist;
            playlistsDiv.appendChild(playlistItem);
        });
    }
}

// Display initial playlists on page load
displayPlaylists('public');
displayPlaylists('private');





