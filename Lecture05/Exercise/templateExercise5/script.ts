interface keyData {
  key: string;
  note: string;
}

const loadNotes = async (): Promise<Array<keyData>> => {
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
interface songData {
  songName: string;
  notes: Array<string>;
}
const songs: Array<songData> = []; //songs Array
let songLock = false;
const noteLine = document.getElementById("noteLine") as HTMLElement;
//not a global, but unnecessary to be re-initialized on every loadSong call
const songField = document.getElementById("songs") as HTMLElement;

window.onload = async () => {
  //resetButton
  const resetButton = document.getElementById("resetButton") as HTMLElement;
  resetButton.onclick = () => {
    window.location.reload();
  };

  //disable refreshing page on form-submit
  const songForm = document.getElementById("songForm") as HTMLFormElement;
  const handleForm = (event) => {
    event.preventDefault();
    event.reset();
  };
  songForm.addEventListener("submit", handleForm);

  //song loading
  const songUrlInput = document.getElementById(
    "song-url-input"
  ) as HTMLInputElement;
  const loadSongButton = document.getElementById("load-song") as HTMLElement;
  loadSongButton.onclick = () => {
    loadSong(songUrlInput.value);
  };

  //key pressing
  const Keys = await loadNotes();
  const piano = document.getElementById("piano") as HTMLElement;
  const keys = Array.from(piano.children) as Array<HTMLElement>;
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
const loadSong = async (url: string): Promise<boolean> => {
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
    newSong.id = songs.length.toString();
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

const playSong = async (songId: string): Promise<void> => {
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
