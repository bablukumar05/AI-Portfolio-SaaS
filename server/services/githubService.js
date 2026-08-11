const axios = require("axios");
const logger = require("../utils/logger");

exports.fetchGitHubStats = async (username) => {
    try {
        // Fetch User Info
        const userRes = await axios.get(`https://api.github.com/users/${username}`);

        // Fetch Repos
        const reposRes = await axios.get(`https://api.github.com/users/${username}/repos?sort=updated&per_page=10`);

        const stats = {
            publicRepos: userRes.data.public_repos,
            followers: userRes.data.followers,
            topRepos: reposRes.data.map(repo => ({
                name: repo.name,
                stars: repo.stargazers_count,
                language: repo.language,
                url: repo.html_url,
                description: repo.description
            })),
            languages: {}
        };

        // Aggregating languages (simplified)
        reposRes.data.forEach(repo => {
            if (repo.language) {
                stats.languages[repo.language] = (stats.languages[repo.language] || 0) + 1;
            }
        });

        return stats;
    } catch (error) {
        logger.error(`GitHub Sync Error: ${error.message}`);
        throw new Error("Failed to sync GitHub data");
    }
};
