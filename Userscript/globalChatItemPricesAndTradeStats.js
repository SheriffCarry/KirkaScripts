// ==UserScript==
// @name         Global Chat Item Prices and Trade Stats
// @description  Add (price) in global chat after each [item], and some trade stats if the offering is good or a scam.
// @version      0.5
// @author       SheriffCarry, skywalk
// @github       https://api.github.com/repos/SheriffCarry/KirkaScripts/contents/Userscript/globalChatItemPricesAndTradeStats.js
// ==/UserScript==

let priceList = {};
let objectKeyList = {
  skywalk: { name: "itemName", type: "type", price: "Value" },
  yzzz: { name: "Name", type: "Type", price: "Base Value" },
  BROS: { name: "Skin Name", type: "Type", price: "Price" },
};

const tooltip_container = createElementWithClass(
  "div",
  "tooltip-container-GVL",
);
const tooltip_icon = createElementWithClass("span", "info-icon-GVL", "i");
const tooltip_text = createElementWithClass(
  "div",
  "tooltip-text-GVL",
  "Made by SheriffCarry and skywalk",
);

let style = document.createElement("style");
style.innerHTML = `
.tooltip-container-GVL { position: relative; display: inline-block; cursor: pointer; font-size: 14px; }
.info-icon-GVL { background-color: #444; color: white; border-radius: 50%; padding: 5px; width: 20px; height: 20px; text-align: center; display: inline-block; font-weight: bold; line-height: 20px; }
.tooltip-text-GVL { visibility: hidden; width: 400px; background-color: #333; color: #fff; text-align: center; border-radius: 5px; padding: 10px; position: absolute; z-index: 1; bottom: 125%; left: 50%; transform: translateX(-50%); opacity: 0; transition: opacity 0.3s; white-space: nowrap; }
.tooltip-text-GVL::after { content: ""; position: absolute; top: 100%; left: 50%; margin-left: -5px; border-width: 5px; border-style: solid; border-color: #333 transparent transparent transparent; }
.info-icon-GVL:hover + .tooltip-text-GVL { visibility: visible; opacity: 1; }
`;

const option_group = createElementWithClass("div", "option-group");
const option = createElementWithClass("div", "option");
const select = createDropdown("globalchat_value_list", [
  { value: "skywalk", text: "skywalk's autopricing" },
  { value: "BROS", text: "BROS Value List" },
  { value: "yzzz", text: "yzzz Value List" },
  { value: "average", text: "BROS/yzzz average" },
]);
const span = createElementWithText("span", "Globalchat Value List");

option.append(span, select);
tooltip_container.append(tooltip_icon, tooltip_text);
option_group.append(style, tooltip_container, option);

async function fetchData(listName, url) {
  try {
    const response = await fetch(url);
    priceList[listName] = await response.json();
  } catch {
    priceList[listName] ||= [];
  }
}

async function fetchPriceList() {
  await Promise.all([
    fetchData("skywalk", "https://kirka.lukeskywalk.com/priceList.json"),
    fetchData(
      "yzzz",
      "https://opensheet.elk.sh/1VqX9kwJx0WlHWKCJNGyIQe33APdUSXz0hEFk6x2-3bU/Sorted+View",
    ),
    fetchData(
      "BROS",
      "https://opensheet.elk.sh/1tzHjKpu2gYlHoCePjp6bFbKBGvZpwDjiRzT9ZUfNwbY/Alphabetical",
    ),
  ]);
  return true;
}

(async () => {
  await fetchPriceList();
  window.priceList = priceList;
  window.objectKeyList = objectKeyList;
})();

setInterval(
  async () => {
    await fetchPriceList();
    window.priceList = priceList;
    window.objectKeyList = objectKeyList;
  },
  1000 * 60 * 1,
);

function createElementWithClass(tagName, className, textContent = "") {
  const element = document.createElement(tagName);
  element.className = className;
  if (textContent) {
    element.textContent = textContent;
  }
  return element;
}

function createElementWithText(tagName, textContent) {
  const element = document.createElement(tagName);
  element.textContent = textContent;
  return element;
}

function createDropdown(id, options) {
  const select = document.createElement("select");
  select.id = id;
  options.forEach(({ value, text }) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = text;
    select.appendChild(option);
  });
  return select;
}

document.addEventListener("DOMContentLoaded", async () => {
  setTimeout(() => {
    startfunction();
  }, 1000);
});

function startfunction() {
  if (document.getElementById("scripts-options")) {
    document.getElementById("scripts-options").appendChild(option_group);
  }
  localStorage.globalchatPricesList ||= "skywalk";

  select.value = localStorage.globalchatPricesList;
  select.addEventListener("change", () => {
    localStorage.globalchatPricesList = select.value;
  });
}

function getValue(itemName, itemType, selectedList) {
  let currentList = priceList[selectedList];
  let currentKeys = objectKeyList[selectedList];
  const item = currentList.find(
    (entry) =>
      entry[currentKeys.name] === itemName &&
      entry[currentKeys.type] === itemType,
  );
  return item ? parseFloat(item[currentKeys.price].toString().replace(/[.,]/g, "")) : 0;
}

const searchItemByName = (itemName, itemType) => {
  const selectedList = localStorage.globalchatPricesList;
  if (selectedList === "average") {
    const values = ["yzzz", "BROS"].map((list) =>
      getValue(itemName, itemType, list),
    );
    const validValues = values.filter((val) => val);
    return validValues.length
      ? Math.round(
          (validValues.reduce((a, b) => a + b) / validValues.length) * 100,
        ) / 100
      : 0;
  }
  return getValue(itemName, itemType, selectedList);
};

function returnItemType(weaponType, itemType) {
  return itemType === "BODY_SKIN"
    ? "Character"
    : itemType === "WEAPON_SKIN"
      ? weaponType
      : itemType === "CHEST"
        ? "Chest"
        : itemType === "CARD"
          ? "Card"
          : "";
}

function formatNumber(number) {
  if (!number) return "0";
  const abs = Math.abs(number);
  const suffix =
    abs >= 1e9 ? "bil" : abs >= 1e6 ? "mil" : abs >= 1e3 ? "k" : "";
  const divisor =
    suffix === "bil" ? 1e9 : suffix === "mil" ? 1e6 : suffix === "k" ? 1e3 : 1;
  const num = (abs / divisor).toFixed(abs % 1 ? 1 : 0);
  return (number < 0 ? "-" : "") + num + suffix;
}

const regexItemsFix = /\[\s*(.*?)\|(.*?)\|(.*?)\|(.*?)\]x?(\d*)/g;
function trimsplit(x) {
  let parts = [],
    lastIndex = 0;
  for (let match of x.matchAll(regexItemsFix)) {
    if (match.index !== lastIndex) parts.push(x.slice(lastIndex, match.index));
    parts.push(match[0]);
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex !== x.length) parts.push(x.slice(lastIndex));
  return parts;
};

function trimMessage(messageSplit) {
  let newMessage = "",
    isOffering = true,
    offeringTotal = 0,
    wantedTotal = 0;
  let favorableTrade = "";
  for (let segment of messageSplit) {
    const tradeTag = /\*\*\/trade accept (\d+)\*\*/i;
    const itemRegex =
      /\[([^\|\]]+)\|([^\|\]]*)\|([^\|\]]*)\|([^\|\]]+)](?:x(\d+))?/g;
    const itemDetails = [...segment.matchAll(itemRegex)].map((match) => ({
      name: match[1],
      weaponType: match[2],
      itemType: match[3],
      quantity: parseInt(match[5] || "1"),
    }));

    if (tradeTag.test(segment)) {
      favorableTrade =
        offeringTotal === 0 || wantedTotal === 0
          ? "New item?"
          : '';
      const [prefix, tradeId] = segment.trim().split("**");
      newMessage += ` [${formatNumber(wantedTotal)}] Status: ${offeringTotal - wantedTotal > 0 ? '+':''}${formatNumber(offeringTotal - wantedTotal)}${favorableTrade!= ''? ' '+favorableTrade : ''} ${prefix}**${tradeId}** `;
    } else {
      if (segment.includes("for your")) {
        isOffering = false;
        newMessage += ` [${formatNumber(offeringTotal)}] ${segment}`;
      } else {
        for (let { name, weaponType, itemType, quantity } of itemDetails) {
          const pricelistItemType = returnItemType(weaponType, itemType);
          const itemPrice = searchItemByName(name, pricelistItemType);
          if (isOffering) offeringTotal += quantity * itemPrice;
          else wantedTotal += quantity * itemPrice;
          newMessage += `${segment} (${(quantity>1)?`${quantity}x${formatNumber(itemPrice)}= `:''}${formatNumber(quantity * itemPrice)})`;
        }
        if (!itemDetails.length) newMessage += segment;
      }
    }
  }
  return newMessage;
}
const regex = /\[([^\|]+).*?\]/gm;
(function () {
  const originalWebSocket = window.WebSocket;
  window.WebSocket = function (...args) {
    const wsUrl = args[0];
    if (wsUrl.includes("chat.")) {
      const ws = new originalWebSocket(...args);
      ws.addEventListener("message", function (event) {
        try {
          let messageData = JSON.parse(event.data);
          if (
            messageData &&
            messageData["message"] &&
            !messageData["testfield"]
          ) {
            const msgSplit = trimsplit(messageData["message"]);
            const newMessageArray = trimMessage(msgSplit);
            messageData["message"] = newMessageArray;
            messageData["testfield"] = true;
            event.stopImmediatePropagation();
            const modifiedEvent = new MessageEvent("message", {
              data: JSON.stringify(messageData),
              origin: event.origin,
              lastEventId: event.lastEventId,
              source: event.source,
              ports: event.ports,
            });
            ws.dispatchEvent(modifiedEvent);
          } else if (
            messageData &&
            messageData["messages"] &&
            !messageData["testfield"]
          ) {
            let newmessages = [];
            messageData["messages"].forEach((item) => {
              const msgSplit = trimsplit(item["message"]);
              const newMessageArray = trimMessage(msgSplit);
			  item["message"] = newMessageArray;
              newmessages.push(item);
            });
            messageData["messages"] = newmessages;
            messageData["testfield"] = true;
            event.stopImmediatePropagation();
            const modifiedEvent = new MessageEvent("message", {
              data: JSON.stringify(messageData),
              origin: event.origin,
              lastEventId: event.lastEventId,
              source: event.source,
              ports: event.ports,
            });
            ws.dispatchEvent(modifiedEvent);
          }
        } catch (e) {
          console.error("Error processing WebSocket message:", e);
        }
      });
      return ws;
    }
    return new originalWebSocket(...args);
  };
})();
