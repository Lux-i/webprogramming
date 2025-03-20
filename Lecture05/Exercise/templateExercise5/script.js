var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g = Object.create(
        (typeof Iterator === "function" ? Iterator : Object).prototype
      );
    return (
      (g.next = verb(0)),
      (g["throw"] = verb(1)),
      (g["return"] = verb(2)),
      typeof Symbol === "function" &&
        (g[Symbol.iterator] = function () {
          return this;
        }),
      g
    );
    function verb(n) {
      return function (v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError("Generator is already executing.");
      while ((g && ((g = 0), op[0] && (_ = 0)), _))
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y["return"]
                  : op[0]
                  ? y["throw"] || ((t = y["return"]) && t.call(y), 0)
                  : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
var _this = this;
var loadNotes = function () {
  return __awaiter(_this, void 0, void 0, function () {
    var res, err_1;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          _a.trys.push([0, 3, , 4]);
          return [4 /*yield*/, fetch("./keys.json")];
        case 1:
          res = _a.sent();
          if (!res.ok) {
            throw new Error(
              "Could not load keyData: status ".concat(res.status)
            );
          }
          return [4 /*yield*/, res.json()];
        case 2:
          return [2 /*return*/, _a.sent()];
        case 3:
          err_1 = _a.sent();
          alert("Error loading notes!\n".concat(err_1.message));
          return [2 /*return*/, []];
        case 4:
          return [2 /*return*/];
      }
    });
  });
};
var songs = []; //songs Array
var songLock = false;
var noteLine = document.getElementById("noteLine");
//not a global, but unnecessary to be re-initialized on every loadSong call
var songField = document.getElementById("songs");
window.onload = function () {
  return __awaiter(_this, void 0, void 0, function () {
    var resetButton,
      songForm,
      handleForm,
      songUrlInput,
      loadSongButton,
      Keys,
      piano,
      keys;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          resetButton = document.getElementById("resetButton");
          resetButton.onclick = function () {
            window.location.reload();
          };
          songForm = document.getElementById("songForm");
          handleForm = function (event) {
            event.preventDefault();
            event.reset();
          };
          songForm.addEventListener("submit", handleForm);
          songUrlInput = document.getElementById("song-url-input");
          loadSongButton = document.getElementById("load-song");
          loadSongButton.onclick = function () {
            loadSong(songUrlInput.value);
          };
          return [4 /*yield*/, loadNotes()];
        case 1:
          Keys = _a.sent();
          piano = document.getElementById("piano");
          keys = Array.from(piano.children);
          keys.forEach(function (key) {
            key.onclick = function () {
              new Audio("./sounds/".concat(key.id, ".mp3")).play();
              noteLine.innerHTML += " ".concat(key.id, " ");
            };
          });
          document.addEventListener("keydown", function (e) {
            if (document.activeElement == songUrlInput) return;
            Keys.forEach(function (keyData) {
              if (e.key === keyData.key) {
                new Audio("./sounds/".concat(keyData.note, ".mp3")).play();
                noteLine.innerHTML += " ".concat(keyData.note, " ");
              }
            });
          });
          return [2 /*return*/];
      }
    });
  });
};
/**
 * @return {Boolean} if loading the song succeded or not
 */
var loadSong = function (url) {
  return __awaiter(_this, void 0, void 0, function () {
    var response, data, newSong_1, err_2;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          _a.trys.push([0, 3, , 4]);
          return [4 /*yield*/, fetch(url)];
        case 1:
          response = _a.sent();
          if (!response.ok) {
            throw new Error(
              "Could not load file: status ".concat(response.status)
            );
          }
          return [4 /*yield*/, response.json()];
        case 2:
          data = _a.sent();
          if (!data.songName)
            throw new Error("Invalid song file: missing songName");
          if (!data.notes)
            throw new Error("Invalid song file: missing notes array");
          if (!(data.notes instanceof Array))
            throw new Error("Invalid song file: notes is not an array");
          newSong_1 = document.createElement("button");
          newSong_1.id = songs.length.toString();
          newSong_1.innerHTML = data.songName;
          songField.appendChild(newSong_1);
          songs.push(data);
          newSong_1.onclick = function () {
            return playSong(newSong_1.id);
          };
          return [2 /*return*/, true];
        case 3:
          err_2 = _a.sent();
          alert("Error loading song!\n".concat(err_2.message));
          return [2 /*return*/, false];
        case 4:
          return [2 /*return*/];
      }
    });
  });
};
var playSong = function (songId) {
  return __awaiter(_this, void 0, void 0, function () {
    var song, _i, _a, note;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          if (songLock) return [2 /*return*/];
          songLock = true;
          song = songs[songId];
          (_i = 0), (_a = song.notes);
          _b.label = 1;
        case 1:
          if (!(_i < _a.length)) return [3 /*break*/, 4];
          note = _a[_i];
          noteLine.innerHTML += " ".concat(note, " ");
          new Audio("./sounds/".concat(note, ".mp3")).play();
          return [
            4 /*yield*/,
            new Promise(function (resolve) {
              return setTimeout(resolve, 1000);
            }),
          ];
        case 2:
          _b.sent();
          _b.label = 3;
        case 3:
          _i++;
          return [3 /*break*/, 1];
        case 4:
          songLock = false;
          return [2 /*return*/];
      }
    });
  });
};
