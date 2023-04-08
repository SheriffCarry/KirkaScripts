let chests = [
    "ec230bdb-4b96-42c3-8bd0-65d204a153fc", //Ice
]
let chestskipper = [
    0 //ice
]
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
        console.log(r.rarity, r.name)
        
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
        if (chestskipper[counter] == 5) {
            counter++
        }
        if (counter == chests.length) {
            counter = 0
        }
        if (chestskipper[counter] == 5) {
            counter++
        }
        if (counter == chests.length) {
            counter = 0
        }
        if (chestskipper[counter] == 5) {
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
