let response
let text
async function start() {
    response = await fetch("https://raw.githubusercontent.com/SheriffCarry/KirkaScripts/main/ConsoleScripts/Open%20All%20Cards.js")
    text = await response.text();
    eval(text)
}
start()
