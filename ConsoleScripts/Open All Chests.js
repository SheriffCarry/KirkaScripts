let chests = ["077a4cf2-7b76-4624-8be6-4a7316cf5906", //Golden
    "ec230bdb-4b96-42c3-8bd0-65d204a153fc", //Ice
    "71182187-109c-40c9-94f6-22dbb60d70ee" //Wood
]
let chestskipper = [4, //Golden
    5, //ice
    5 //Wood
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
    if (item.item.id == chests[0]) {
        chestskipper[0] = 0;
    }
    if (item.item.id == chests[1]) {
        chestskipper[1] = 0;
    }
    if (item.item.id == chests[2]) {
        chestskipper[2] = 0;
    }
})

let counter = 0
let interval = setInterval(async () => {
        let r = await fetch("https://api.kirka.io/api/inventory/openChest", {
            "headers": {
                "accept": "application/json, text/plain, /",
                "authorization": "Bearer " + localStorage.token,
                "content-type": "application/json;charset=UTF-8",
                "sec-ch-ua-platform": "\"Windows\"",
            },
            "referrer": "https://kirka.io/",
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": "{\"id\":\"" + chests[counter] + "\"}",
            "method": "POST",
            "mode": "cors",
            "credentials": "include"
        });

        if (r.status == 400) {
            console.log("DON'T WORRY ABOUT THE ERROR")
            console.log("THE CHEST THAT IT TRIED TO OPEN IS NOT AVAILABLE ANYMORE")
            console.log("IT WILL SKIP THAT ONE AFTER 5 FAILS")
        }
        r = await r.json();
        if (Object.keys(coloroutput).includes(r.rarity)) {
            let text = r.rarity + " " + r.name;
            let style = "color: #" + coloroutput[r.rarity]
            console.log(`%c${text}`, style);
        } else {
            console.log(r.rarity + " " + r.name)
        }

        if (!r.rarity) {
            chestskipper[counter]++
        }
        counter++
        if (counter == chests.length) {
            counter = 0
        }
        if (counter == chests.length) {
            counter = 0
        }
        let check1 = 0
        chestskipper.forEach(item => {
            check1 += item
        })
        if (check1 == chestskipper.length * 5) {
            clearInterval(interval);
        }
        if (chestskipper[counter] >= 5) {
            counter++
        }
        if (counter == chests.length) {
            counter = 0
        }
        if (chestskipper[counter] >= 5) {
            counter++
        }
        if (counter == chests.length) {
            counter = 0
        }
        if (chestskipper[counter] >= 5) {
            counter++
        }
        if (counter == chests.length) {
            counter = 0
        }
        let check2 = 0
        chestskipper.forEach(item => {
            check2 += item
        })
        if (check2 == chestskipper.length * 5) {
            clearInterval(interval);
        }
    },
    1500)
