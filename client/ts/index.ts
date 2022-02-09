import * as L from "leaflet";
import { DVRPCFeatureCollection } from "./mapdata/mapTypes";
import { FeatureManager } from "./maphandler/FeatureManager";

window.addEventListener("load", main);


let map : L.Map = null;
let features : FeatureManager = null;

// probably offline this so i dont spam their api while im building the app
// const DATA_URL : string = "https://arcgis.dvrpc.org/portal/rest/services/Demographics/IPD_2019/FeatureServer/0/query?where=1%3D1&geometryPrecision=5&outfields=ipd_score,d_score,em_score,f_score,fb_score,lep_score,li_score,oa_score,rm_score,y_score&f=geojson";
const DATA_URL : string = "../json/dvrpc-json-data.json";
async function main() {
  map = L.map("map-dest", {
    center: [40.071, -75.2273],
    zoom: 9
  });

  L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiamFtaWVib3kxMzM3IiwiYSI6ImNremY3NTJhYzM5bG8ycG8wazJ5M210ZDEifQ.xr5z0_g7ZImCCJVGFxljtQ'
  }).addTo(map);

  const resp = await fetch(DATA_URL);
  if (resp.status < 200 || resp.status >= 400) {
    // todo: display something meaningful to the client
    throw Error("Could not connect to DVRPC feature API");
  }

  const data = await resp.json() as DVRPCFeatureCollection;
  console.log(data);
  features = new FeatureManager(data, map);

  map.on("mousemove", handleMouseEvent);

  // -- create bounding spheres around each poly
  // when the mouse moves:
}

function handleMouseEvent(e: L.LeafletMouseEvent) {
  features.testCollision([e.latlng.lat, e.latlng.lng]);
}