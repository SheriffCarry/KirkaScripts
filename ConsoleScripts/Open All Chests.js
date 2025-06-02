(async () => {
  let git_base = "SheriffCarry";
  //Chest Open delay
  let openingdelay = 2000; //2000 = 2.0s, make it higher to be more safe. (Recently some people have experienced issues with opening chests... Higher delay could fix it)
  let chests;
  //Delete the row of the chest, you don't want to get opened
  try {
    chests = customchestlist;
  } catch {
    chests = [
      {
        chestid: "077a4cf2-7b76-4624-8be6-4a7316cf5906",
        name: "Golden",
      },
      {
        chestid: "ec230bdb-4b96-42c3-8bd0-65d204a153fc",
        name: "Ice",
      },
      {
        chestid: "71182187-109c-40c9-94f6-22dbb60d70ee",
        name: "Wood",
      },
    ];
  }

  let coloroutput = {
    PARANORMAL: "000000",
    MYTHICAL: "c20025",
    LEGENDARY: "feaa37",
    EPIC: "cd2afc",
    RARE: "43abde",
    COMMON: "47f2a0",
    DEFAULT: "ffffff",
  };

  let translations_req = await fetch(
    `https://raw.githubusercontent.com/${git_base}/KirkaScripts/main/ConsoleScripts/microwaves.json`,
  );
  let translations = await translations_req.json();

  //This Part reverses my translations
  Object.keys(translations).forEach((item) => {
    let translationItem = translations[item];
    translations[translationItem] = item;
  });

  //This code logs credits
  function logCredits() {
    console.log(
      "%cMade by carrysheriff/SheriffCarry discord: @carrysheriff",
      "color: #000000;background-color: #FFFFFF;font-size: large;",
    );
    console.log(
      "If you only want a specific chest to be opened, just delete the chest from the array at the top of the script",
    );
    console.log(
      `https://github.com/${git_base}/KirkaScripts/blob/main/ConsoleScripts/OpenAllChests_live_updating.js this code is live updating`,
    );
  }

  //This code fetches and returns the inventory
  async function fetchInventory() {
    let response = await fetch(
      `https://api2.kirka.io/api/${translations["inventory"]}`,
      {
        headers: {
          accept: "application/json",
          authorization: `Bearer ${localStorage.token}`,
        },
      },
    );
    let json = await response.json();
    return json;
  }

  let bvl = [];

  async function setBVL() {
    let response = await fetch(
      "https://opensheet.elk.sh/1tzHjKpu2gYlHoCePjp6bFbKBGvZpwDjiRzT9ZUfNwbY/Alphabetical",
    );
    bvl = await response.json();
    return;
  }

  function rarity_backup(spreadsheet, namefield, rarityfield, skinname) {
    let found = false;
    let rarity = "Unknown-Rarity";
    spreadsheet.forEach((listitem) => {
      if (listitem && listitem[namefield] && listitem[rarityfield]) {
        if (
          found == false &&
          listitem[namefield] == skinname &&
          Object.keys(coloroutput).includes(listitem[rarityfield].toUpperCase())
        ) {
          found = true;
          rarity = listitem[rarityfield];
        }
      }
    });
    return rarity;
  }

  //this code opens chests
  async function openChest(chestId) {
    let bodyobj = {};
    bodyobj[translations["id"]] = chestId;
    const response = await fetch(
      `https://api2.kirka.io/api/${translations["inventory"]}/${translations["openChest"]}`,
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
    return await response.json();
  }

  function ingameShowcase_messages(message, displaylength) {
    let elem = document.createElement("div");
    elem.classList = "vue-notification-wrapper";
    elem.style =
      "transition-timing-function: ease; transition-delay: 0s; transition-property: all;";
    elem.innerHTML = `<div data-v-3462d80a="" data-v-460e7e47="" class="alert-default"><span data-v-3462d80a="" class="text">${message}</span></div>`;
    elem.onclick = function () {
      try {
        elem.remove();
      } catch {}
    };
    document
      .getElementsByClassName("vue-notification-group")[0]
      .children[0].appendChild(elem);
    setTimeout(() => {
      try {
        elem.remove();
      } catch {}
    }, displaylength);
  }

  function ingameShowcase_end() {
    let end_elem = document.createElement("div");
    end_elem.classList = "vue-notification-wrapper";
    end_elem.style =
      "transition-timing-function: ease; transition-delay: 0s; transition-property: all;";
    end_elem.innerHTML = `<div data-v-3462d80a="" data-v-460e7e47="" class="alert-default"><span data-v-3462d80a="" class="text">Finished running</span></div>`;
    end_elem.onclick = function () {
      try {
        end_elem.remove();
      } catch {}
    };
    document
      .getElementsByClassName("vue-notification-group")[0]
      .children[0].appendChild(end_elem);
    setTimeout(() => {
      try {
        end_elem.remove();
      } catch {}
    }, 15000);
  }

  //This code displays the result of the container ingame + in the console
  function ingameShowcase(message, rarity, name) {
    rarity = translations[rarity];
    if (rarity == undefined) {
      rarity = rarity_backup(bvl, "Skin Name", "Rarity", name);
    }
    const text = `${rarity} ${message} from: ${name}`;
    const style = `color: #${
      coloroutput[rarity.toUpperCase()] || coloroutput.DEFAULT
    }`;
    console.log(`%c${text}`, style);

    const elem = document.createElement("div");
    elem.classList.add("vue-notification-wrapper");
    elem.style =
      "transition-timing-function: ease; transition-delay: 0s; transition-property: all;";
    elem.innerHTML = `<div data-v-3462d80a="" data-v-460e7e47="" class="alert-default"><span data-v-3462d80a="" class="text" style="color:#${
      coloroutput[rarity.toUpperCase()] || coloroutput.DEFAULT
    }">${text}</span></div>`;
    elem.onclick = function () {
      try {
        elem.remove();
      } catch {}
    };
    document
      .getElementsByClassName("vue-notification-group")[0]
      .children[0].appendChild(elem);

    setTimeout(() => {
      try {
        elem.remove();
      } catch {}
    }, 5000);
  }

  //This code is for an animation for a specific rarity
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
        origin: {
          x: randomInRange(0.1, 0.3),
          y: Math.random() - 0.2,
        },
        zIndex: 99999,
      });
      confetti({
        ...defaults,
        particleCount,
        origin: {
          x: randomInRange(0.7, 0.9),
          y: Math.random() - 0.2,
        },
        zIndex: 99999,
      });
    }, 250);
  }

  //This one handles updatign the counter variable
  function updateCounter(counter, chestskipper) {
    counter = (counter + 1) % chests.length;
    while (chestskipper[counter] >= 2) {
      counter = (counter + 1) % chests.length;

      let check = chestskipper.reduce((acc, val) => acc + val, 0);
      if (check == chestskipper.length * 2) {
        counter = 0;
        break;
      }
    }
    return counter;
  }

  function automatic_microwaves(inventory) {
    //item in the inventory request
    inventory.forEach((item) => {
      Object.keys(item).forEach((key) => {
        if (typeof item[key] == "object") {
          translations["item"] = key;
        }
      });
    });
    //name in the inventory request
    inventory.forEach((item) => {
      Object.keys(item[translations["item"]]).forEach((key) => {
        if (
          (typeof item[translations["item"]][key] == "string" &&
            item[translations["item"]][key] == "Elizabeth") ||
          item[translations["item"]][key] == "James"
        ) {
          translations["name"] = key;
        }
      });
    });
    //id in the inventory request
    inventory.forEach((item) => {
      Object.keys(item[translations["item"]]).forEach((key) => {
        if (
          (typeof item[translations["item"]][key] == "string" &&
            item[translations["item"]][key] ==
              "a1055b22-18ca-4cb9-8b39-e46bb0151185") ||
          item[translations["item"]][key] ==
            "6be53225-952a-45d7-a862-d69290e4348e"
        ) {
          translations["id"] = key;
        }
      });
    });
  }

  //This processes my chestskipper variable
  function processChestskipper(chestskipper, inventory) {
    try {
      inventory.forEach((item) => {
        for (let i = 0; i < chests.length; i++) {
          if (
            item[translations["item"]][translations["id"]] ==
            chests[i]["chestid"]
          ) {
            chestskipper[i] = 0;
          }
        }
      });
      return chestskipper;
    } catch {
      ingameShowcase_messages("Kirka microwave issue", 15000);
      return chestskipper;
    }
  }

  let chestskipper = new Array(chests.length).fill(2);
  try {
    chestskipper[0] = 0;
  } catch {}

  (async () => {
    logCredits();
    if (!chests[0]) {
      return;
    }
    await setBVL();
    let inventory = await fetchInventory();
    automatic_microwaves(inventory);

    chestskipper = processChestskipper(chestskipper, inventory);

    if (!document.getElementById("konfettijs")) {
      let script = document.createElement("script");
      script.id = "konfettijs";
      script.src =
        "https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.min.js";
      document.head.appendChild(script);
    }

    let counter = 0;
    let interval = setInterval(async () => {
      let chestresult = await openChest(chests[counter]["chestid"]);
      let resultName = chestresult[translations["name"]];
      let resultRarity = chestresult[translations["rarity"]];
      if (resultName) {
        ingameShowcase(resultName, resultRarity, chests[counter]["name"]);
        if (
          translations[resultRarity] == "MYTHICAL" ||
          translations[resultRarity] == "PARANORMAL"
        ) {
          confettiAnimation();
        }
      } else if (chestresult["code"] == 9910) {
        console.log("RATELIMIT");
      } else {
        chestskipper[counter]++;
        console.log("DON'T WORRY ABOUT THE ERROR");
        console.log("THE CHEST THAT IT TRIED TO OPEN IS NOT AVAILABLE ANYMORE");
        console.log("IT WILL SKIP THAT ONE AFTER 2 FAILS");
      }
      counter = updateCounter(counter, chestskipper);
      let check = chestskipper.reduce((acc, val) => acc + val, 0);
      if (check == chestskipper.length * 2) {
        clearInterval(interval);
        console.log("Finished Running");
        ingameShowcase_end();
      }
    }, openingdelay);
  })();
})();
