function escapeHTML(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

const SONGS = [
    { id: 's1', title: 'Sab Tera', artist: 'Armaan Malik', album: 'Sab Tera', duration: 234, file: 'music/sample1.mp3', genre: 'Bollywood', color: '#e8115b' },
    { id: 's2', title: 'Gehra Hua', artist: 'Shashwat Sachdev, Arijit Singh', album: 'Gehra Hua', duration: 268, file: 'music/gehra-hua.mp3', genre: 'Romantic', color: '#1a1a2e' },
    { id: 's3', title: 'Khat', artist: 'Navjot Ahuja', album: 'Khat', duration: 245, file: 'music/khat.mp3', genre: 'Indie', color: '#f59e0b' },
    { id: 's4', title: 'Arz Kiya Hai', artist: 'Anuv Jain', album: 'Coke Studio Bharat', duration: 312, file: 'music/arz-kiya-hai.mp3', genre: 'Sufi', color: '#06b6d4' },
    { id: 's5', title: 'Sheesha', artist: 'Mitta Ror, Swara Verma', album: 'Sheesha', duration: 226, file: 'music/sheesha.mp3', genre: 'Punjabi', color: '#8b5cf6' },
    { id: 's6', title: 'Pavazha Malli', artist: 'Shruti Haasan, Sai Abhyankkar', album: 'Pavazha Malli', duration: 215, file: 'music/pavazha-malli.mp3', genre: 'Tamil', color: '#ec4899' },
    { id: 's7', title: 'Chaleya', artist: 'Arijit Singh, Shilpa Rao', album: 'Jawan', duration: 223, file: 'music/chaleya.mp3', genre: 'Romantic', color: '#dc2626' },
    { id: 's8', title: 'Heeriye', artist: 'Jasleen Royal, Arijit Singh', album: 'Heeriye', duration: 208, file: 'music/heeriye.mp3', genre: 'Indie Pop', color: '#d946ef' },
    { id: 's9', title: 'Satranga', artist: 'Arijit Singh', album: 'Animal', duration: 267, file: 'music/satranga.mp3', genre: 'Emotional', color: '#374151' },
    { id: 's10', title: 'Naatu Naatu', artist: 'Rahul Sipligunj, Kaala Bhairava', album: 'RRR', duration: 195, file: 'music/naatu-naatu.mp3', genre: 'Dance', color: '#f97316' },
    { id: 's11', title: 'Midnight Dreams', artist: 'Luna Wave', album: 'Nocturnal', duration: 234, file: 'music/sample1.mp3', genre: 'Pop', color: '#e8115b' },
    { id: 's12', title: 'Electric Soul', artist: 'Neon Pulse', album: 'Circuit', duration: 198, file: 'music/sample2.mp3', genre: 'Electronic', color: '#1DB954' },
    { id: 's13', title: 'Summer Breeze', artist: 'Coastal Waves', album: 'Horizon', duration: 267, file: 'music/sample3.mp3', genre: 'Chill', color: '#f59e0b' },
    { id: 's14', title: 'Urban Jungle', artist: 'City Beats', album: 'Metropolitan', duration: 215, file: 'music/sample4.mp3', genre: 'Hip-Hop', color: '#8b5cf6' },
    { id: 's15', title: 'Starlight Serenade', artist: 'Cosmic Dreams', album: 'Galaxy', duration: 312, file: 'music/sample5.mp3', genre: 'Ambient', color: '#06b6d4' },
    { id: 's16', title: 'Heartbeat', artist: 'Pulse', album: 'Vital Signs', duration: 189, file: 'music/sample6.mp3', genre: 'Pop', color: '#ef4444' },
    { id: 's17', title: 'Ocean Waves', artist: 'Coastal Waves', album: 'Horizon', duration: 245, file: 'music/sample7.mp3', genre: 'Chill', color: '#0ea5e9' },
    { id: 's18', title: 'Neon Lights', artist: 'Neon Pulse', album: 'Circuit', duration: 203, file: 'music/sample8.mp3', genre: 'Electronic', color: '#ec4899' },
    { id: 's19', title: 'Mountain High', artist: 'Altitude', album: 'Peaks', duration: 278, file: 'music/sample9.mp3', genre: 'Rock', color: '#84cc16' },
    { id: 's20', title: 'Rainy Day', artist: 'Chillhop Master', album: 'Lo-Fi Beats', duration: 226, file: 'music/sample10.mp3', genre: 'Lo-Fi', color: '#6366f1' },
];

const ALBUMS = [
    { id: 'a1', name: 'Jawan', artist: 'Arijit Singh, Shilpa Rao', color: '#dc2626', songs: ['s7'], year: 2023 },
    { id: 'a2', name: 'Animal', artist: 'Arijit Singh', color: '#374151', songs: ['s9'], year: 2023 },
    { id: 'a3', name: 'RRR', artist: 'Rahul Sipligunj, Kaala Bhairava', color: '#f97316', songs: ['s10'], year: 2022 },
    { id: 'a4', name: 'Coke Studio Bharat', artist: 'Anuv Jain', color: '#06b6d4', songs: ['s4'], year: 2024 },
    { id: 'a5', name: 'Nocturnal', artist: 'Luna Wave', color: '#e8115b', songs: ['s11'], year: 2024 },
    { id: 'a6', name: 'Circuit', artist: 'Neon Pulse', color: '#1DB954', songs: ['s12', 's18'], year: 2024 },
    { id: 'a7', name: 'Horizon', artist: 'Coastal Waves', color: '#f59e0b', songs: ['s13', 's17'], year: 2023 },
    { id: 'a8', name: 'Heeriye', artist: 'Jasleen Royal, Arijit Singh', color: '#d946ef', songs: ['s8'], year: 2023 },
    { id: 'a9', name: 'Sab Tera', artist: 'Armaan Malik', color: '#e8115b', songs: ['s1'], year: 2026 },
    { id: 'a10', name: 'Sheesha', artist: 'Mitta Ror, Swara Verma', color: '#8b5cf6', songs: ['s5'], year: 2026 },
];

const FEATURED_PLAYLISTS = [
    { id: 'fp1', name: "India's Top Hits 2026", description: 'The biggest trending songs in India right now', color: '#e8115b', songs: ['s1', 's2', 's3', 's4', 's5', 's6', 's7', 's8', 's9', 's10'] },
    { id: 'fp2', name: 'Bollywood Romance', description: 'The best romantic Bollywood tracks', color: '#dc2626', songs: ['s7', 's8', 's9', 's2'] },
    { id: 'fp3', name: 'Indie Discoveries', description: 'Fresh indie tracks you need to hear', color: '#d946ef', songs: ['s3', 's4', 's5', 's8'] },
    { id: 'fp4', name: 'Dance Anthems', description: 'High-energy dance tracks to move to', color: '#f97316', songs: ['s10', 's12', 's16'] },
    { id: 'fp5', name: 'Chill Vibes', description: 'Kick back with these relaxing tracks', color: '#0ea5e9', songs: ['s13', 's17', 's15', 's20'] },
    { id: 'fp6', name: 'Sufi & Soulful', description: 'Deep spiritual and soulful music', color: '#06b6d4', songs: ['s4', 's2', 's9'] },
];

const CATEGORIES = [
    { id: 'c1', name: 'Bollywood', color: '#e8115b' },
    { id: 'c2', name: 'Punjabi', color: '#ba5d07' },
    { id: 'c3', name: 'Indie', color: '#d946ef' },
    { id: 'c4', name: 'Romantic', color: '#dc2626' },
    { id: 'c5', name: 'Dance', color: '#f97316' },
    { id: 'c6', name: 'Sufi', color: '#06b6d4' },
    { id: 'c7', name: 'Tamil', color: '#ec4899' },
    { id: 'c8', name: 'Telugu', color: '#8b5cf6' },
    { id: 'c9', name: 'Hip-Hop', color: '#1DB954' },
    { id: 'c10', name: 'Pop', color: '#eab308' },
    { id: 'c11', name: 'Classical', color: '#1f2937' },
    { id: 'c12', name: 'Chill', color: '#0ea5e9' },
];

let uploadedSongs = [];
let uploadedSongNextId = 100;

function loadUploadedSongs() {
    try {
        const saved = localStorage.getItem('spotify-clone-uploaded');
        if (saved) {
            const data = JSON.parse(saved);
            uploadedSongs = Array.isArray(data.songs) ? data.songs : [];
            uploadedSongNextId = typeof data.nextId === 'number' ? data.nextId : 100;
        }
    } catch (e) {
        uploadedSongs = [];
        uploadedSongNextId = 100;
    }
}

function saveUploadedSongs() {
    try {
        localStorage.setItem('spotify-clone-uploaded', JSON.stringify({
            songs: uploadedSongs,
            nextId: uploadedSongNextId
        }));
    } catch (e) {}
}

function addUploadedSong(songData) {
    const id = 'u' + uploadedSongNextId++;
    const colors = ['#e8115b', '#1DB954', '#f59e0b', '#8b5cf6', '#06b6d4', '#ef4444', '#ec4899', '#f97316', '#d946ef', '#84cc16'];
    const song = {
        id,
        title: songData.title || 'Unknown Song',
        artist: songData.artist || 'Unknown Artist',
        album: songData.album || 'My Music',
        duration: songData.duration || 0,
        file: songData.url,
        genre: songData.genre || 'Other',
        color: colors[Math.floor(Math.random() * colors.length)],
        isUserUploaded: true
    };
    uploadedSongs.push(song);
    saveUploadedSongs();
    return song;
}

function removeUploadedSong(id) {
    const song = uploadedSongs.find(s => s.id === id);
    if (song && song.file && song.file.startsWith('blob:')) {
        URL.revokeObjectURL(song.file);
    }
    uploadedSongs = uploadedSongs.filter(s => s.id !== id);
    saveUploadedSongs();
}

let _allSongsCache = null;
let _allSongsCacheLength = 0;

function getAllSongs() {
    if (_allSongsCache && _allSongsCacheLength === SONGS.length + uploadedSongs.length) {
        return _allSongsCache;
    }
    _allSongsCache = [...SONGS, ...uploadedSongs];
    _allSongsCacheLength = _allSongsCache.length;
    return _allSongsCache;
}

function invalidateSongCache() {
    _allSongsCache = null;
    _allSongsCacheLength = 0;
}

function getSong(id) {
    return getAllSongs().find(s => s.id === id);
}

function getAlbum(id) {
    return ALBUMS.find(a => a.id === id);
}

function getFeaturedPlaylist(id) {
    return FEATURED_PLAYLISTS.find(p => p.id === id);
}

function getSongsByIds(ids) {
    return ids.map(id => getSong(id)).filter(Boolean);
}

function formatDuration(seconds) {
    if (!seconds || isNaN(seconds)) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
}

loadUploadedSongs();
