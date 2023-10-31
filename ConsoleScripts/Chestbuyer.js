let amount = 1;
let chest = "1"; //1 = Wood, 2 = Ice, 3 = Golden
for (let index = 0; index < amount; index++) {
  let req = await fetch("https://api.kirka.io/api/shop/buy", {
    headers: {
      accept: "application/json, text/plain, */*",
      authorization: `Bearer ${localStorage.token}`,
      "content-type": "application/json;charset=UTF-8",
    },
    body: `{\"id\":${chest}}`,
    method: "POST",
  });
  req = await req.status;
  //console.log(req)
}
