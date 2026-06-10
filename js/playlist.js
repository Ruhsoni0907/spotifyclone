const Playlist = {
    userPlaylists: [],
    likedSongs: [],
    nextId: 1,

    init() {
        const saved = localStorage.getItem('spotify-clone-playlists');
        if (saved) {
            const data = JSON.parse(saved);
            this.userPlaylists = data.playlists || [];
            this.likedSongs = data.liked || [];
            this.nextId = data.nextId || 1;
        }

        document.getElementById('btnCreatePlaylist').addEventListener('click', () => this.showCreateModal());
        document.getElementById('btnModalClose').addEventListener('click', () => UI.hideModal());
        document.getElementById('modalOverlay').addEventListener('click', (e) => {
            if (e.target === document.getElementById('modalOverlay')) UI.hideModal();
        });

        document.querySelectorAll('.filter-chip').forEach(chip => {
            chip.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
                e.target.classList.add('active');
                this.renderSidebar();
            });
        });

        const libSearch = document.getElementById('librarySearch');
        if (libSearch) {
            libSearch.addEventListener('input', (e) => {
                this.renderSidebar(e.target.value.toLowerCase());
            });
        }

        this.renderSidebar();
    },

    save() {
        localStorage.setItem('spotify-clone-playlists', JSON.stringify({
            playlists: this.userPlaylists,
            liked: this.likedSongs,
            nextId: this.nextId
        }));
    },

    showCreateModal() {
        UI.showModal('Create Playlist', `
            <input type="text" class="modal-input" id="playlistNameInput" placeholder="My Playlist" maxlength="50" autofocus>
            <input type="text" class="modal-input" id="playlistDescInput" placeholder="Add a description (optional)" maxlength="100">
            <button class="btn-modal btn-modal-primary" id="btnSavePlaylist">Create</button>
        `);

        setTimeout(() => {
            const nameInput = document.getElementById('playlistNameInput');
            nameInput.focus();
            nameInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') document.getElementById('btnSavePlaylist').click();
            });
            document.getElementById('btnSavePlaylist').addEventListener('click', () => {
                const name = nameInput.value.trim();
                if (!name) { UI.toast('Please enter a playlist name'); return; }
                const desc = document.getElementById('playlistDescInput').value.trim();
                this.createPlaylist(name, desc);
                UI.hideModal();
            });
        }, 50);
    },

    createPlaylist(name, description) {
        const colors = ['#e8115b', '#1DB954', '#f59e0b', '#8b5cf6', '#06b6d4', '#ef4444', '#ec4899'];
        const playlist = {
            id: 'up' + this.nextId++,
            name,
            description: description || '',
            color: colors[Math.floor(Math.random() * colors.length)],
            songs: []
        };
        this.userPlaylists.unshift(playlist);
        this.save();
        this.renderSidebar();
        UI.toast(`Created "${name}"`);
        App.navigate('playlist/' + playlist.id);
    },

    deletePlaylist(id) {
        this.userPlaylists = this.userPlaylists.filter(p => p.id !== id);
        this.save();
        this.renderSidebar();
        UI.toast('Playlist deleted');
        App.navigate('home');
    },

    addToPlaylist(playlistId, songId) {
        const playlist = this.userPlaylists.find(p => p.id === playlistId);
        if (!playlist) return;
        if (!playlist.songs.includes(songId)) {
            playlist.songs.push(songId);
            this.save();
            UI.toast(`Added to "${playlist.name}"`);
        } else {
            UI.toast(`Already in "${playlist.name}"`);
        }
    },

    removeFromPlaylist(playlistId, songId) {
        const playlist = this.userPlaylists.find(p => p.id === playlistId);
        if (!playlist) return;
        playlist.songs = playlist.songs.filter(id => id !== songId);
        this.save();
        UI.toast('Removed from playlist');
    },

    toggleLike(songId) {
        const idx = this.likedSongs.indexOf(songId);
        if (idx >= 0) {
            this.likedSongs.splice(idx, 1);
            UI.toast('Removed from Liked Songs');
        } else {
            this.likedSongs.push(songId);
            UI.toast('Added to Liked Songs');
        }
        this.save();

        const isLiked = this.likedSongs.includes(songId);
        document.querySelectorAll('.btn-like-small, .btn-like-large').forEach(btn => {
            btn.classList.toggle('liked', isLiked);
        });

        this.renderSidebar();
    },

    getAllPlaylists(filter) {
        if (filter === 'liked') {
            return [{
                id: 'liked',
                name: 'Liked Songs',
                description: `${this.likedSongs.length} songs`,
                color: '#4b17a6',
                songs: this.likedSongs
            }];
        }
        return this.userPlaylists;
    },

    renderSidebar(searchQuery) {
        const activeFilter = document.querySelector('.filter-chip.active');
        if (!activeFilter) return;
        const filter = activeFilter.dataset.filter;
        const list = document.getElementById('playlistList');
        if (!list) return;
        const playlists = this.getAllPlaylists(filter);
        const filtered = searchQuery
            ? playlists.filter(p => p.name.toLowerCase().includes(searchQuery))
            : playlists;

        const currentHash = window.location.hash;
        list.innerHTML = filtered.map(p => {
            const isActive = currentHash === `#playlist/${p.id}`;
            return UI.renderPlaylistItem(p, isActive);
        }).join('');

        list.querySelectorAll('.playlist-item').forEach(item => {
            item.addEventListener('click', () => {
                App.navigate('playlist/' + item.dataset.id);
            });
        });
    },

    openPlaylist(id) {
        let playlist;
        let songs;

        if (id === 'liked') {
            playlist = { id: 'liked', name: 'Liked Songs', description: 'Your liked songs', color: '#4b17a6' };
            songs = this.likedSongs.map(getSong).filter(Boolean);
        } else {
            playlist = this.userPlaylists.find(p => p.id === id);
            if (!playlist) playlist = getFeaturedPlaylist(id);
            if (!playlist) return;
            songs = getSongsByIds(playlist.songs);
        }

        const content = document.getElementById('contentArea');
        let html = `
            <div class="playlist-header">
                <div class="playlist-header-cover" style="background:${playlist.color}">
                    <span style="font-size:64px">♫</span>
                </div>
                <div class="playlist-header-info">
                    <div class="playlist-header-type">Playlist</div>
                    <h1 class="playlist-header-name">${playlist.name}</h1>
                    ${playlist.description ? `<div class="playlist-header-desc">${playlist.description}</div>` : ''}
                    <div class="playlist-header-meta">${songs.length} songs \u2022 ${formatDuration(songs.reduce((a, s) => a + s.duration, 0))}</div>
                </div>
            </div>
            <div class="playlist-controls">
                ${songs.length > 0 ? `
                    <button class="btn-play-lg" id="btnPlayPlaylist">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M7.05 3.606l13.49 7.788a.7.7 0 010 1.212L7.05 20.394A.7.7 0 016 19.788V4.212a.7.7 0 011.05-.606z"/></svg>
                    </button>
                ` : ''}
                ${playlist.id !== 'liked' && !playlist.id.startsWith('fp') ? `
                    <button class="btn-icon-sm" id="btnDeletePlaylist" title="Delete playlist" style="background:var(--bg-surface);border:1px solid var(--bg-highlight);">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
                    </button>
                ` : ''}
            </div>
        `;

        if (songs.length > 0) {
            html += `<div class="song-row" style="pointer-events:none;border-bottom:1px solid rgba(255,255,255,0.1);margin-bottom:4px;"><div class="song-row-index">#</div><div class="song-row-info" style="margin-left:8px;">TITLE</div><div class="song-row-album">ALBUM</div><div class="song-row-duration">\u23F1</div></div>`;
            songs.forEach((song, i) => {
                html += UI.renderSongRow(song, i);
            });
        } else {
            html += `
                <div style="text-align:center;padding:60px 0;color:var(--text-subdued);">
                    <h2 style="margin-bottom:8px;">This playlist is empty</h2>
                    <p>Search for songs to add to this playlist.</p>
                </div>
            `;
        }

        content.innerHTML = html;

        const deleteBtn = document.getElementById('btnDeletePlaylist');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => {
                if (confirm(`Delete "${playlist.name}"?`)) {
                    this.deletePlaylist(id);
                }
            });
        }

        const playBtn = document.getElementById('btnPlayPlaylist');
        if (playBtn && songs.length > 0) {
            playBtn.addEventListener('click', () => {
                Player.playSong(songs[0], songs, 0);
            });
        }
    },

    showAddToPlaylistModal(songId) {
        const playlists = this.userPlaylists;
        if (playlists.length === 0) {
            UI.toast('Create a playlist first');
            return;
        }

        let html = playlists.map(p => `
            <div class="playlist-item" data-playlist-id="${p.id}" style="cursor:pointer;">
                <div class="playlist-item-thumb" style="background:${p.color}">♫</div>
                <div class="playlist-item-info">
                    <div class="playlist-item-name">${p.name}</div>
                    <div class="playlist-item-meta">${p.songs.length} songs</div>
                </div>
            </div>
        `).join('');

        UI.showModal('Add to playlist', html);

        setTimeout(() => {
            document.querySelectorAll('.modal .playlist-item').forEach(item => {
                item.addEventListener('click', () => {
                    this.addToPlaylist(item.dataset.playlistId, songId);
                    UI.hideModal();
                });
            });
        }, 50);
    }
};
