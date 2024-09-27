(async () => {
  let amount = 1;
  let card = "1"; //4 = Party, 5 = Soldiers, 6 = GirlsBand, 30 = Cold, 31 = Periodic
  for (let index = 0; index < amount; index++) {
    let req = await fetch("https://api.kirka.io/api/shop/buy", {
      headers: {
        accept: "application/json, text/plain, */*",
        authorization: `Bearer ${localStorage.token}`,
        "content-type": "application/json;charset=UTF-8",
      },
      body: `{\"id\":${card}}`,
      method: "POST",
    });
    req = await req.status;
    //console.log(req)
  }
})();
