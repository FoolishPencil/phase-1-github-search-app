document.addEventListener("DOMContentLoaded", () => {
    const searchForm = document.getElementById("search-form");
    const searchInput = document.getElementById("search-input");
    const searchResults = document.getElementById("search-results");
    const repoResults = document.getElementById("repo-results");
    const toggleButton = document.getElementById("toggle-search");

    let searchType = "user"; // Start with user search by default

    // Toggle between user and repo search
    toggleButton.addEventListener("click", () => {
        searchType = searchType === "user" ? "repo" : "user";
        toggleButton.innerText = `Search for ${searchType === "user" ? "Users" : "Repos"}`;
        searchInput.placeholder = `Enter ${searchType} name`;
    });

    // Handle form submission
    searchForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const query = searchInput.value.trim();
        if (query) {
            console.log(`Searching for ${searchType}: ${query}`);
            searchType === "user" ? searchUsers(query) : searchRepos(query);
        }
    });

    // Fetch and display users
    function searchUsers(query) {
        fetch(`https://api.github.com/search/users?q=${query}`, {
            headers: {
                Accept: "application/vnd.github.v3+json",
            },
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("User data received:", data);
                if (data.items) {
                    displayUsers(data.items);
                } else {
                    searchResults.innerHTML = "<p>No users found.</p>";
                }
            })
            .catch((error) => console.error("Error fetching users:", error));
    }

    // Display user results
    function displayUsers(users) {
        searchResults.innerHTML = ""; // Clear previous results
        repoResults.innerHTML = ""; // Clear repo results
        users.forEach((user) => {
            const userDiv = document.createElement("div");
            userDiv.innerHTML = `
          <img src="${user.avatar_url}" width="50" height="50">
          <p><strong>${user.login}</strong></p>
          <a href="${user.html_url}" target="_blank">View Profile</a>
          <button data-username="${user.login}">View Repos</button>
        `;
            searchResults.appendChild(userDiv);

            // Attach event listener for "View Repos" button
            userDiv.querySelector("button").addEventListener("click", () => {
                fetchUserRepos(user.login);
            });
        });
    }

    // Fetch and display repositories for a selected user
    function fetchUserRepos(username) {
        console.log(`Fetching repos for user: ${username}`);
        fetch(`https://api.github.com/users/${username}/repos`, {
            headers: {
                Accept: "application/vnd.github.v3+json",
            },
        })
            .then((response) => response.json())
            .then((repos) => {
                console.log("Repo data received:", repos);
                if (repos.length) {
                    displayRepos(repos);
                } else {
                    repoResults.innerHTML = "<p>No repositories found.</p>";
                }
            })
            .catch((error) => console.error("Error fetching repositories:", error));
    }

    // Display repository results
    function displayRepos(repos) {
        repoResults.innerHTML = "<h2>Repositories:</h2>";
        repos.forEach((repo) => {
            const repoDiv = document.createElement("div");
            repoDiv.innerHTML = `
          <p><a href="${repo.html_url}" target="_blank">${repo.name}</a></p>
        `;
            repoResults.appendChild(repoDiv);
        });
    }

    // Search for repos directly (bonus)
    function searchRepos(query) {
        console.log(`Searching repositories for: ${query}`);
        fetch(`https://api.github.com/search/repositories?q=${query}`, {
            headers: {
                Accept: "application/vnd.github.v3+json",
            },
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("Repo search data received:", data);
                if (data.items) {
                    displayRepos(data.items);
                } else {
                    repoResults.innerHTML = "<p>No repositories found.</p>";
                }
            })
            .catch((error) => console.error("Error fetching repositories:", error));
    }
});
