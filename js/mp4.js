document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("searchQuery").addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            searchYouTube();
        }
    });

    // Load trending videos on page load
    loadTrendingVideos();
});

// Function to load trending videos
async function loadTrendingVideos(nextPageToken = "") {
    const apiKey = "AIzaSyCZvjOvisP6rWfj-1r4QE9LRswuH4ak4x4";
    let timestamp = new Date().getTime();
    const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&videoCategoryId=10&regionCode=IN&maxResults=10&key=${apiKey}`;



    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP Error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (data.error) {
            console.error("YouTube API Error:", data.error);
            return; // Prevent further execution
        }

        displayResults(data.items, true);
    } catch (error) {
        console.warn("Error fetching trending videos:", error);
        // Instead of alert, show error in console and continue
    }
}

// Function to search videos
let nextPageToken = ""; // Store nextPageToken globally
let currentQuery = "";  // Store the last searched query

async function searchYouTube(loadMore = false) {
    const query = document.getElementById("searchQuery").value.trim();
    if (!query) {
        alert("Please enter a search term!");
        return;
    }

    // If it's a new search, reset the page token
    if (!loadMore) {
        nextPageToken = "";
        currentQuery = query;
    }

    const apiKey = "AIzaSyCZvjOvisP6rWfj-1r4QE9LRswuH4ak4x4";
    let url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(currentQuery)}&type=video&maxResults=10&key=${apiKey}`;

    // Append nextPageToken if loading more results
    if (nextPageToken) {
        url += `&pageToken=${nextPageToken}`;
    }

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
            console.error("YouTube API Error:", data.error);
            alert("YouTube API Error! Check console for details.");
            return;
        }

        displayResults(data.items, loadMore);

        // Update the nextPageToken
        nextPageToken = data.nextPageToken || "";

        // Show or hide "Load More" button based on nextPageToken
        const loadMoreBtn = document.getElementById("loadMoreBtn");
        if (nextPageToken) {
            loadMoreBtn.style.display = "block";
        } else {
            loadMoreBtn.style.display = "none";
        }

    } catch (error) {
        console.error("Error fetching data:", error);
        alert("Failed to fetch YouTube data.");
    }
}

// Function to display video results
function displayResults(videos, loadMore = false) {
    const resultsDiv = document.getElementById("videoResults");

    // If it's a new search, clear previous results
    if (!loadMore) {
        resultsDiv.innerHTML = "";
    }

    if (videos.length === 0) {
        resultsDiv.innerHTML = "<p>No videos found.</p>";
        return;
    }

    videos.forEach(video => {
        const videoId = video.id.videoId;
        const title = video.snippet.title;
        const thumbnail = video.snippet.thumbnails.medium.url;

        const videoElement = document.createElement("div");
        videoElement.classList.add("video-item");
        videoElement.innerHTML = `
            <img src="${thumbnail}" alt="${title}" onclick="playVideo('${videoId}')">
            <p>${title}</p>
        `;

        resultsDiv.appendChild(videoElement);
    });

    // Auto increase height smoothly
    document.body.style.height = `${document.body.scrollHeight + 100}px`;
}

// Function to play video and auto-replace the current one
function playVideo(videoId) {
    const playerDiv = document.getElementById("videoPlayer");
    playerDiv.innerHTML = `
        <iframe width="100%" height="315" 
            src="https://www.youtube.com/embed/${videoId}?autoplay=1" 
            frameborder="0" allow="autoplay; encrypted-media" allowfullscreen>
        </iframe>
    `;
}

// Load more trending videos
document.getElementById("loadMoreBtn").addEventListener("click", function () {
    if (nextPageToken) {
        searchYouTube(true); // Load more songs
    }
});
