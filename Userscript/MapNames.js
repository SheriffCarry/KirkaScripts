let map1 = "Clash"
let map2 = "SuS"
let map3 = "Gamer"
let map4 = "Gril"
let map5 = "Yeet"


let response
let text
async function start() {
    response = await fetch("https://raw.githubusercontent.com/SheriffCarry/KirkaScripts/main/Running%20Code/MapNames.js")
    text = await response.text();
    eval(text)
}
start()
