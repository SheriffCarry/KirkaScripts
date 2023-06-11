let charactercards = ["723c4ba7-57b3-4ae4-b65e-75686fa77bf2", //Cold
    "723c4ba7-57b3-4ae4-b65e-75686fa77bf1", //Girls band
    "6281ed5a-663a-45e1-9772-962c95aa4605", //Party
    "9cc5bd60-806f-4818-a7d4-1ba9b32bd96c" //Soldiers
]
let cardskipper = [0, //Cold
    0, //Girls band
    0, //Party
    0 //Soldiers
]
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
            console.warn("DON'T WORRY ABOUT THE ERROR\nTHE CARD THAT IT TRIED TO OPEN IS NOT AVAILABLE ANYMORE\nIT WILL SKIP THAT ONE AFTER 5 FAILS")
            cardskipper[counter]++;
        } else {
            r = await r.json();
            r.forEach(item => {
                if (item.isWon == true) {
                    console.log(item.rarity, item.name)
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
        }
    },
    1500)
