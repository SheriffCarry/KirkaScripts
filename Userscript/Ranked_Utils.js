// ==UserScript==
// @name         Ranked_Utils
// @description  Ranked Utilities
// @version      1
// @author       SheriffCarry
// @github       https://api.github.com/repos/SheriffCarry/KirkaScripts/contents/Userscript/Ranked_Utils.js
// ==/UserScript==

(function () {
  //CONFIG
  let auto_ready = false;
  let sound_on_ranked_start = true;

  //CODE
  let sound_url = "https://www.myinstants.com/media/sounds/alert.mp3";
  const audio = new Audio(sound_url);

  let starting_string = "match starting in 5";

  const observer = new MutationObserver(() => {
    if (auto_ready) {
      let element = document.querySelector("#ready-btn");
      if (element) {
        if (element.innerText == "READY") {
          element.click();
        }
      }
    }
    if (sound_on_ranked_start) {
      let element = document.getElementsByClassName("warmup-timer text-1")[0];
      if (element) {
        if (element.innerText.trim().toLowerCase().includes(starting_string)) {
          audio.play().catch((err) => {
            console.error("Error playing sound:", err);
          });
        }
      }
    }
  });

  const config = {
    subtree: true,
    childList: true,
  };

  if (auto_ready || sound_on_ranked_start) {
    observer.observe(document, config);
  }
})();
