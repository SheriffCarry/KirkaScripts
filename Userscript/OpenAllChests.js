let response
let text
async function start() {
    response = await fetch("https://raw.githubusercontent.com/SheriffCarry/KirkaScripts/main/Running%20Code/OpenAllChests.js")
    text = await response.text();
    eval(text)
}
start()
