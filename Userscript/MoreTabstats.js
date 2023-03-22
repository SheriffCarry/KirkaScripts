let level = true
let clan = true
let kd = true

let response
let text
async function start() {
    response = await fetch("https://raw.githubusercontent.com/SheriffCarry/KirkaScripts/main/Running%20Code/MoreTabstats.js")
    text = await response.text();
    eval(text)
}
start()
