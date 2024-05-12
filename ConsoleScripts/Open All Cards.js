//Card Open delay
let openingdelay = 2000; //2000 = 2.0s, make it higher to be more safe. (Recently some people have experienced issues with opening cards... Higher delay could fix it)
//Delete the row of the cards, you don't want to get opened
let cards = [
  { cardid: "723c4ba7-57b3-4ae4-b65e-75686fa77bf2", name: "Cold" },
  { cardid: "723c4ba7-57b3-4ae4-b65e-75686fa77bf1", name: "Girls band" },
  { cardid: "6281ed5a-663a-45e1-9772-962c95aa4605", name: "Party" },
  { cardid: "9cc5bd60-806f-4818-a7d4-1ba9b32bd96c", name: "Soldiers" },
  { cardid: "a5002827-97d1-4eb4-b893-af4047e0c77f", name: "Periodic" },
];

let coloroutput = {
  MYTHICAL: "c20025",
  LEGENDARY: "feaa37",
  EPIC: "cd2afc",
  RARE: "43abde",
  COMMON: "47f2a0",
  DEFAULT: "ffffff",
};

let translations = {
  name: "wnMWwWN", //fixed
  rarity: "wMWwmWN", //fixed
  wmWWNMwn: "MYTHICAL", //fixed
  MYTHICAL: "wmWWNMwn", //fixed
  wWWNmnM: "LEGENDARY", //fixed
  wnMWwWm: "EPIC", //fixxed
  wnMWwWNm: "RARE", //fixxed
  wMmWwnNW: "COMMON", //fixxed
  inventory: "wWWNn", //fixed
  openChest: "wWWNwmMn", //fixed
  openCharacterCard: "wWmWwNn", //fixed
  id: "wNwMWmn", //fixed
  item: "wnMWwWmN", //fixed
  notifications: "wmwNWMnW", //fixed
  isWon: "wMwnW", //fixed
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
    "https://github.com/SheriffCarry/KirkaScripts/blob/main/ConsoleScripts/Open%20All%20Cards.js make sure to check for code updates",
  );
}

async function fetchInventory() {
  const response = await fetch(
    `https://api2.kirka.io/api/${translations["inventory"]}`,
    {
      headers: {
        accept: "application/json",
        authorization: `Bearer ${localStorage.token}`,
      },
    },
  );
  return await response.json();
}

async function openCard(cardid) {
  let bodyobj = {};
  bodyobj[translations["id"]] = cardid;
  const response = await fetch(
    `https://api2.kirka.io/api/${translations["inventory"]}/${translations["openCharacterCard"]}`,
    {
      method: "POST",
      headers: {
        accept: "application/json",
        authorization: `Bearer ${localStorage.token}`,
        "content-type": "application/json;charset=UTF-8",
      },
      body: JSON.stringify(bodyobj),
    },
  );
  if (response.status === 400) {
    console.log("DON'T WORRY ABOUT THE ERROR");
    console.log("THE CHEST THAT IT TRIED TO OPEN IS NOT AVAILABLE ANYMORE");
    console.log("IT WILL SKIP THAT ONE AFTER 5 FAILS");
  }
  let json = await response.json();
  let returnobj = {};
  Array.from(json).forEach((item) => {
    if (item[translations["isWon"]] && item[translations["isWon"]] == true) {
      returnobj = item;
    }
  });
  return returnobj;
}

function ingameShowcase(message, rarity, name) {
  rarity = translations[rarity];
  const text = `${rarity} ${message} from: ${name}`;
  const style = `color: #${coloroutput[rarity] || coloroutput.DEFAULT}`;
  console.log(`%c${text}`, style);

  const elem = document.createElement("div");
  elem.classList.add("vue-notification-wrapper");
  elem.style =
    "transition-timing-function: ease; transition-delay: 0s; transition-property: all;";
  elem.innerHTML = `<div data-v-3462d80a="" data-v-460e7e47="" class="alert-default"><span data-v-3462d80a="" class="text" style="color:#${coloroutput[rarity] || coloroutput.DEFAULT}">${text}</span></div>`;
  elem.onclick = function () {
    try {
      elem.remove();
    } catch {}
  };
  document
    .getElementById(translations["notifications"])
    .children[0].appendChild(elem);

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

function updateCounter(counter, cardskipper) {
  counter = (counter + 1) % cards.length;
  while (cardskipper[counter] >= 5) {
    counter = (counter + 1) % cards.length;

    let check = cardskipper.reduce((acc, val) => acc + val, 0);
    if (check == cardskipper.length * 5) {
      counter = 0;
      break;
    }
  }
  return counter;
}

let cardskipper = new Array(cards.length).fill(5);
try {
  cardskipper[0] = 4;
} catch {}

(async () => {
  logCredits();
  if (!cards[0]) {
    return;
  }
  let inventory = await fetchInventory();

  inventory.forEach((item) => {
    for (let i = 0; i < cards.length; i++) {
      if (
        item[translations["item"]][translations["id"]] == cards[i]["cardid"]
      ) {
        cardskipper[i] = 0;
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
    let cardresult = await openCard(cards[counter]["cardid"]);
    if (cardresult[translations["rarity"]]) {
      if (
        Object.keys(coloroutput).includes(
          translations[cardresult[translations["rarity"]]],
        )
      ) {
        ingameShowcase(
          cardresult[translations["name"]],
          cardresult[translations["rarity"]],
          cards[counter]["name"],
        );
        if (
          translations[cardresult[translations["rarity"]]] ==
          translations["MYTHICAL"]
        ) {
          confettiAnimation();
        }
      } else {
        console.log(
          cardresult[translations["rarity"]] +
            " " +
            cardresult[translations["name"]],
        );
      }
    } else {
      cardskipper[counter]++;
    }
    counter = updateCounter(counter, cardskipper);
    let check = cardskipper.reduce((acc, val) => acc + val, 0);
    if (check == cardskipper.length * 5) {
      clearInterval(interval);
      let endelem = document.createElement("div");
      endelem.classList = "vue-notification-wrapper";
      endelem.style =
        "transition-timing-function: ease; transition-delay: 0s; transition-property: all;";
      endelem.innerHTML =
        '<div data-v-3462d80a="" data-v-460e7e47="" class="alert-default"><span data-v-3462d80a="" class="text">Finished Running</span></div>';
      endelem.onclick = function () {
        try {
          endelem.remove();
        } catch {}
      };
      document
        .getElementById(translations["notifications"])
        .children[0].appendChild(endelem);
      setTimeout(() => {
        try {
          endelem.remove();
        } catch {}
      }, 15000);
    }
  }, openingdelay);
})();
