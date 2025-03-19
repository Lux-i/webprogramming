/**
 * @return {Array<Object>} an array of keyData objects
 */
const loadNotes = async () => {
  try {
    const res = await fetch("./keys.json");
    if (!res.ok) {
      throw new Error(`Could not load keyData: status ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    alert(`Error loading notes!\n${err.message}`);
    return [];
  }
};

//globals
const songs = [];
let songLock = false;
const noteLine = document.getElementById("noteLine");
//not a global, but unnecessary to be re-initialized on every loadSong call
const songField = document.getElementById("songs");

window.onload = async () => {
  //resetButton
  const resetButton = document.getElementById("resetButton");
  resetButton.onclick = () => {
    window.location.reload();
  };

  //disable refreshing page on form-submit
  const songForm = document.getElementById("songForm");
  const handleForm = (event) => {
    event.preventDefault();
  };
  songForm.addEventListener("submit", handleForm);

  //song loading
  const songUrlInput = document.getElementById("song-url-input");
  const loadSongButton = document.getElementById("load-song");
  loadSongButton.onclick = () => {
    loadSong(songUrlInput.value);
  };

  //key pressing
  const Keys = await loadNotes();
  const piano = document.getElementById("piano");
  const keys = Array.from(piano.children);
  keys.forEach((key) => {
    key.onclick = () => {
      new Audio(`./sounds/${key.id}.mp3`).play();
      noteLine.innerHTML += ` ${key.id} `;
    };
  });
  document.addEventListener("keydown", (e) => {
    if (document.activeElement == songUrlInput) return;
    Keys.forEach((keyData) => {
      if (e.key === keyData.key) {
        new Audio(`./sounds/${keyData.note}.mp3`).play();
        noteLine.innerHTML += ` ${keyData.note} `;
      }
    });
  });
};

/**
 * @return {Boolean} if loading the song succeded or not
 */
const loadSong = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Could not load file: status ${response.status}`);
    }
    const data = await response.json();

    if (!data.songName) throw new Error("Invalid song file: missing songName");
    if (!data.notes) throw new Error("Invalid song file: missing notes array");
    if (!(data.notes instanceof Array))
      throw new Error("Invalid song file: notes is not an array");

    const newSong = document.createElement("button");
    newSong.id = songs.length;
    newSong.innerHTML = data.songName;
    songField.appendChild(newSong);
    songs.push(data);
    newSong.onclick = () => playSong(newSong.id);
    return true;
  } catch (err) {
    alert(`Error loading song!\n${err.message}`);
    return false;
  }
};

const playSong = async (songId) => {
  if (songLock) return;
  songLock = true;
  const song = songs[songId];

  for (const note of song.notes) {
    noteLine.innerHTML += ` ${note} `;
    new Audio(`./sounds/${note}.mp3`).play();
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  songLock = false;
};
