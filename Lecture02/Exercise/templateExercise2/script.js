window.onload = () => {
  const piano = document.getElementById("piano");
  const keys = Array.from(piano.children);
  keys.forEach((key) => {
    key.onclick = () => {
      const audio = new Audio(`./sounds/${key.id.split("key")[1]}.mp3`);
      audio.play();
    };
  });
  document.addEventListener("keydown", (e) => {
    switch (e.key) {
      case "a":
        new Audio("./sounds/C.mp3").play();
        break;
      case "s":
        new Audio("./sounds/D.mp3").play();
        break;
      case "d":
        new Audio("./sounds/E.mp3").play();
        break;
      case "f":
        new Audio("./sounds/F.mp3").play();
        break;
      case "g":
        new Audio("./sounds/G.mp3").play();
        break;
      case "h":
        new Audio("./sounds/A.mp3").play();
        break;
      case "j":
        new Audio("./sounds/B.mp3").play();
        break;
    }
  });
};
