let chests = [
  { chestid: "077a4cf2-7b76-4624-8be6-4a7316cf5906", name: "Golden" },
  { chestid: "ec230bdb-4b96-42c3-8bd0-65d204a153fc", name: "Ice" },
  { chestid: "71182187-109c-40c9-94f6-22dbb60d70ee", name: "Wood" },
];

let coloroutput = {
  MYTHICAL: "c20025",
  LEGENDARY: "feaa37",
  EPIC: "cd2afc",
  RARE: "43abde",
  COMMON: "47f2a0",
  DEFAULT: "ffffff",
};

function logCredits() {
  console.log(
    "%cMade by carrysheriff/SheriffCarry discord: @carrysheriff",
    "color: #000000;background-color: #FFFFFF;font-size: large;",
  );
  console.log(
    "If you only want a specific chest to be opened, just delete the chest from the array at the top of the script",
  );
  console.log(
    "https://github.com/SheriffCarry/KirkaScripts/blob/main/ConsoleScripts/Open%20All%20Chests.js make sure to check for code updates",
  );
}

async function fetchInventory() {
  const response = await fetch("https://api.kirka.io/api/inventory", {
    headers: {
      accept: "application/json",
      authorization: `Bearer ${localStorage.token}`,
    },
  });
  return await response.json();
}

async function openChest(chestId) {
  const response = await fetch("https://api.kirka.io/api/inventory/openChest", {
    method: "POST",
    headers: {
      accept: "application/json",
      authorization: `Bearer ${localStorage.token}`,
      "content-type": "application/json;charset=UTF-8",
    },
    body: JSON.stringify({ id: chestId }),
  });
  if (response.status === 400) {
    console.log("DON'T WORRY ABOUT THE ERROR");
    console.log("THE CHEST THAT IT TRIED TO OPEN IS NOT AVAILABLE ANYMORE");
    console.log("IT WILL SKIP THAT ONE AFTER 5 FAILS");
  }
  return await response.json();
}

function ingameShowcase(message, rarity, name) {
  const text = `${rarity} ${message} from: ${name}`;
  const style = `color: #${coloroutput[rarity] || coloroutput.DEFAULT}`;
  console.log(`%c${text}`, style);

  const elem = document.createElement("div");
  elem.classList.add("vue-notification-wrapper");
  elem.style =
    "transition-timing-function: ease; transition-delay: 0s; transition-property: all;";
  elem.innerHTML = `<div data-v-2667dbc5="" data-v-2e3e77fa="" class="alert-default"><span data-v-2667dbc5="" class="text" style="color:#${coloroutput[rarity] || coloroutput.DEFAULT}">${text}</span></div>`;
  elem.onclick = function () {
    try {
      elem.remove();
    } catch {}
  };
  document.getElementById("notifications").children[0].appendChild(elem);

  setTimeout(() => {
    try {
      elem.remove();
    } catch {}
  }, 5000);
}

function confettiAnimation() {
  const duration = 15 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = {
    startVelocity: 30,
    spread: 360,
    ticks: 60,
    zIndex: 0,
  };

  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  const intervalconfetti = setInterval(() => {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      clearInterval(intervalconfetti);
      return;
    }

    const particleCount = 50 * (timeLeft / duration);
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      zIndex: 99999,
    });
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      zIndex: 99999,
    });
  }, 250);
}

function updateCounter(counter, chestskipper) {
  counter = (counter + 1) % chests.length;
  while (chestskipper[counter] >= 5) {
    counter = (counter + 1) % chests.length;

    let check = chestskipper.reduce((acc, val) => acc + val, 0);
    if (check == chestskipper.length * 5) {
      counter = 0;
      break;
    }
  }
  return counter;
}

let chestskipper = new Array(chests.length).fill(5);
try {
  chestskipper[0] = 4;
} catch {}

(async () => {
  logCredits();
  if (!chests[0]) {
    return;
  }
  let inventory = await fetchInventory();

  inventory.forEach((item) => {
    for (let i = 0; i < chests.length; i++) {
      if (item.item.id == chests[i]["chestid"]) {
        chestskipper[i] = 0;
      }
    }
  });

  if (!document.getElementById("konfettijs")) {
    let script = document.createElement("script");
    script.id = "konfettijs";
    script.src =
      "https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.2/dist/confetti.browser.min.js";
    document.head.appendChild(script);
  }

  let counter = 0;
  let interval = setInterval(async () => {
    let chestresult = await openChest(chests[counter]["chestid"]);
    if (chestresult["rarity"]) {
      if (Object.keys(coloroutput).includes(chestresult.rarity)) {
        ingameShowcase(
          chestresult["name"],
          chestresult["rarity"],
          chests[counter]["name"],
        );
        if (chestresult["rarity"] == "MYTHICAL") {
          confettiAnimation();
        }
      } else {
        console.log(chestresult["rarity"] + " " + chestresult["name"]);
      }
    } else {
      chestskipper[counter]++;
    }
    counter = updateCounter(counter, chestskipper);
    let check = chestskipper.reduce((acc, val) => acc + val, 0);
    if (check == chestskipper.length * 5) {
      clearInterval(interval);
      let endelem = document.createElement("div");
      endelem.classList = "vue-notification-wrapper";
      endelem.style =
        "transition-timing-function: ease; transition-delay: 0s; transition-property: all;";
      endelem.innerHTML =
        '<div data-v-2667dbc5="" data-v-2e3e77fa="" class="alert-default"><span data-v-2667dbc5="" class="text">Finished Running</span></div>';
      endelem.onclick = function () {
        try {
          endelem.remove();
        } catch {}
      };
      document.getElementById("notifications").children[0].appendChild(endelem);
      setTimeout(() => {
        try {
          endelem.remove();
        } catch {}
      }, 15000);
    }
  }, 1500);
})();
