// Awan Player - Javascript Logic

// Track list data
const tracks = [
    {
        id: 0,
        title: "Awan Senja",
        artist: "Nadi Langit",
        file: "m1.mp3",
        cover: "cover.png"
    },
    {
        id: 1,
        title: "Langit Teduh",
        artist: "Suara Senja",
        file: "m2.mp3",
        cover: "cover.png"
    },
    {
        id: 2,
        title: "Melodi Hujan",
        artist: "Grup Hujan",
        file: "m3.mp3",
        cover: "cover.png"
    },
    {
        id: 3,
        title: "Cahaya Rembulan",
        artist: "Rembulan Cozy",
        file: "m4.mp3",
        cover: "cover.png"
    },
    {
        id: 4,
        title: "Bintang Malam",
        artist: "Melodi Bintang",
        file: "m5.mp3",
        cover: "cover.png"
    },
    {
        id: 5,
        title: "Angin Pagi",
        artist: "Breeze Acoustic",
        file: "m6.mp3",
        cover: "cover.png"
    }
];

// Audio State
let currentTrackIndex = 0;
let isPlaying = false;
let isShuffle = false;
let repeatMode = 0; // 0: No Repeat, 1: Repeat Single, 2: Repeat Playlist
let previousVolume = 0.8;

// Create audio element
const audio = new Audio();
audio.volume = 0.8;

// DOM Elements
const albumArt = document.getElementById('albumArt');
const coverContainer = document.getElementById('coverContainer');
const coverGlow = document.getElementById('coverGlow');
const currentTitle = document.getElementById('currentTitle');
const currentArtist = document.getElementById('currentArtist');
const currentFilename = document.getElementById('currentFilename');

const btnPlay = document.getElementById('btnPlay');
const playIcon = document.getElementById('playIcon');
const btnPrev = document.getElementById('btnPrev');
const btnNext = document.getElementById('btnNext');
const btnShuffle = document.getElementById('btnShuffle');
const btnRepeat = document.getElementById('btnRepeat');

const progressSlider = document.getElementById('progressSlider');
const progressBar = document.getElementById('progressBar');
const progressThumb = document.getElementById('progressThumb');
const currentTimeEl = document.getElementById('currentTime');
const totalTimeEl = document.getElementById('totalTime');

const btnMute = document.getElementById('btnMute');
const volumeIcon = document.getElementById('volumeIcon');
const volumeBar = document.getElementById('volumeBar');
const volumeInput = document.getElementById('volumeInput');
const playlistSongs = document.getElementById('playlistSongs');

// Initialize
window.addEventListener('DOMContentLoaded', () => {
    loadTrack(currentTrackIndex);
    renderPlaylist();
    setupVolumeUI(audio.volume);
    
    // Automatically load all durations in the playlist
    loadPlaylistDurations();
});

// Load Track details
function loadTrack(index) {
    const track = tracks[index];
    audio.src = track.file;
    
    // Update metadata in DOM
    currentTitle.textContent = track.title;
    currentArtist.textContent = track.artist;
    currentFilename.textContent = track.file;
    
    // Dynamic page title
    document.title = `Awan Player | ${track.title} - ${track.artist}`;
    
    // Highlight active playlist item
    updateActivePlaylistItem();
    
    // Reset progress
    resetProgressBar();
}

// Reset Progress Bar elements
function resetProgressBar() {
    progressBar.style.width = '0%';
    progressThumb.style.left = '0%';
    currentTimeEl.textContent = '00:00';
    totalTimeEl.textContent = '00:00';
}

// Update Active Playlist Item UI
function updateActivePlaylistItem() {
    const items = document.querySelectorAll('.song-item');
    items.forEach((item, index) => {
        if (index === currentTrackIndex) {
            item.classList.add('active');
            if (isPlaying) {
                item.classList.remove('paused');
            } else {
                item.classList.add('paused');
            }
        } else {
            item.classList.remove('active', 'paused');
        }
    });
}

// Render Playlist
function renderPlaylist() {
    playlistSongs.innerHTML = '';
    
    tracks.forEach((track, index) => {
        const songItem = document.createElement('div');
        songItem.className = 'song-item';
        if (index === currentTrackIndex) {
            songItem.classList.add('active');
            if (!isPlaying) songItem.classList.add('paused');
        }
        
        songItem.innerHTML = `
            <div class="song-left">
                <span class="song-index">${String(index + 1).padStart(2, '0')}</span>
                <div class="equalizer">
                    <div class="eq-bar"></div>
                    <div class="eq-bar"></div>
                    <div class="eq-bar"></div>
                </div>
                <div class="song-details">
                    <h3 class="song-title">${track.title}</h3>
                    <p class="song-artist">${track.artist} • <span style="font-family: monospace; font-size: 0.72rem;">${track.file}</span></p>
                </div>
            </div>
            <div class="song-right">
                <span class="song-duration" id="duration-${index}">--:--</span>
                <i class="fa-solid fa-play song-play-icon"></i>
            </div>
        `;
        
        // Playlist click event
        songItem.addEventListener('click', () => {
            if (currentTrackIndex === index) {
                togglePlay();
            } else {
                currentTrackIndex = index;
                loadTrack(currentTrackIndex);
                playTrack();
            }
        });
        
        playlistSongs.appendChild(songItem);
    });
}

// Format time from seconds to MM:SS
function formatTime(seconds) {
    if (isNaN(seconds)) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

// Load durations for each playlist item using dynamic temporary audio objects
function loadPlaylistDurations() {
    tracks.forEach((track, index) => {
        const tempAudio = new Audio(track.file);
        tempAudio.addEventListener('loadedmetadata', () => {
            const durationEl = document.getElementById(`duration-${index}`);
            if (durationEl) {
                durationEl.textContent = formatTime(tempAudio.duration);
            }
        });
    });
}

// Play Audio
function playTrack() {
    audio.play().then(() => {
        isPlaying = true;
        updatePlayStateUI();
    }).catch(error => {
        console.log("Gagal memutar audio: ", error);
        isPlaying = false;
        updatePlayStateUI();
    });
}

// Pause Audio
function pauseTrack() {
    audio.pause();
    isPlaying = false;
    updatePlayStateUI();
}

// Toggle Play/Pause
function togglePlay() {
    if (isPlaying) {
        pauseTrack();
    } else {
        playTrack();
    }
}

// Update Play/Pause UI elements
function updatePlayStateUI() {
    if (isPlaying) {
        playIcon.className = 'fa-solid fa-pause';
        coverContainer.classList.add('playing');
        coverGlow.classList.add('playing');
        btnPlay.setAttribute('title', 'Jeda');
    } else {
        playIcon.className = 'fa-solid fa-play';
        coverContainer.classList.remove('playing');
        coverGlow.classList.remove('playing');
        btnPlay.setAttribute('title', 'Putar');
    }
    updateActivePlaylistItem();
}

// Next Track
function nextTrack() {
    if (isShuffle) {
        // Choose random track
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * tracks.length);
        } while (newIndex === currentTrackIndex && tracks.length > 1);
        currentTrackIndex = newIndex;
    } else {
        currentTrackIndex++;
        if (currentTrackIndex >= tracks.length) {
            currentTrackIndex = 0; // wrap around
        }
    }
    
    loadTrack(currentTrackIndex);
    if (isPlaying) {
        playTrack();
    }
}

// Previous Track
function prevTrack() {
    currentTrackIndex--;
    if (currentTrackIndex < 0) {
        currentTrackIndex = tracks.length - 1; // wrap around to end
    }
    
    loadTrack(currentTrackIndex);
    if (isPlaying) {
        playTrack();
    }
}

// Audio Event: Loaded Metadata (when file is loaded)
audio.addEventListener('loadedmetadata', () => {
    totalTimeEl.textContent = formatTime(audio.duration);
});

// Audio Event: Time Update
audio.addEventListener('timeupdate', () => {
    const duration = audio.duration;
    if (duration) {
        const currentTime = audio.currentTime;
        const progressPercent = (currentTime / duration) * 100;
        
        // Update progress bar
        progressBar.style.width = `${progressPercent}%`;
        progressThumb.style.left = `${progressPercent}%`;
        
        // Update display text
        currentTimeEl.textContent = formatTime(currentTime);
    }
});

// Audio Event: Audio ended
audio.addEventListener('ended', () => {
    if (repeatMode === 1) {
        // Repeat Single
        audio.currentTime = 0;
        playTrack();
    } else if (repeatMode === 2) {
        // Repeat Playlist
        nextTrack();
        playTrack();
    } else {
        // No Repeat (normal play)
        if (currentTrackIndex === tracks.length - 1 && !isShuffle) {
            // Stop at last song
            pauseTrack();
            audio.currentTime = 0;
        } else {
            nextTrack();
            playTrack();
        }
    }
});

// Progress Bar Seeking click
progressSlider.addEventListener('click', (e) => {
    const width = progressSlider.clientWidth;
    const rect = progressSlider.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const duration = audio.duration;
    
    if (duration) {
        audio.currentTime = (clickX / width) * duration;
    }
});

// Mouse dragging on progress slider for custom seek
let isDraggingProgress = false;

progressSlider.addEventListener('mousedown', (e) => {
    isDraggingProgress = true;
    seekProgress(e);
});

window.addEventListener('mousemove', (e) => {
    if (isDraggingProgress) {
        seekProgress(e);
    }
});

window.addEventListener('mouseup', () => {
    isDraggingProgress = false;
});

// Touch controls for progress bar dragging on mobile
progressSlider.addEventListener('touchstart', (e) => {
    isDraggingProgress = true;
    seekProgress(e.touches[0]);
});

window.addEventListener('touchmove', (e) => {
    if (isDraggingProgress) {
        seekProgress(e.touches[0]);
    }
});

window.addEventListener('touchend', () => {
    isDraggingProgress = false;
});

function seekProgress(e) {
    const width = progressSlider.clientWidth;
    const rect = progressSlider.getBoundingClientRect();
    let clickX = e.clientX - rect.left;
    
    // Bounds check
    if (clickX < 0) clickX = 0;
    if (clickX > width) clickX = width;
    
    const duration = audio.duration;
    if (duration) {
        audio.currentTime = (clickX / width) * duration;
    }
}

// Volume Controls Setup
function setupVolumeUI(vol) {
    volumeInput.value = vol;
    const percent = vol * 100;
    volumeBar.style.width = `${percent}%`;
    
    // Icon updates
    if (vol === 0) {
        volumeIcon.className = 'fa-solid fa-volume-xmark';
    } else if (vol < 0.4) {
        volumeIcon.className = 'fa-solid fa-volume-low';
    } else {
        volumeIcon.className = 'fa-solid fa-volume-high';
    }
}

// Volume slider inputs
volumeInput.addEventListener('input', (e) => {
    const vol = parseFloat(e.target.value);
    audio.volume = vol;
    setupVolumeUI(vol);
    if (vol > 0) {
        previousVolume = vol;
    }
});

// Mute button logic
btnMute.addEventListener('click', () => {
    if (audio.volume > 0) {
        // Mute
        previousVolume = audio.volume;
        audio.volume = 0;
        setupVolumeUI(0);
    } else {
        // Unmute
        audio.volume = previousVolume;
        setupVolumeUI(previousVolume);
    }
});

// Play / Pause event
btnPlay.addEventListener('click', togglePlay);

// Next / Prev button events
btnNext.addEventListener('click', nextTrack);
btnPrev.addEventListener('click', prevTrack);

// Shuffle mode toggle
btnShuffle.addEventListener('click', () => {
    isShuffle = !isShuffle;
    btnShuffle.classList.toggle('active', isShuffle);
});

// Repeat mode cycle: Off (0) -> Repeat Single (1) -> Repeat Playlist (2) -> Off (0)
btnRepeat.addEventListener('click', () => {
    repeatMode = (repeatMode + 1) % 3;
    
    // Update button states
    btnRepeat.classList.remove('active');
    
    // Reset icon and classes
    const repeatIcon = btnRepeat.querySelector('i');
    
    if (repeatMode === 0) {
        btnRepeat.classList.remove('active');
        btnRepeat.setAttribute('title', 'Ulangi Lagu: Mati');
        repeatIcon.className = 'fa-solid fa-repeat';
    } else if (repeatMode === 1) {
        btnRepeat.classList.add('active');
        btnRepeat.setAttribute('title', 'Ulangi Lagu: Ulang Satu Lagu');
        repeatIcon.className = 'fa-solid fa-repeat-1'; // FontAwesome repeat-1 or custom class
        // Fallback check: if repeat-1 is not rendering, we can use repeat and style badge
        repeatIcon.className = 'fa-solid fa-repeat';
        btnRepeat.style.position = 'relative';
        // Add a small superscript 1 indicator in HTML/CSS if needed, or simply style is fine
    } else if (repeatMode === 2) {
        btnRepeat.classList.add('active');
        btnRepeat.setAttribute('title', 'Ulangi Lagu: Ulang Semua');
        repeatIcon.className = 'fa-solid fa-repeat';
    }
    
    // Add visual custom indicator for Repeat Single mode
    if (repeatMode === 1) {
        btnRepeat.classList.add('repeat-single');
    } else {
        btnRepeat.classList.remove('repeat-single');
    }
});

// Keyboard controls
document.addEventListener('keydown', (e) => {
    // Spacebar to play/pause (if active element is not progress slider/volume to prevent double trigger)
    if (e.code === 'Space' && e.target.tagName !== 'BUTTON' && e.target.tagName !== 'INPUT') {
        e.preventDefault();
        togglePlay();
    }
    // Arrow Right to seek forward 5s
    if (e.code === 'ArrowRight' && e.target.tagName !== 'INPUT') {
        e.preventDefault();
        audio.currentTime = Math.min(audio.currentTime + 5, audio.duration || 0);
    }
    // Arrow Left to seek backward 5s
    if (e.code === 'ArrowLeft' && e.target.tagName !== 'INPUT') {
        e.preventDefault();
        audio.currentTime = Math.max(audio.currentTime - 5, 0);
    }
});
