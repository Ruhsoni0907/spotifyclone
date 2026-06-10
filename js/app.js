const App = {
    currentView: 'home',
    history: [],
    historyIndex: -1,

    init() {
        Player.init();
        Playlist.init();
        Search.init();
        this.bindEvents();
        this.handleHash();
        window.addEventListener('hashchange', () => this.handleHash());
    },

    bindEvents() {
        document.querySelectorAll('.nav-item').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigate(link.dataset.view);
            });
        });

        document.getElementById('btnBack').addEventListener('click', () => {
            if (this.historyIndex > 0) {
                this.historyIndex--;
                window.location.hash = this.history[this.historyIndex];
            }
        });

        document.getElementById('btnForward').addEventListener('click', () => {
            if (this.historyIndex < this.history.length - 1) {
                this.historyIndex++;
                window.location.hash = this.history[this.historyIndex];
            }
        });

        document.getElementById('btnNowPlaying').addEventListener('click', () => this.toggleNowPlaying());
        document.getElementById('btnQueue').addEventListener('click', () => this.toggleNowPlaying());
        document.getElementById('btnCloseRightPanel').addEventListener('click', () => this.toggleRightPanel());
        document.getElementById('btnSidebarToggle').addEventListener('click', () => this.toggleSidebar());

        document.getElementById('btnHamburger').addEventListener('click', () => this.openMobileSidebar());
        document.getElementById('sidebarOverlay').addEventListener('click', () => this.closeMobileSidebar());
        document.getElementById('btnMobileLibrary').addEventListener('click', () => this.openMobileSidebar());

        document.querySelectorAll('.mobile-nav-item').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const view = link.dataset.view;
                if (view) this.navigate(view);
            });
        });

        document.getElementById('contentArea').addEventListener('click', (e) => {
            const actionEl = e.target.closest('[data-action]');
            if (!actionEl) return;
            const action = actionEl.dataset.action;
            const id = actionEl.dataset.id;

            switch (action) {
                case 'play-song':
                    this.handlePlaySong(actionEl);
                    break;
                case 'play-playlist':
                    this.handlePlayPlaylist(id);
                    break;
                case 'play-album':
                    this.handlePlayAlbum(id);
                    break;
                case 'open-playlist':
                    this.navigate('playlist/' + id);
                    break;
                case 'open-album':
                    this.navigate('album/' + id);
                    break;
                case 'open-artist':
                    this.handleOpenArtist(actionEl.dataset.artist);
                    break;
                case 'browse-category':
                    Search.browseCategory(id);
                    break;
                case 'remove-uploaded-song':
                    this.handleRemoveUploaded(id);
                    break;
                case 'open-uploads':
                    e.preventDefault();
                    this.navigate('uploads');
                    break;
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'INPUT') return;
            if (e.code === 'Space') {
                e.preventDefault();
                Player.togglePlay();
            }
        });
    },

    handlePlaySong(el) {
        const songId = el.dataset.id;
        const song = getSong(songId);
        if (!song) return;
        let queue = [];
        let index = 0;
        const songRows = document.querySelectorAll('#contentArea .song-row[data-action="play-song"]');
        if (songRows.length > 0) {
            queue = Array.from(songRows).map(row => getSong(row.dataset.id)).filter(Boolean);
            index = queue.findIndex(s => s.id === songId);
            if (index < 0) index = 0;
        }
        if (queue.length === 0) queue = [song];
        Player.playSong(song, queue, index);
    },

    handlePlayPlaylist(id) {
        let songs;
        if (id === 'liked') {
            songs = Playlist.likedSongs.map(getSong).filter(Boolean);
        } else {
            const playlist = Playlist.userPlaylists.find(p => p.id === id) || getFeaturedPlaylist(id);
            if (!playlist || playlist.songs.length === 0) return;
            songs = getSongsByIds(playlist.songs);
        }
        if (songs.length > 0) Player.playSong(songs[0], songs, 0);
    },

    handlePlayAlbum(id) {
        const album = getAlbum(id);
        if (!album || album.songs.length === 0) return;
        const songs = getSongsByIds(album.songs);
        Player.playSong(songs[0], songs, 0);
    },

    handleOpenArtist(artistName) {
        const songs = getAllSongs().filter(s => s.artist === artistName);
        if (songs.length === 0) return;
        const content = document.getElementById('contentArea');
        let html = `
            <div class="playlist-header">
                <div class="playlist-header-cover" style="background:${songs[0].color}">
                    <span style="font-size:64px">🎤</span>
                </div>
                <div class="playlist-header-info">
                    <div class="playlist-header-type">Artist</div>
                    <h1 class="playlist-header-name">${escapeHTML(artistName)}</h1>
                    <div class="playlist-header-meta">${songs.length} songs</div>
                </div>
            </div>
            <div class="playlist-controls">
                <button class="btn-play-lg" id="btnPlayArtist">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M7.05 3.606l13.49 7.788a.7.7 0 010 1.212L7.05 20.394A.7.7 0 016 19.788V4.212a.7.7 0 011.05-.606z"/></svg>
                </button>
            </div>
            <div class="section-header"><h2 class="section-title">Popular Songs</h2></div>
        `;
        songs.forEach((song, i) => {
            html += UI.renderSongRow(song, i);
        });
        content.innerHTML = html;
        document.getElementById('btnPlayArtist').addEventListener('click', () => {
            Player.playSong(songs[0], songs, 0);
        });
    },

    handleRemoveUploaded(songId) {
        removeUploadedSong(songId);
        invalidateSongCache();
        if (Player.currentSong && Player.currentSong.id === songId) {
            Player.audio.pause();
            Player.currentSong = null;
            Player.updatePlayerUI();
        }
        UI.toast('Song removed');
        if (this.currentView === 'uploads') this.renderUploads();
        Playlist.renderSidebar();
    },

    navigate(view) {
        this.closeMobileSidebar();
        window.location.hash = view;
    },

    handleHash() {
        const hash = window.location.hash.slice(1) || 'home';
        const parts = hash.split('/');
        const view = parts[0];
        const id = parts[1];
        this.addToHistory(hash);
        this.currentView = view;

        document.querySelectorAll('.nav-item').forEach(l => l.classList.remove('active'));
        const activeLink = document.querySelector(`.nav-item[data-view="${view}"]`);
        if (activeLink) activeLink.classList.add('active');

        document.querySelectorAll('.mobile-nav-item').forEach(l => l.classList.remove('active'));
        const activeMobileLink = document.querySelector(`.mobile-nav-item[data-view="${view}"]`);
        if (activeMobileLink) activeMobileLink.classList.add('active');

        document.getElementById('searchBarContainer').style.display = view === 'search' ? 'block' : 'none';

        document.getElementById('contentScroll').scrollTop = 0;

        switch (view) {
            case 'home': this.renderHome(); break;
            case 'search': if (!document.getElementById('globalSearch').value) this.renderSearch(); break;
            case 'playlist': Playlist.openPlaylist(id); break;
            case 'album': this.openAlbum(id); break;
            case 'uploads': this.renderUploads(); break;
            case 'category': Search.renderCategory(id); break;
            default: this.renderHome(); break;
        }

        Playlist.renderSidebar();
        this.updateNavigation();
    },

    addToHistory(hash) {
        if (this.history[this.historyIndex] === hash) return;
        this.history = this.history.slice(0, this.historyIndex + 1);
        this.history.push(hash);
        this.historyIndex = this.history.length - 1;
    },

    updateNavigation() {
        document.getElementById('btnBack').disabled = this.historyIndex <= 0;
        document.getElementById('btnForward').disabled = this.historyIndex >= this.history.length - 1;
    },

    renderHome() {
        const content = document.getElementById('contentArea');
        const hour = new Date().getHours();
        const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

        let html = `<h1 class="greeting-title">${greeting}</h1>`;

        if (uploadedSongs.length > 0) {
            html += `<div class="quick-picks-grid">`;
            html += `<div class="quick-pick-card" data-action="open-uploads">
                <div class="quick-pick-thumb" style="background:linear-gradient(135deg, #1DB954, #191414)">🎵</div>
                <span class="quick-pick-name">My Music</span>
            </div>`;
            FEATURED_PLAYLISTS.slice(0, 5).forEach(p => {
                html += UI.renderQuickPick(p);
            });
            html += `</div>`;
        } else {
            html += `<div class="quick-picks-grid">`;
            FEATURED_PLAYLISTS.slice(0, 6).forEach(p => {
                html += UI.renderQuickPick(p);
            });
            html += `</div>`;
        }

        html += `<div class="section-header"><h2 class="section-title">Made For You</h2></div>`;
        html += `<div class="card-grid">`;
        FEATURED_PLAYLISTS.forEach(p => { html += UI.renderCard(p, 'playlist'); });
        html += `</div>`;

        html += `<div class="section-header"><h2 class="section-title">New Releases</h2></div>`;
        html += `<div class="card-grid">`;
        ALBUMS.forEach(a => { html += UI.renderCard(a, 'album'); });
        html += `</div>`;

        html += `<div class="section-header"><h2 class="section-title">Browse All</h2></div>`;
        html += `<div class="category-grid">`;
        CATEGORIES.forEach(c => { html += UI.renderCategoryCard(c); });
        html += `</div>`;

        content.innerHTML = html;

        content.querySelectorAll('[data-action="open-uploads"]').forEach(el => {
            el.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.navigate('uploads');
            });
        });
    },

    renderSearch() {
        const content = document.getElementById('contentArea');
        let html = `<h1 class="greeting-title">Browse All</h1>`;
        html += `<div class="category-grid">`;
        CATEGORIES.forEach(c => { html += UI.renderCategoryCard(c); });
        html += `</div>`;
        content.innerHTML = html;
    },

    renderUploads() {
        const content = document.getElementById('contentArea');
        let html = `
            <div class="playlist-header">
                <div class="playlist-header-cover" style="background:linear-gradient(135deg, #1DB954, #191414)">
                    <span style="font-size:64px">🎵</span>
                </div>
                <div class="playlist-header-info">
                    <div class="playlist-header-type">Playlist</div>
                    <h1 class="playlist-header-name">My Music</h1>
                    <div class="playlist-header-desc">Your uploaded songs</div>
                    <div class="playlist-header-meta">${uploadedSongs.length} songs</div>
                </div>
            </div>
            <div class="playlist-controls">
                ${uploadedSongs.length > 0 ? `
                    <button class="btn-play-lg" id="btnPlayUploads">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M7.05 3.606l13.49 7.788a.7.7 0 010 1.212L7.05 20.394A.7.7 0 016 19.788V4.212a.7.7 0 011.05-.606z"/></svg>
                    </button>
                ` : ''}
                <button class="btn-upload-files" id="btnUploadMore">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 1a.75.75 0 01.75.75v5.59l1.72-1.72a.75.75 0 111.06 1.06l-3 3a.75.75 0 01-1.06 0l-3-3a.75.75 0 111.06-1.06l1.72 1.72V1.75A.75.75 0 018 1z"/><path d="M2 13.25a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75z"/></svg>
                    Add More Songs
                </button>
            </div>
        `;

        if (uploadedSongs.length > 0) {
            html += `<div class="song-table-header"><div class="song-row" style="pointer-events:none;border-bottom:1px solid rgba(255,255,255,0.1);margin-bottom:4px;"><div class="song-row-index">#</div><div class="song-row-info" style="margin-left:8px;">TITLE</div><div class="song-row-album">ALBUM</div><div class="song-row-duration">⏱</div><div class="song-row-actions"></div></div></div>`;
            uploadedSongs.forEach((song, i) => {
                const isPlaying = Player.currentSong && Player.currentSong.id === song.id;
                html += `
                    <div class="song-row ${isPlaying ? 'playing' : ''}" data-action="play-song" data-id="${song.id}">
                        <div class="song-row-index">${isPlaying ? '<div class="now-playing-bar"><span></span><span></span><span></span><span></span></div>' : (i + 1)}</div>
                        <div class="song-row-info">
                            <div class="song-row-thumb" style="background:${song.color}">♫</div>
                            <div class="song-row-text">
                                <div class="song-row-title">${escapeHTML(song.title)}</div>
                                <div class="song-row-artist">${escapeHTML(song.artist)}</div>
                            </div>
                        </div>
                        <div class="song-row-album">${escapeHTML(song.album)}</div>
                        <div class="song-row-duration">${formatDuration(song.duration)}</div>
                        <div class="song-row-actions">
                            <button class="btn-icon-sm" data-action="remove-uploaded-song" data-id="${song.id}" title="Remove">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M2.47 2.47a.75.75 0 011.06 0L8 6.94l4.47-4.47a.75.75 0 111.06 1.06L9.06 8l4.47 4.47a.75.75 0 11-1.06 1.06L8 9.06l-4.47 4.47a.75.75 0 01-1.06-1.06L6.94 8 2.47 3.53a.75.75 0 010-1.06z"/></svg>
                            </button>
                        </div>
                    </div>
                `;
            });
        } else {
            html += `
                <div class="upload-zone" id="uploadZone">
                    <div class="upload-zone-icon">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3a.75.75 0 01.75.75v7.69l2.72-2.72a.75.75 0 111.06 1.06l-4 4a.75.75 0 01-1.06 0l-4-4a.75.75 0 111.06-1.06l2.72 2.72V3.75A.75.75 0 0112 3z"/><path d="M3.75 15a.75.75 0 01.75.75v2.5a1.5 1.5 0 001.5 1.5h12a1.5 1.5 0 001.5-1.5v-2.5a.75.75 0 011.5 0v2.5a3 3 0 01-3 3H6a3 3 0 01-3-3v-2.5a.75.75 0 01.75-.75z"/></svg>
                    </div>
                    <h2>Drag & drop your songs here</h2>
                    <p>or</p>
                    <button class="btn-upload-files" id="btnUploadBrowse">Browse Files</button>
                    <p class="upload-zone-hint">Supports MP3, WAV, OGG, FLAC</p>
                </div>
            `;
        }

        content.innerHTML = html;
        document.getElementById('btnUploadMore').addEventListener('click', () => this.openUploadDialog());
        const browseBtn = document.getElementById('btnUploadBrowse');
        if (browseBtn) browseBtn.addEventListener('click', () => this.openUploadDialog());

        const zone = document.getElementById('uploadZone');
        if (zone) {
            zone.addEventListener('dragover', (e) => { e.preventDefault(); zone.classList.add('drag-over'); });
            zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
            zone.addEventListener('drop', (e) => {
                e.preventDefault();
                zone.classList.remove('drag-over');
                const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('audio/'));
                if (files.length > 0) this.processUploadedFiles(files);
            });
            zone.addEventListener('click', (e) => {
                if (e.target === zone || e.target.closest('.upload-zone-icon') || e.target.tagName === 'H2' || e.target.tagName === 'P') {
                    this.openUploadDialog();
                }
            });
        }
        if (uploadedSongs.length > 0) {
            document.getElementById('btnPlayUploads').addEventListener('click', () => {
                Player.playSong(uploadedSongs[0], uploadedSongs, 0);
            });
        }
    },

    openUploadDialog() {
        const input = document.createElement('input');
        input.type = 'file';
        input.multiple = true;
        input.accept = 'audio/*';
        input.style.display = 'none';
        let cleaned = false;
        const cleanup = () => {
            if (cleaned) return;
            cleaned = true;
            input.remove();
        };
        input.addEventListener('change', (e) => {
            const files = Array.from(e.target.files);
            if (files.length === 0) { cleanup(); return; }
            this.processUploadedFiles(files);
            cleanup();
        });
        input.addEventListener('cancel', cleanup);
        document.body.appendChild(input);
        input.click();
        setTimeout(cleanup, 60000);
    },

    async processUploadedFiles(files) {
        UI.toast(`Processing ${files.length} file(s)...`);
        let count = 0;
        for (const file of files) {
            const url = URL.createObjectURL(file);
            const duration = await this.getAudioDuration(url);
            addUploadedSong({
                title: file.name.replace(/\.[^.]+$/, ''),
                artist: 'Unknown Artist',
                album: 'My Music',
                duration: duration,
                url: url,
                genre: 'Other'
            });
            count++;
        }
        invalidateSongCache();
        UI.toast(`Added ${count} song(s)`);
        Playlist.renderSidebar();
        if (this.currentView === 'uploads') this.renderUploads();
        else if (this.currentView === 'home') this.renderHome();
    },

    getAudioDuration(url) {
        return new Promise((resolve) => {
            const audio = new Audio();
            const timeout = setTimeout(() => { resolve(0); }, 5000);
            audio.addEventListener('loadedmetadata', () => { clearTimeout(timeout); resolve(audio.duration || 0); });
            audio.addEventListener('error', () => { clearTimeout(timeout); resolve(0); });
            audio.src = url;
        });
    },

    openAlbum(id) {
        const album = getAlbum(id);
        if (!album) return;
        const songs = getSongsByIds(album.songs);
        const content = document.getElementById('contentArea');
        let html = `
            <div class="playlist-header">
                <div class="playlist-header-cover" style="background:${album.color}">
                    <span style="font-size:64px">♫</span>
                </div>
                <div class="playlist-header-info">
                    <div class="playlist-header-type">Album</div>
                    <h1 class="playlist-header-name">${escapeHTML(album.name)}</h1>
                    <div class="playlist-header-desc">${escapeHTML(album.artist)} \u2022 ${album.year}</div>
                    <div class="playlist-header-meta">${songs.length} songs \u2022 ${formatDuration(songs.reduce((a, s) => a + s.duration, 0))}</div>
                </div>
            </div>
            <div class="playlist-controls">
                <button class="btn-play-lg" id="btnPlayAlbum">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M7.05 3.606l13.49 7.788a.7.7 0 010 1.212L7.05 20.394A.7.7 0 016 19.788V4.212a.7.7 0 011.05-.606z"/></svg>
                </button>
            </div>
        `;
        if (songs.length > 0) {
            html += `<div class="song-table-header"><div class="song-row" style="pointer-events:none;border-bottom:1px solid rgba(255,255,255,0.1);margin-bottom:4px;"><div class="song-row-index">#</div><div class="song-row-info" style="margin-left:8px;">TITLE</div><div class="song-row-album">ALBUM</div><div class="song-row-duration">⏱</div></div></div>`;
            songs.forEach((song, i) => { html += UI.renderSongRow(song, i); });
        }
        content.innerHTML = html;
        document.getElementById('btnPlayAlbum').addEventListener('click', () => {
            Player.playSong(songs[0], songs, 0);
        });
    },

    isMobile() {
        return window.innerWidth <= 900;
    },

    updateGridColumns() {
        if (this.isMobile()) return;
        const rp = document.getElementById('rightPanel');
        const sidebar = document.getElementById('sidebar');
        const cols = [];
        cols.push(sidebar.classList.contains('collapsed') ? '72px' : 'var(--sidebar-w)');
        cols.push('1fr');
        if (rp.classList.contains('visible')) cols.push('var(--right-panel-w)');
        document.querySelector('.app-container').style.gridTemplateColumns = cols.join(' ');
    },

    toggleNowPlaying() {
        const rp = document.getElementById('rightPanel');
        if (this.isMobile()) {
            rp.classList.toggle('mobile-visible');
            return;
        }
        if (rp.classList.contains('visible')) {
            rp.classList.remove('visible');
        } else {
            rp.classList.add('visible');
        }
        this.updateGridColumns();
    },

    toggleRightPanel() {
        const rp = document.getElementById('rightPanel');
        rp.classList.remove('visible');
        rp.classList.remove('mobile-visible');
        if (!this.isMobile()) this.updateGridColumns();
    },

    toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        sidebar.classList.toggle('collapsed');
        const isCollapsed = sidebar.classList.contains('collapsed');
        const btn = document.getElementById('btnSidebarToggle');
        btn.title = isCollapsed ? 'Open sidebar' : 'Close sidebar';
        btn.innerHTML = isCollapsed
            ? `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="15" y1="3" x2="15" y2="21"/></svg>`
            : `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/></svg>`;
        this.updateGridColumns();
    },

    openMobileSidebar() {
        document.getElementById('sidebar').classList.add('mobile-open');
        document.getElementById('sidebarOverlay').classList.add('active');
    },

    closeMobileSidebar() {
        document.getElementById('sidebar').classList.remove('mobile-open');
        document.getElementById('sidebarOverlay').classList.remove('active');
    }
};

document.addEventListener('DOMContentLoaded', () => App.init());
