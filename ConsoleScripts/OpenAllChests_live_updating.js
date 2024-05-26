let response
let text
async function start() {
    response = await fetch("https://raw.githubusercontent.com/SheriffCarry/KirkaScripts/main/ConsoleScripts/Open%20All%20Chests.js")
    text = await response.text();
    eval(text)
}
start()
