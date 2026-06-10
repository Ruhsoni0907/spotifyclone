const UI = {
    $(selector) {
        return document.querySelector(selector);
    },

    $$(selector) {
        return document.querySelectorAll(selector);
    },

    renderQuickPick(playlist) {
        return `
            <div class="quick-pick-card" data-action="play-playlist" data-id="${playlist.id}">
                <div class="quick-pick-thumb" style="background:${playlist.color}">
                    <span style="font-size:22px;">♫</span>
                </div>
                <span class="quick-pick-name">${escapeHTML(playlist.name)}</span>
            </div>
        `;
    },

    renderCard(item, type) {
        const subtitle = type === 'album' ? item.artist : (item.description || item.artist);
        return `
            <div class="card" data-action="open-${type}" data-id="${item.id}">
                <div class="card-cover" style="background:${item.color}">
                    <span>♫</span>
                    <button class="card-play-btn" data-action="play-${type}" data-id="${item.id}">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M7.05 3.606l13.49 7.788a.7.7 0 010 1.212L7.05 20.394A.7.7 0 016 19.788V4.212a.7.7 0 011.05-.606z"/></svg>
                    </button>
                </div>
                <div class="card-title">${escapeHTML(item.name)}</div>
                <div class="card-subtitle">${escapeHTML(subtitle)}</div>
            </div>
        `;
    },

    renderSongRow(song, index) {
        const isPlaying = Player.currentSong && Player.currentSong.id === song.id;
        return `
            <div class="song-row ${isPlaying ? 'playing' : ''}" data-action="play-song" data-id="${song.id}">
                <div class="song-row-index">
                    ${isPlaying ? '<div class="now-playing-bar"><span></span><span></span><span></span><span></span></div>' : (index + 1)}
                </div>
                <div class="song-row-info">
                    <div class="song-row-thumb" style="background:${song.color}">♫</div>
                    <div class="song-row-text">
                        <div class="song-row-title">${escapeHTML(song.title)}</div>
                        <div class="song-row-artist">${escapeHTML(song.artist)}</div>
                    </div>
                </div>
                <div class="song-row-album">${escapeHTML(song.album)}</div>
                <div class="song-row-duration">${formatDuration(song.duration)}</div>
            </div>
        `;
    },

    renderPlaylistItem(playlist, isActive) {
        return `
            <li class="playlist-item ${isActive ? 'active' : ''}" data-action="open-playlist" data-id="${playlist.id}">
                <div class="playlist-item-thumb" style="background:${playlist.color}">♫</div>
                <div class="playlist-item-info">
                    <div class="playlist-item-name">${escapeHTML(playlist.name)}</div>
                    <div class="playlist-item-meta">${playlist.songs.length} songs</div>
                </div>
            </li>
        `;
    },

    renderCategoryCard(category) {
        return `
            <div class="category-card" style="background:${category.color}" data-action="browse-category" data-id="${category.id}">
                ${escapeHTML(category.name)}
            </div>
        `;
    },

    toast(message) {
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        container.appendChild(toast);
        setTimeout(() => {
            toast.style.animation = 'toastOut 0.3s ease forwards';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    },

    showModal(title, bodyHTML) {
        document.getElementById('modalTitle').textContent = title;
        document.getElementById('modalBody').innerHTML = bodyHTML;
        document.getElementById('modalOverlay').style.display = 'flex';
    },

    hideModal() {
        document.getElementById('modalOverlay').style.display = 'none';
    }
};
