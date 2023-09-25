let charactercards = ["723c4ba7-57b3-4ae4-b65e-75686fa77bf2", //Cold
    "723c4ba7-57b3-4ae4-b65e-75686fa77bf1", //Girls band
    "6281ed5a-663a-45e1-9772-962c95aa4605", //Party
    "9cc5bd60-806f-4818-a7d4-1ba9b32bd96c" //Soldiers
]
let cardskipper = [4, //Cold
    5, //Girls band
    5, //Party
    5 //Soldiers
]
let coloroutput = {
    MYTHICAL: "c20025",
    LEGENDARY: "feaa37",
    EPIC: "cd2afc",
    RARE: "43abde",
    COMMON: "47f2a0",
    DEFAULT: "ffffff"
}
let inventory = await fetch("https://api.kirka.io/api/inventory", {
    "headers": {
        "accept": "application/json, text/plain, */*",
        "accept-language": "de",
        "authorization": "Bearer " + localStorage.token,
    },
    "body": null
})
inventory = await inventory.json()
inventory.forEach(item => {
    if (item.item.id == charactercards[0]) {
        cardskipper[0] = 0;
    }
    if (item.item.id == charactercards[1]) {
        cardskipper[1] = 0;
    }
    if (item.item.id == charactercards[2]) {
        cardskipper[2] = 0;
    }
    if (item.item.id == charactercards[3]) {
        cardskipper[3] = 0;
    }
})
let counter = 0
let interval = setInterval(async () => {
        let r = await fetch("https://api.kirka.io/api/inventory/openCharacterCard", {
            "headers": {
                "accept": "application/json, text/plain, /",
                "authorization": "Bearer " + localStorage.token,
                "content-type": "application/json;charset=UTF-8",
                "sec-ch-ua-platform": "\"Windows\"",
            },
            "referrer": "https://kirka.io/",
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": "{\"id\":\"" + charactercards[counter] + "\"}",
            "method": "POST",
            "mode": "cors",
            "credentials": "include"
        });

        if (r.status == 400) {
            console.log("DON'T WORRY ABOUT THE ERROR")
            console.log("THE CHEST THAT IT TRIED TO OPEN IS NOT AVAILABLE ANYMORE")
            console.log("IT WILL SKIP THAT ONE AFTER 5 FAILS")
            cardskipper[counter]++;
        } else {
            r = await r.json();
            r.forEach(item => {
                if (item.isWon == true) {
                    console.log(item.rarity, item.name)
                    if (Object.keys(coloroutput).includes(item.rarity)) {
                        let text = item.rarity + " " + item.name;
                        let style = "color: #" + coloroutput[item.rarity]
                        console.log(`%c${text}`, style);
                        let elem = document.createElement("div")
                        elem.classList = "vue-notification-wrapper"
                        elem.style = "transition-timing-function: ease; transition-delay: 0s; transition-property: all;"
                        elem.innerHTML = '<div data-v-2667dbc5="" data-v-2e3e77fa="" class="alert-default"><span data-v-2667dbc5="" class="text" style="color:#' + coloroutput[item.rarity] + '">' + text + ' </span></div>'
                        document.getElementById("notifications").children[0].appendChild(elem);
                        setTimeout(() => {
                            elem.remove();
                        }, 5000);
                    } else {
                        console.log(item.rarity + " " + item.name)
                    }
                };
            });
        }
        counter++
        if (counter == charactercards.length) {
            counter = 0
        }
        if (counter == charactercards.length) {
            counter = 0
        }
        let check1 = 0
        cardskipper.forEach(item => {
            check1 += item
        })
        if (check1 == cardskipper.length * 5) {
            clearInterval(interval);
        }
        if (cardskipper[counter] == 5) {
            counter++
        }
        if (counter == charactercards.length) {
            counter = 0
        }
        if (cardskipper[counter] == 5) {
            counter++
        }
        if (counter == charactercards.length) {
            counter = 0
        }
        if (cardskipper[counter] == 5) {
            counter++
        }
        if (counter == charactercards.length) {
            counter = 0
        }
        let check2 = 0
        cardskipper.forEach(item => {
            check2 += item
        })
        if (check2 == cardskipper.length * 5) {
            clearInterval(interval);
            let endelem = document.createElement("div")
            endelem.classList = "vue-notification-wrapper"
            endelem.style = "transition-timing-function: ease; transition-delay: 0s; transition-property: all;"
            endelem.innerHTML = '<div data-v-2667dbc5="" data-v-2e3e77fa="" class="alert-default"><span data-v-2667dbc5="" class="text">Finished Running</span></div>'
            document.getElementById("notifications").children[0].appendChild(endelem);
            setTimeout(() => {
                endelem.remove();
            }, 15000);
        }
    },
    1500)
