async function chargerArrivees(nameStation, stopDirection, type_card) {
  try {
    const response = await fetch(`https://affichagedivia.onrender.com/api/arrivees-${nameStation}-${stopDirection}`);
    const data = await response.json();

    const leftfoot = document.querySelector(".left-foot")
    const rightfoot = document.querySelector(".right-foot")
    leftfoot.textContent = `Ligne T1 — ${nameStation} → Dijon Gare`;
    rightfoot.textContent = `Ligne T1 — ${nameStation} → Quetigny Centre`;

    const time = document.getElementById("time")
    const Minutes =  new Date().getMinutes()
    const Hours =  new Date().getHours()
    time.textContent = Hours + ":" + Minutes 

    const date = document.getElementById("date")
    const day = new Date().getDate()
    const mouth = new Date().getMonth() + 1
    const years = new Date().getFullYear()
    date.textContent = day + "/" + mouth + "/" + years

    const cards = document.querySelectorAll(type_card)
    for(let i = 0; i<cards.length; i++){
      const card = cards[i]

      const temps = card.querySelector(".minute");
      const min = card.querySelector(".min-label");
      const minuteval = data.Minutes[i]
      temps.textContent = minuteval === 0 ? "À l'arrêt" : `${minuteval}`;

      if (minuteval===0){
        temps.classList.add("active")
        min.textContent = ""
      }else{
        temps.classList.remove("active")
      }

      const namedest = card.querySelector(".dest-name");
      const dest = data.destination[i];
      namedest.textContent = dest;

      const line = card.querySelector(".line-id");
      const lineid = data.line[i];
      line.textContent = lineid;

    }

  } catch (err) {
    console.error("Erreur :", err);
  }
}

function Screenrefresh(){

  let list = document.getElementById("select_station")
  let select = list.value
  chargerArrivees(select, "gare",".cardL");
  chargerArrivees(select,"quetigny",".cardR");
}


setInterval(Screenrefresh, 1000); // rafraîchit toutes les 1s
Screenrefresh()

