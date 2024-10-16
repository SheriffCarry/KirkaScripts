// ==UserScript==
// @name         Playercount
// @description  Shows current playercount
// @version      1
// @author       SheriffCarry
// @github       https://api.github.com/repos/SheriffCarry/KirkaScripts/contents/Userscript/Playercount.js
// ==/UserScript==

let microwave_players = "";
let foundmicowave = false;
async function playercountgetter(region) {
  let playercountnumber = 0;
  try {
    let playercount = await fetch(`https://${region}.kirka.io/matchmake/`);

    let playercountJSON = await playercount.json();

    if (microwave_players == "") {
      playercountJSON.forEach((item) => {
        let found = 0;
        let temp_microwave = "";
        Object.keys(item).forEach((key) => {
          if (typeof item[key] == "number" && item[key] < 9) {
            found++;
            temp_microwave = key;
          }
        });
        if (found == 1 && temp_microwave != "") {
          microwave_players = temp_microwave;
          foundmicowave = true;
        }
      });
    }

    playercountJSON.forEach((element) => {
      playercountnumber += element[microwave_players];
    });
  } catch {}
  return playercountnumber;
}

async function createHTMLelement(text, number, id) {
  const playcountelement = document.createElement("div");
  playcountelement.id = id;
  playcountelement.className = id;
  playcountelement.innerHTML = `<div data-v-78c6e76c="" data-v-0ae66549="">${text}: ${number}</div>`;
  return playcountelement;
}

async function playercountstart() {
  //EU
  let euplayercountnumber = await playercountgetter("eu");
  //NA
  let naplayercountnumber = await playercountgetter("na");
  //SA
  let saplayercountnumber = await playercountgetter("sa");
  //ASIA
  let asiaplayercountnumber = await playercountgetter("asia");
  //OCEANIA
  let oceplayercountnumber = await playercountgetter("oceania");
  //STAGINGNA
  //let STAGINGNAplayercountnumber = await playercountgetter("staging-na");
  let globalplayercount = 0;
  globalplayercount += Number(euplayercountnumber);
  globalplayercount += Number(naplayercountnumber);
  globalplayercount += Number(saplayercountnumber);
  globalplayercount += Number(asiaplayercountnumber);
  globalplayercount += Number(oceplayercountnumber);
  //globalplayercount += Number(STAGINGNAplayercountnumber);
  const currentlyplaying = document.createElement("div");
  currentlyplaying.id = "currentlyplaying";
  currentlyplaying.className = "currentlyplaying";
  currentlyplaying.innerHTML =
    '<div data-v-78c6e76c="" data-v-0ae66549="">CURRENTLY PLAYING:</div>';
  const playcountelement = await createHTMLelement(
    "TOTAL",
    globalplayercount,
    "playcountelement",
  );
  const playcountelementeu = await createHTMLelement(
    "EU",
    euplayercountnumber,
    "playcountelementeu",
  );
  const playcountelementna = await createHTMLelement(
    "NA",
    naplayercountnumber,
    "playcountelementna",
  );
  const playcountelementsa = await createHTMLelement(
    "SA",
    saplayercountnumber,
    "playcountelementsa",
  );
  const playcountelementasia = await createHTMLelement(
    "ASIA",
    asiaplayercountnumber,
    "playcountelementasia",
  );
  const playcountelementoce = await createHTMLelement(
    "OCE",
    oceplayercountnumber,
    "playcountelementoce",
  );
  /*
  const playcountelementSTAGINGNA = await createHTMLelement(
    "STAGING",
    STAGINGNAplayercountnumber,
    "playcountelementSTAGINGNA",
  );
  */
  
  let playerholderelement = document.createElement("div");
  playerholderelement.id = "playerholderelement";
  playerholderelement.className = "playerholderelement";
  playerholderelement.innerHTML = "";
  playerholderelement.style.display = "block";
  playerholderelement.style.position = "absolute";
  playerholderelement.style.bottom = "0";
  playerholderelement.style.zIndex = "11";
  playerholderelement.style.marginBottom = "1.4rem";

  const observer = new MutationObserver(() => {
    if (
      window.location.href == "https://kirka.io/" &&
      document.getElementById("settings-and-socicons") &&
      !document.getElementById("playerholderelement")
    ) {
      document
        .getElementsByClassName("interface text-2")[0]
        .appendChild(playerholderelement);
      document.getElementById("playerholderelement").prepend(playcountelement);
      document
        .getElementById("playerholderelement")
        .prepend(playcountelementeu);
      document
        .getElementById("playerholderelement")
        .prepend(playcountelementna);
      document
        .getElementById("playerholderelement")
        .prepend(playcountelementsa);
      document
        .getElementById("playerholderelement")
        .prepend(playcountelementasia);
      document
        .getElementById("playerholderelement")
        .prepend(playcountelementoce);
		/*
      document
        .getElementById("playerholderelement")
        .prepend(playcountelementSTAGINGNA);
		*/
      document.getElementById("playerholderelement").prepend(currentlyplaying);
    }
  });
  const config = {
    subtree: true,
    childList: true,
  };
  observer.observe(document, config);
  let playercountelementspawninginterval = setInterval(() => {
    if (document.getElementById("playerholderelement")) {
      window.clearInterval(playercountelementspawninginterval);
    } else {
      if (document.getElementsByClassName("interface text-2")[0]) {
        document
          .getElementsByClassName("interface text-2")[0]
          .appendChild(playerholderelement);
        document
          .getElementById("playerholderelement")
          .prepend(playcountelement);
        document
          .getElementById("playerholderelement")
          .prepend(playcountelementeu);
        document
          .getElementById("playerholderelement")
          .prepend(playcountelementna);
        document
          .getElementById("playerholderelement")
          .prepend(playcountelementsa);
        document
          .getElementById("playerholderelement")
          .prepend(playcountelementasia);
        document
          .getElementById("playerholderelement")
          .prepend(playcountelementoce);
		  /*
        document
          .getElementById("playerholderelement")
          .prepend(playcountelementSTAGINGNA);
		  */
        document
          .getElementById("playerholderelement")
          .prepend(currentlyplaying);
      }
    }
  });
}
playercountstart();
