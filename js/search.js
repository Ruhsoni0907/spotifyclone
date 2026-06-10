const Search = {
    debounceTimer: null,

    init() {
        const input = UI.$('#globalSearch');
        input.addEventListener('input', (e) => {
            clearTimeout(this.debounceTimer);
            this.debounceTimer = setTimeout(() => {
                this.performSearch(e.target.value);
            }, 300);
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.performSearch(e.target.value);
            }
        });
    },

    performSearch(query) {
        query = query.trim().toLowerCase();
        if (!query) {
            App.navigate('search');
            return;
        }

        const results = this.searchAll(query);
        this.renderResults(results, query);
    },

    searchAll(query) {
        const allSongs = getAllSongs();

        const songs = allSongs.filter(s =>
            s.title.toLowerCase().includes(query) ||
            s.artist.toLowerCase().includes(query) ||
            s.album.toLowerCase().includes(query) ||
            s.genre.toLowerCase().includes(query)
        );

        const albums = ALBUMS.filter(a =>
            a.name.toLowerCase().includes(query) ||
            a.artist.toLowerCase().includes(query)
        );

        const playlists = FEATURED_PLAYLISTS.filter(p =>
            p.name.toLowerCase().includes(query) ||
            p.description.toLowerCase().includes(query)
        );

        const artists = [...new Set(allSongs.map(s => s.artist))].filter(a =>
            a.toLowerCase().includes(query)
        ).map(name => {
            const song = allSongs.find(s => s.artist === name);
            return { name, color: song ? song.color : '#333', genre: song ? song.genre : '' };
        });

        return { songs, albums, playlists, artists };
    },

    renderResults(results, query) {
        const content = UI.$('#contentArea');
        let html = `<h1 class="greeting-title">Search results for "${query}"</h1>`;

        if (results.songs.length > 0) {
            html += `<div class="section-header"><h2 class="section-title">Songs</h2></div>`;
            html += `<div class="song-table-header"><div class="song-row" style="pointer-events:none;"><div class="song-row-index">#</div><div class="song-row-info" style="margin-left:8px;">TITLE</div><div class="song-row-album">ALBUM</div><div class="song-row-duration">⏱</div></div></div>`;
            results.songs.slice(0, 10).forEach((song, i) => {
                html += UI.renderSongRow(song, i);
            });
        }

        if (results.artists.length > 0) {
            html += `<div class="section-header"><h2 class="section-title">Artists</h2></div>`;
            html += `<div class="card-grid small">`;
            results.artists.forEach(artist => {
                html += `
                    <div class="card" data-action="open-artist" data-artist="${artist.name}">
                        <div class="card-cover round" style="background:${artist.color}">
                            <span>🎤</span>
                        </div>
                        <div class="card-title">${artist.name}</div>
                        <div class="card-subtitle">Artist</div>
                    </div>
                `;
            });
            html += `</div>`;
        }

        if (results.albums.length > 0) {
            html += `<div class="section-header"><h2 class="section-title">Albums</h2></div>`;
            html += `<div class="card-grid">`;
            results.albums.forEach(album => {
                html += UI.renderCard(album, 'album');
            });
            html += `</div>`;
        }

        if (results.playlists.length > 0) {
            html += `<div class="section-header"><h2 class="section-title">Playlists</h2></div>`;
            html += `<div class="card-grid">`;
            results.playlists.forEach(playlist => {
                html += UI.renderCard(playlist, 'playlist');
            });
            html += `</div>`;
        }

        if (!results.songs.length && !results.artists.length && !results.albums.length && !results.playlists.length) {
            html += `
                <div style="text-align:center;padding:60px 0;color:var(--text-subdued);">
                    <h2 style="margin-bottom:8px;">No results found for "${query}"</h2>
                    <p>Please check your spelling or try different keywords.</p>
                </div>
            `;
        }

        content.innerHTML = html;
    },

    browseCategory(categoryId) {
        const category = CATEGORIES.find(c => c.id === categoryId);
        if (!category) return;

        const songs = getAllSongs().filter(s => s.genre.toLowerCase() === category.name.toLowerCase());
        const content = UI.$('#contentArea');
        let html = `
            <div class="playlist-header">
                <div class="playlist-header-cover" style="background:${category.color}">
                    <span style="font-size:48px">♫</span>
                </div>
                <div class="playlist-header-info">
                    <div class="playlist-header-type">Category</div>
                    <h1 class="playlist-header-name">${category.name}</h1>
                    <div class="playlist-header-desc">Browse ${category.name} tracks</div>
                </div>
            </div>
        `;

        if (songs.length > 0) {
            html += `<div class="section-header"><h2 class="section-title">Popular ${category.name} tracks</h2></div>`;
            songs.forEach((song, i) => {
                html += UI.renderSongRow(song, i);
            });
        } else {
            html += `
                <div style="text-align:center;padding:60px 0;color:var(--text-subdued);">
                    <h2>No ${category.name} songs in the library yet</h2>
                    <p>Add songs with the "${category.name}" genre to see them here.</p>
                </div>
            `;
        }

        content.innerHTML = html;
    }
};
