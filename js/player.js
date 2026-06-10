const Player = {
    audio: null,
    currentSong: null,
    queue: [],
    queueIndex: -1,
    isPlaying: false,
    isShuffle: false,
    repeatMode: 'off',
    volume: 0.7,
    isDraggingProgress: false,
    isDraggingVolume: false,
    simTimer: null,
    simTime: 0,
    simDuration: 0,
    usingSim: false,

    init() {
        this.audio = document.getElementById('audioPlayer');
        this.audio.volume = this.volume;
        this.setVolumeUI(this.volume);
        this.bindEvents();
    },

    bindEvents() {
        const audio = this.audio;

        audio.addEventListener('timeupdate', () => {
            if (!this.isDraggingProgress && !this.usingSim) this.updateProgress();
        });

        audio.addEventListener('loadedmetadata', () => {
            if (!this.usingSim) this.updateProgress();
        });

        audio.addEventListener('ended', () => {
            if (this.repeatMode === 'one') {
                audio.currentTime = 0;
                audio.play();
            } else {
                this.next();
            }
        });

        audio.addEventListener('play', () => {
            this.isPlaying = true;
            this.updatePlayButton();
        });

        audio.addEventListener('pause', () => {
            this.isPlaying = false;
            this.updatePlayButton();
        });

        audio.addEventListener('error', () => {
            if (this.currentSong && this.currentSong.file) {
                this.startSimulation();
            }
        });

        document.getElementById('btnPlay').addEventListener('click', () => this.togglePlay());
        document.getElementById('btnNext').addEventListener('click', () => this.next());
        document.getElementById('btnPrev').addEventListener('click', () => this.prev());
        document.getElementById('btnShuffle').addEventListener('click', () => this.toggleShuffle());
        document.getElementById('btnRepeat').addEventListener('click', () => this.toggleRepeat());

        this.setupProgressBar();
        this.setupVolumeBar();

        document.getElementById('playerLike').addEventListener('click', () => {
            if (this.currentSong) Playlist.toggleLike(this.currentSong.id);
        });

        document.getElementById('btnLikeLarge').addEventListener('click', () => {
            if (this.currentSong) Playlist.toggleLike(this.currentSong.id);
        });
    },

    startSimulation() {
        if (!this.currentSong) return;
        this.usingSim = true;
        this.simDuration = this.currentSong.duration || 180;
        this.simTime = 0;
        this.updateProgressUI(0);
        document.getElementById('timeTotal').textContent = formatDuration(this.simDuration);

        clearInterval(this.simTimer);
        this.simTimer = setInterval(() => {
            if (!this.isPlaying) return;
            this.simTime += 0.25;
            if (this.simTime >= this.simDuration) {
                this.next();
                return;
            }
            const pct = (this.simTime / this.simDuration) * 100;
            this.updateProgressUI(pct);
            document.getElementById('timeCurrent').textContent = formatDuration(this.simTime);
        }, 250);
    },

    stopSimulation() {
        clearInterval(this.simTimer);
        this.usingSim = false;
        this.simTime = 0;
    },

    setupProgressBar() {
        const bar = document.getElementById('progressBar');
        const getPercent = (e) => {
            const rect = bar.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            return Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
        };

        bar.addEventListener('mousedown', (e) => {
            if (!this.currentSong) return;
            this.isDraggingProgress = true;
            this.seekTo(getPercent(e));
            document.body.style.userSelect = 'none';
        });

        bar.addEventListener('touchstart', (e) => {
            if (!this.currentSong) return;
            this.isDraggingProgress = true;
            this.seekTo(getPercent(e));
        }, { passive: true });

        document.addEventListener('mousemove', (e) => {
            if (!this.isDraggingProgress) return;
            this.seekTo(getPercent(e));
        });

        document.addEventListener('touchmove', (e) => {
            if (!this.isDraggingProgress) return;
            this.seekTo(getPercent(e));
        }, { passive: true });

        document.addEventListener('mouseup', () => {
            if (this.isDraggingProgress) {
                this.isDraggingProgress = false;
                document.body.style.userSelect = '';
            }
        });

        document.addEventListener('touchend', () => {
            if (this.isDraggingProgress) {
                this.isDraggingProgress = false;
            }
        });
    },

    setupVolumeBar() {
        const bar = document.getElementById('volumeBar');
        const getPercent = (e) => {
            const rect = bar.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            return Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
        };

        bar.addEventListener('mousedown', (e) => {
            this.isDraggingVolume = true;
            this.setVolume(getPercent(e));
            document.body.style.userSelect = 'none';
        });

        bar.addEventListener('touchstart', (e) => {
            this.isDraggingVolume = true;
            this.setVolume(getPercent(e));
        }, { passive: true });

        document.addEventListener('mousemove', (e) => {
            if (!this.isDraggingVolume) return;
            this.setVolume(getPercent(e));
        });

        document.addEventListener('touchmove', (e) => {
            if (!this.isDraggingVolume) return;
            this.setVolume(getPercent(e));
        }, { passive: true });

        document.addEventListener('mouseup', () => {
            if (this.isDraggingVolume) {
                this.isDraggingVolume = false;
                document.body.style.userSelect = '';
            }
        });

        document.addEventListener('touchend', () => {
            if (this.isDraggingVolume) {
                this.isDraggingVolume = false;
            }
        });
    },

    seekTo(pct) {
        if (this.usingSim) {
            this.simTime = pct * this.simDuration;
            this.updateProgressUI(pct * 100);
            document.getElementById('timeCurrent').textContent = formatDuration(this.simTime);
            return;
        }
        if (!this.audio.duration || isNaN(this.audio.duration)) return;
        this.audio.currentTime = pct * this.audio.duration;
        this.updateProgressUI(pct * 100);
    },

    playSong(song, queue, index) {
        if (!song) return;

        if (queue) {
            this.queue = [...queue];
            this.queueIndex = index !== undefined ? index : 0;
        } else if (this.currentSong && this.currentSong.id === song.id) {
            this.togglePlay();
            return;
        } else {
            this.queue = [song];
            this.queueIndex = 0;
        }

        this.stopSimulation();
        this.currentSong = song;
        this.updatePlayerUI();
        this.updateRightPanel();
        this.highlightCurrent();
        App.updateNavigation();

        if (song.file) {
            this.audio.src = song.file;
            this.audio.load();
            this.audio.play().then(() => {
                this.usingSim = false;
                this.updatePlayButton();
            }).catch(() => {
                this.startSimulation();
            });
        } else {
            this.startSimulation();
        }
    },

    togglePlay() {
        if (!this.currentSong) return;
        if (this.isPlaying) {
            this.audio.pause();
            this.isPlaying = false;
        } else {
            this.audio.play().catch(() => {
                this.isPlaying = true;
                if (this.usingSim) this.startSimulation();
            });
        }
        this.updatePlayButton();
    },

    next() {
        if (this.queue.length === 0) return;
        this.stopSimulation();
        if (this.isShuffle) {
            this.queueIndex = Math.floor(Math.random() * this.queue.length);
        } else {
            this.queueIndex++;
            if (this.queueIndex >= this.queue.length) {
                if (this.repeatMode === 'all') {
                    this.queueIndex = 0;
                } else {
                    this.isPlaying = false;
                    this.updatePlayButton();
                    return;
                }
            }
        }
        this.playSong(this.queue[this.queueIndex]);
    },

    prev() {
        if (this.usingSim && this.simTime > 3) {
            this.simTime = 0;
            this.updateProgressUI(0);
            document.getElementById('timeCurrent').textContent = '0:00';
            return;
        }
        if (!this.usingSim && this.audio.currentTime > 3) {
            this.audio.currentTime = 0;
            return;
        }
        this.stopSimulation();
        if (this.queue.length === 0) return;
        this.queueIndex--;
        if (this.queueIndex < 0) {
            this.queueIndex = this.repeatMode === 'all' ? this.queue.length - 1 : 0;
        }
        this.playSong(this.queue[this.queueIndex]);
    },

    toggleShuffle() {
        this.isShuffle = !this.isShuffle;
        document.getElementById('btnShuffle').classList.toggle('active', this.isShuffle);
        UI.toast(this.isShuffle ? 'Shuffle enabled' : 'Shuffle disabled');
    },

    toggleRepeat() {
        const modes = ['off', 'all', 'one'];
        const idx = modes.indexOf(this.repeatMode);
        this.repeatMode = modes[(idx + 1) % modes.length];
        const btn = document.getElementById('btnRepeat');
        btn.classList.toggle('active', this.repeatMode !== 'off');
        if (this.repeatMode === 'one') {
            btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M0 4.75A3.75 3.75 0 013.75 1h8.5A3.75 3.75 0 0116 4.75v5a3.75 3.75 0 01-3.75 3.75H9.81l1.018 1.018a.75.75 0 11-1.06 1.06L6.939 12.75l2.829-2.828a.75.75 0 111.06 1.06L9.811 12h2.439a2.25 2.25 0 002.25-2.25v-5a2.25 2.25 0 00-2.25-2.25h-8.5A2.25 2.25 0 001.5 4.75v5A2.25 2.25 0 003.75 12H5v1.5H3.75A3.75 3.75 0 010 9.75v-5z"/><text x="8" y="10" text-anchor="middle" font-size="7" font-weight="700">1</text></svg>';
        } else {
            btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M0 4.75A3.75 3.75 0 013.75 1h8.5A3.75 3.75 0 0116 4.75v5a3.75 3.75 0 01-3.75 3.75H9.81l1.018 1.018a.75.75 0 11-1.06 1.06L6.939 12.75l2.829-2.828a.75.75 0 111.06 1.06L9.811 12h2.439a2.25 2.25 0 002.25-2.25v-5a2.25 2.25 0 00-2.25-2.25h-8.5A2.25 2.25 0 001.5 4.75v5A2.25 2.25 0 003.75 12H5v1.5H3.75A3.75 3.75 0 010 9.75v-5z"/></svg>';
        }
        const labels = { off: 'Repeat off', all: 'Repeat all', one: 'Repeat one' };
        UI.toast(labels[this.repeatMode]);
    },

    setVolume(pct) {
        this.volume = Math.max(0, Math.min(1, pct));
        this.audio.volume = this.volume;
        this.setVolumeUI(this.volume);
    },

    setVolumeUI(vol) {
        document.getElementById('volumeFill').style.width = (vol * 100) + '%';
        document.getElementById('volumeThumb').style.left = (vol * 100) + '%';
    },

    updateProgress() {
        if (!this.audio.duration || isNaN(this.audio.duration)) return;
        const pct = (this.audio.currentTime / this.audio.duration) * 100;
        this.updateProgressUI(pct);
        document.getElementById('timeCurrent').textContent = formatDuration(this.audio.currentTime);
        document.getElementById('timeTotal').textContent = formatDuration(this.audio.duration);
    },

    updateProgressUI(pct) {
        document.getElementById('progressFill').style.width = pct + '%';
        document.getElementById('progressThumb').style.left = pct + '%';
    },

    updatePlayButton() {
        document.getElementById('iconPlay').style.display = this.isPlaying ? 'none' : 'block';
        document.getElementById('iconPause').style.display = this.isPlaying ? 'block' : 'none';
    },

    updatePlayerUI() {
        if (!this.currentSong) return;
        document.getElementById('playerSongName').textContent = this.currentSong.title;
        document.getElementById('playerArtist').textContent = this.currentSong.artist;
        document.getElementById('playerThumb').innerHTML = `<div style="width:100%;height:100%;background:${this.currentSong.color};display:flex;align-items:center;justify-content:center;border-radius:4px;font-size:20px;">♫</div>`;

        const isLiked = Playlist.likedSongs.includes(this.currentSong.id);
        document.getElementById('playerLike').classList.toggle('liked', isLiked);
        document.getElementById('btnLikeLarge').classList.toggle('liked', isLiked);

        document.title = `${this.currentSong.title} \u2022 ${this.currentSong.artist} - Spotify Clone`;
    },

    updateRightPanel() {
        if (!this.currentSong) return;
        const song = this.currentSong;

        document.getElementById('rightPanelTitle').textContent = song.title;
        document.getElementById('songTitleLarge').textContent = song.title;
        document.getElementById('songArtistLarge').textContent = song.artist;

        document.getElementById('albumArtLarge').innerHTML = `<div style="width:100%;height:100%;background:${song.color};display:flex;align-items:center;justify-content:center;border-radius:8px;font-size:64px;box-shadow:0 8px 24px rgba(0,0,0,0.5);">♫</div>`;
    },

    highlightCurrent() {
        document.querySelectorAll('.song-row').forEach(row => {
            const songId = row.dataset.id;
            const isCurrent = this.currentSong && songId === this.currentSong.id;
            row.classList.toggle('playing', isCurrent);
        });
    }
};
