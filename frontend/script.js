async function chargerArrivees(stopDirection, type_card) {
  try {
    const response = await fetch(`https://affichagedivia.onrender.com/api/arrivees-gresilles-${stopDirection}`);
    const data = await response.json();

    const namestation = document.getElementById("station-name")
    namestation.textContent = data.station[0];

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
      const minuteval = data.Minutes[i]
      temps.textContent = minuteval === 0 ? "À l'arrêt" : `${minuteval}`;

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
  chargerArrivees("quetigny",".cardL");
  chargerArrivees("gare",".cardR");
}
setInterval(Screenrefresh, 10000); // rafraîchit toutes les 10s
Screenrefresh()

