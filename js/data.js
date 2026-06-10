function escapeHTML(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

const SONGS = [
    { id: 's1', title: 'Midnight Dreams', artist: 'Luna Wave', album: 'Nocturnal', duration: 234, file: 'music/sample1.mp3', genre: 'Pop', color: '#e8115b' },
    { id: 's2', title: 'Electric Soul', artist: 'Neon Pulse', album: 'Circuit', duration: 198, file: 'music/sample2.mp3', genre: 'Electronic', color: '#1DB954' },
    { id: 's3', title: 'Summer Breeze', artist: 'Coastal Waves', album: 'Horizon', duration: 267, file: 'music/sample3.mp3', genre: 'Chill', color: '#f59e0b' },
    { id: 's4', title: 'Urban Jungle', artist: 'City Beats', album: 'Metropolitan', duration: 215, file: 'music/sample4.mp3', genre: 'Hip-Hop', color: '#8b5cf6' },
    { id: 's5', title: 'Starlight Serenade', artist: 'Cosmic Dreams', album: 'Galaxy', duration: 312, file: 'music/sample5.mp3', genre: 'Ambient', color: '#06b6d4' },
    { id: 's6', title: 'Heartbeat', artist: 'Pulse', album: 'Vital Signs', duration: 189, file: 'music/sample6.mp3', genre: 'Pop', color: '#ef4444' },
    { id: 's7', title: 'Ocean Waves', artist: 'Coastal Waves', album: 'Horizon', duration: 245, file: 'music/sample7.mp3', genre: 'Chill', color: '#0ea5e9' },
    { id: 's8', title: 'Neon Lights', artist: 'Neon Pulse', album: 'Circuit', duration: 203, file: 'music/sample8.mp3', genre: 'Electronic', color: '#ec4899' },
    { id: 's9', title: 'Mountain High', artist: 'Altitude', album: 'Peaks', duration: 278, file: 'music/sample9.mp3', genre: 'Rock', color: '#84cc16' },
    { id: 's10', title: 'Rainy Day', artist: 'Chillhop Master', album: 'Lo-Fi Beats', duration: 226, file: 'music/sample10.mp3', genre: 'Lo-Fi', color: '#6366f1' },
    { id: 's11', title: 'Dance Floor', artist: 'Rhythm Section', album: 'Groove Machine', duration: 195, file: 'music/sample11.mp3', genre: 'Dance', color: '#f97316' },
    { id: 's12', title: 'Whispers in the Dark', artist: 'Shadow Collective', album: 'Noir', duration: 301, file: 'music/sample12.mp3', genre: 'Alternative', color: '#374151' },
    { id: 's13', title: 'Golden Hour', artist: 'Sunset Riders', album: 'Daydream', duration: 247, file: 'music/sample13.mp3', genre: 'Indie', color: '#eab308' },
    { id: 's14', title: 'Bass Drop', artist: 'Sub Frequency', album: 'Deep End', duration: 178, file: 'music/sample14.mp3', genre: 'EDM', color: '#7c3aed' },
    { id: 's15', title: 'City Rain', artist: 'Urban Poet', album: 'Streetlights', duration: 256, file: 'music/sample15.mp3', genre: 'R&B', color: '#2563eb' },
    { id: 's16', title: 'Wildfire', artist: 'Phoenix Rising', album: 'Inferno', duration: 213, file: 'music/sample16.mp3', genre: 'Rock', color: '#dc2626' },
    { id: 's17', title: 'Floating', artist: 'Ambient Waves', album: 'Weightless', duration: 342, file: 'music/sample17.mp3', genre: 'Ambient', color: '#14b8a6' },
    { id: 's18', title: 'Friday Night', artist: 'Party Animals', album: 'Weekend', duration: 199, file: 'music/sample18.mp3', genre: 'Pop', color: '#d946ef' },
    { id: 's19', title: 'Into the Void', artist: 'Void Walker', album: 'Abyss', duration: 289, file: 'music/sample19.mp3', genre: 'Metal', color: '#1f2937' },
    { id: 's20', title: 'Paper Planes', artist: 'Origami Sound', album: 'Fold', duration: 231, file: 'music/sample20.mp3', genre: 'Indie', color: '#a3e635' },
    { id: 's21', title: 'Velvet Sunset', artist: 'Luna Wave', album: 'Nocturnal', duration: 258, file: 'music/sample21.mp3', genre: 'Pop', color: '#fb923c' },
    { id: 's22', title: 'Digital Love', artist: 'Neon Pulse', album: 'Circuit', duration: 224, file: 'music/sample22.mp3', genre: 'Electronic', color: '#a855f7' },
    { id: 's23', title: 'Free Fall', artist: 'Skydivers', album: 'Altitude', duration: 192, file: 'music/sample23.mp3', genre: 'Pop', color: '#38bdf8' },
    { id: 's24', title: 'Silk Road', artist: 'Eastern Winds', album: 'Journey', duration: 315, file: 'music/sample24.mp3', genre: 'World', color: '#fbbf24' },
];

const ALBUMS = [
    { id: 'a1', name: 'Nocturnal', artist: 'Luna Wave', color: '#e8115b', songs: ['s1', 's21'], year: 2024 },
    { id: 'a2', name: 'Circuit', artist: 'Neon Pulse', color: '#1DB954', songs: ['s2', 's8', 's22'], year: 2024 },
    { id: 'a3', name: 'Horizon', artist: 'Coastal Waves', color: '#f59e0b', songs: ['s3', 's7'], year: 2023 },
    { id: 'a4', name: 'Metropolitan', artist: 'City Beats', color: '#8b5cf6', songs: ['s4'], year: 2024 },
    { id: 'a5', name: 'Galaxy', artist: 'Cosmic Dreams', color: '#06b6d4', songs: ['s5'], year: 2023 },
    { id: 'a6', name: 'Vital Signs', artist: 'Pulse', color: '#ef4444', songs: ['s6'], year: 2024 },
    { id: 'a7', name: 'Peaks', artist: 'Altitude', color: '#84cc16', songs: ['s9'], year: 2023 },
    { id: 'a8', name: 'Lo-Fi Beats', artist: 'Chillhop Master', color: '#6366f1', songs: ['s10'], year: 2024 },
    { id: 'a9', name: 'Groove Machine', artist: 'Rhythm Section', color: '#f97316', songs: ['s11'], year: 2024 },
    { id: 'a10', name: 'Noir', artist: 'Shadow Collective', color: '#374151', songs: ['s12'], year: 2023 },
];

const FEATURED_PLAYLISTS = [
    { id: 'fp1', name: "Today's Top Hits", description: 'The biggest songs right now', color: '#e8115b', songs: ['s1', 's6', 's18', 's11', 's16'] },
    { id: 'fp2', name: 'Chill Vibes', description: 'Kick back with these relaxing tracks', color: '#0ea5e9', songs: ['s3', 's7', 's10', 's17', 's5'] },
    { id: 'fp3', name: 'Electronic Pulse', description: 'The best electronic and dance music', color: '#1DB954', songs: ['s2', 's8', 's14', 's11', 's22'] },
    { id: 'fp4', name: 'Indie Discoveries', description: 'Fresh indie tracks you need to hear', color: '#d946ef', songs: ['s13', 's20', 's24', 's15'] },
    { id: 'fp5', name: 'Rock Anthems', description: 'Powerful rock to fuel your day', color: '#dc2626', songs: ['s9', 's16', 's19'] },
    { id: 'fp6', name: 'Mood Booster', description: 'Get happy with these feel-good jams', color: '#eab308', songs: ['s18', 's1', 's13', 's6', 's23'] },
];

const CATEGORIES = [
    { id: 'c1', name: 'Pop', color: '#e8115b' },
    { id: 'c2', name: 'Hip-Hop', color: '#ba5d07' },
    { id: 'c3', name: 'Rock', color: '#dc2626' },
    { id: 'c4', name: 'Electronic', color: '#1DB954' },
    { id: 'c5', name: 'R&B', color: '#2563eb' },
    { id: 'c6', name: 'Chill', color: '#0ea5e9' },
    { id: 'c7', name: 'Workout', color: '#f97316' },
    { id: 'c8', name: 'Focus', color: '#8b5cf6' },
    { id: 'c9', name: 'Party', color: '#ec4899' },
    { id: 'c10', name: 'Sleep', color: '#1f2937' },
    { id: 'c11', name: 'Indie', color: '#a3e635' },
    { id: 'c12', name: 'Metal', color: '#374151' },
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
