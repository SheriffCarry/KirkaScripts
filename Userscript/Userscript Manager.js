// ==UserScript==
// @name         Userscript Manager
// @description  Allows easy installation of userscripts + enabled autoupdates
// @version      0.3
// @author       SheriffCarry
// @github       https://api.github.com/repos/SheriffCarry/KirkaScripts/contents/Userscript/Userscript%20Manager.js
// ==/UserScript==

const fs = require("fs");
const path = require("path");
const { ipcRenderer } = require("electron");
const scriptsPath = ipcRenderer.sendSync("get-scripts-path");
let userscriptlist = "";
let fetcheduserscripts = false;

let optionGroup = document.createElement("div");
optionGroup.className = "option-group";

let tooltip_container = document.createElement("div");
tooltip_container.className = "tooltip-container-usm";
let tooltip_icon = document.createElement("span");
tooltip_icon.className = "info-icon-usm";
tooltip_icon.innerHTML = "i";
let tooltip_text = document.createElement("div");
tooltip_text.className = "tooltip-text-usm";
tooltip_text.innerText = `Made by SheriffCarry`;

let style = document.createElement("style");
style.innerHTML = `
/* Tooltip container */
.tooltip-container-usm {
    position: relative;
    display: inline-block;
    cursor: pointer;
    font-size: 14px;
}

/* Tooltip icon */
.info-icon-usm {
    background-color: #444;
    color: white;
    border-radius: 50%;
    padding: 5px;
    width: 20px;
    height: 20px;
    text-align: center;
    display: inline-block;
    font-weight: bold;
    line-height: 20px;
}

/* Tooltip text (hidden by default) */
.tooltip-text-usm {
    visibility: hidden;
    width: 400px;
    background-color: #333;
    color: #fff;
    text-align: center;
    border-radius: 5px;
    padding: 10px;
    position: absolute;
    z-index: 1;
    bottom: 125%; /* Adjust this to position above the icon */
    left: 50%;
    transform: translateX(-50%);
    opacity: 0;
    transition: opacity 0.3s;
    white-space: nowrap;
}

/* Tooltip arrow */
.tooltip-text-usm::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: #333 transparent transparent transparent;
}

/* Show the tooltip when hovering over the info icon */
.info-icon-usm:hover + .tooltip-text-usm {
    visibility: visible;
    opacity: 1;
}
`;

optionGroup.appendChild(style);
tooltip_container.appendChild(tooltip_icon);
tooltip_container.appendChild(tooltip_text);
optionGroup.appendChild(tooltip_container);

document.addEventListener("DOMContentLoaded", async () => {
  fetchUserscripts();
  setTimeout(() => {
    startfunction();
  }, 1000);
});

async function fetchUserscripts() {
  let sus = await fetch(
    "https://opensheet.elk.sh/17vQGwxL8HBTgefVNyHpgoTN1HCGWwsQgRlWgCpzfBKQ/Userscripts",
  );
  userscriptlist = await sus.json();
  fetcheduserscripts = true;
}

function startfunction() {
  if (document.getElementById("scripts-options")) {
    if (fetcheduserscripts == false) {
      setTimeout(() => {
        startfunction();
      }, 1000);
    } else {
      console.log("ADDING SCRIPTS");
      add_userscripts();
    }
  } else {
    setTimeout(() => {
      startfunction();
    }, 1000);
  }
}

function add_userscripts() {
  if (Array.isArray(userscriptlist)) {
    userscriptlist.forEach((listitem) => {
      let option = document.createElement("div");
      option.className = "option";
      let left = document.createElement("div");
      left.className = "left";
      let span = document.createElement("span");
      span.innerHTML = `${listitem["Name"]} - ${listitem["Description"]}`;
      let downloadbutton = document.createElement("button");
      downloadbutton.type = "button";
      downloadbutton.innerText = "Download";
      downloadbutton.id = listitem["GitHub"];
      downloadbutton.onclick = async function () {
        document.getElementById(listitem["GitHub"]).disabled = true;
        let responce = await downloadScript(listitem["GitHub"]);
        alert(responce);
      };
      left.appendChild(span);
      option.appendChild(left);
      option.appendChild(downloadbutton);
      optionGroup.appendChild(option);
    });
  }
  document.getElementById("scripts-options").appendChild(optionGroup);
  updateScripts();
}

function updateScripts() {
  fs.readdir(scriptsPath, (err, files) => {
    if (err) {
      return console.error("Unable to scan directory:", err);
    }
    const jsFiles = files.filter((file) => path.extname(file) === ".js");

    jsFiles.forEach((file) => {
      const filePath = path.join(scriptsPath, file);

      fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
          return console.error(`Error reading file ${file}:`, err);
        }
        let metadataRegex = /\/\/\s*@(\w+)\s+(.+)/g;
        let match;
        let metadata = {};

        while ((match = metadataRegex.exec(data)) !== null) {
          let key = match[1].trim();
          let value = match[2].trim();
          metadata[key] = value;
        }
        if (metadata["github"]) {
          downloadScript(metadata["github"], file, metadata["version"]);
        }
      });
    });
  });
}

async function downloadScript(githuburl, oldfilename = "", oldversion = 0) {
  fetch(githuburl)
    .then((response) => response.json())
    .then((fileData) => {
      let filename = fileData.name;
      if (oldfilename != "") {
        filename = oldfilename;
      }
      let filepath = `${scriptsPath}\\${filename}`;
      let content = atob(fileData.content);
      let metadataRegex = /\/\/\s*@(\w+)\s+(.+)/g;
      let match;
      let metadata = {};

      while ((match = metadataRegex.exec(content)) !== null) {
        let key = match[1].trim();
        let value = match[2].trim();
        metadata[key] = value;
      }
      if (metadata["version"] > oldversion) {
        console.log("UPDATING");
        fs.writeFile(filepath, content, (err) => {
          if (err) {
            console.error("Error writing to the file:", err);
          } else {
            console.log(`Downloaded.`);
            return "Downloaded.";
          }
        });
      }
    })
    .catch((error) => console.error("Error fetching file:", error));
}
