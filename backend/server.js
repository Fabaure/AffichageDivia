const express = require("express");
const gtfsRealtimeBindings = require("gtfs-realtime-bindings");
const cors = require("cors");

const app = express();
const PORT = 3000;

const fs = require("fs");
const path = require("path");

app.use(cors());

const STOP_ID_GRESILLE_1 = "4-1571"; // stop_id de l'arret Grésille direction Gare 
const STOP_ID_GRESILLE_2 = "4-1555"; // stop_id de l'arret Grésille direction Quetigny

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


app.get("/api/arrivees-gresilles-gare", async (req, res) => {
  try {

    res.json(await getArrivalsForStop(STOP_ID_GRESILLE_1));
  } catch (error) {
    console.error("Erreur API:", error);
    res.status(500).json({ error: "Erreur récupération données." });
  }
});

app.get("/api/arrivees-gresilles-quetigny", async (req, res) => {
  try {

    res.json(await getArrivalsForStop(STOP_ID_GRESILLE_2));
  } catch (error) {
    console.error("Erreur API:", error);
    res.status(500).json({ error: "Erreur récupération données." });
  }
});


app.listen(PORT, () => {
  console.log(`✅ Serveur backend démarré sur http://localhost:${PORT}`);
});