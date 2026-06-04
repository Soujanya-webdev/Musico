const folderInput = document.getElementById("folderInput");
const audio = document.getElementById("audio");
const playlistEl = document.getElementById("playlist");

const playBtn = document.getElementById("play");
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");
const seek = document.getElementById("seek");
const nowPlaying = document.getElementById("nowPlaying");

let playlist = [];
let currentIndex = 0;
let isPlaying = false;

folderInput.addEventListener("change", (e) => {
  const files = Array.from(e.target.files);

  playlist = files
    .filter(f => f.type.startsWith("audio"))
    .map(file => ({
      name: file.name,
      url: URL.createObjectURL(file)
    }));

  renderPlaylist();
  loadSong(0);
});

function renderPlaylist() {
  playlistEl.innerHTML = "";

  playlist.forEach((track, index) => {
    const div = document.createElement("div");
    div.className = "track";
    div.innerText = track.name;

    div.onclick = () => {
      loadSong(index);
      playSong();
    };

    playlistEl.appendChild(div);
  });

  highlight();
}

function loadSong(index) {
  if (!playlist.length) return;

  currentIndex = index;
  audio.src = playlist[index].url;
  nowPlaying.innerText = playlist[index].name;

  highlight();
}

function playSong() {
  audio.play();
  isPlaying = true;
  playBtn.innerText = "Pause";
}

function pauseSong() {
  audio.pause();
  isPlaying = false;
  playBtn.innerText = "Play";
}

playBtn.onclick = () => {
  if (!playlist.length) return;

  if (isPlaying) pauseSong();
  else playSong();
};

nextBtn.onclick = () => {
  if (!playlist.length) return;
  currentIndex = (currentIndex + 1) % playlist.length;
  loadSong(currentIndex);
  playSong();
};

prevBtn.onclick = () => {
  if (!playlist.length) return;
  currentIndex =
    (currentIndex - 1 + playlist.length) % playlist.length;
  loadSong(currentIndex);
  playSong();
};

audio.addEventListener("ended", () => {
  nextBtn.click();
});

audio.addEventListener("timeupdate", () => {
  seek.value = (audio.currentTime / audio.duration) * 100 || 0;
});

seek.addEventListener("input", () => {
  audio.currentTime = (seek.value / 100) * audio.duration;
});

function highlight() {
  document.querySelectorAll(".track").forEach((el, i) => {
    el.classList.toggle("active", i === currentIndex);
  });
}
