const express = require("express");
const gtfsRealtimeBindings = require("gtfs-realtime-bindings");
const cors = require("cors");

const app = express();
const PORT = 3000;

const fs = require("fs");
const path = require("path");

app.use(cors());

const GareDirection = ["4-1551","4-1499","4-1494","4-1536","4-1576","4-1562","4-1574","4-1571","4-1573","4-1566","4-1569","4-1544","4-1572","4-1581","4-1565","4-1563","4-1575"]
const QuetignyDirection = ["4-1585","4-1467","4-1462","4-1528","4-1560","4-1542","4-1558","4-1555","4-1557","4-1546","4-1550","4-1564","4-1556","4-1580","4-1545","4-1543","4-1559"]

const nameStationList = ["DijonGare","FochGare","Darcy","Godran","Republique","Auditorium","Poincare","Gresilles","ParcSport","Chu","Erasme","Universite","Mazen","Piscine","CapVert","GrandMarche","Quetigny"]


const tripsFile = fs.readFileSync(path.join(__dirname, "api/trips.txt"),"utf8");
const tripLine = tripsFile.split("\n");

const stopsFile = fs.readFileSync(path.join(__dirname, "api/stops.txt"),"utf8");
const stopLine = stopsFile.split("\n");


async function getArrivalsForStop(stopId) {
  const response = await fetch("https://proxy.transport.data.gouv.fr/resource/divia-dijon-gtfs-rt-trip-update");
  const buffer = await response.arrayBuffer();
  const feed = gtfsRealtimeBindings.transit_realtime.FeedMessage.decode(new Uint8Array(buffer));

  const trams = [];
  const dest = [];
  const lineid = [];
  const stationName = []

  const tripHeadsigns = {};
  const StopHeadsigns = {};

  tripLine.forEach(line =>{
    const [route_id, service_id, trip_id, shape_id, trip_headsign] = line.split(",");
    if (shape_id && trip_headsign) {
      tripHeadsigns[shape_id] = trip_headsign.trim();
    } 
  });

  stopLine.forEach(line =>{
    const [stop_id, stop_code, stop_name, stop_lat, stop_lon, location_type] = line.split(",");
    if (stop_id && stop_name) {
      StopHeadsigns[stop_id] = stop_name.trim();
    } 
  });
    
  const nameid = StopHeadsigns[stopId] || "Inconnu";
  stationName.push(nameid)

  feed.entity.forEach((entity) => {
    const trip = entity.tripUpdate;
    if (!trip || !trip.stopTimeUpdate) return;

    const matchStop2 = trip.stopTimeUpdate.find(
      (stop) => stop.stopId === stopId
    );

    if (matchStop2?.arrival?.time) {
      const arrivalTimestamp = Number(matchStop2.arrival.time);
      const now = Math.floor(Date.now() / 1000);
      const secondsLeft = arrivalTimestamp - now;

      if (secondsLeft < 20) return;
      const minutes = Math.floor(secondsLeft / 60);
      trams.push(minutes);

      const destination = tripHeadsigns[trip.trip.tripId] || "Inconnu";
      dest.push(destination);

      const routeid = trip.trip.routeId
      lineid.push(routeid.substring(2))
      }
  });
  trams.sort((a, b) => a - b);
  return { Minutes: trams, destination : dest, line : lineid, station : stationName}
}

for(let i = 0; i<nameStationList.length; i++){
  let NameStation = nameStationList[i];
  let StopIdG = GareDirection[i]
  let StopIdQ = QuetignyDirection[i]
  app.get(`/api/arrivees-${NameStation}-gare`, async (req, res) => {
    try {

      res.json(await getArrivalsForStop(StopIdG));
    } catch (error) {
      console.error("Erreur API:", error);
      res.status(500).json({ error: "Erreur récupération données." });
    }
  });

  app.get(`/api/arrivees-${NameStation}-quetigny`, async (req, res) => {
    try {

      res.json(await getArrivalsForStop(StopIdQ));
    } catch (error) {
      console.error("Erreur API:", error);
      res.status(500).json({ error: "Erreur récupération données." });
    }
  });
}




app.listen(PORT, () => {
  console.log(`✅ Serveur backend démarré sur http://localhost:${PORT}`);
});