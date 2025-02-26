class DataFetcher {
    constructor() {
        // No need to store access token in frontend anymore
        // Backend handles authentication
    }

    // No need for setAccessToken method anymore

    /**
     * Searches for songs on Spotify via our backend
     *
     * @private
     * @param {string} name
     * @param {number} limit
     * @returns {Song[]} an array of Song objects
     */
    async getSongInfos(name, limit = 6) {
        const response = await fetch(
            `/api/search?q=${encodeURIComponent(name)}&limit=${limit}`,
            { method: "GET" }
        );

        const result = await response.json();

        if (result.error) {
            throw new Error(result.error);
        }

        return result.tracks.items.map((song) => new Song(song));
    }

    /**
     * Searches for song lyrics via our backend
     *
     * @private
     * @param {string} artistName
     * @param {string} trackName
     * @returns {object} song lyrics object
     */
    async getSongLyrics(artistName, trackName) {
        const response = await fetch(
            `/api/lyrics?artist=${encodeURIComponent(artistName)}&track=${encodeURIComponent(trackName)}`,
            { method: "GET" }
        );

        const result = await response.json();
        
        if (result.error) {
            throw new Error(result.error);
        }
        
        return result;
    }
}