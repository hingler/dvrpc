import { FeatureManager } from "./FeatureManager";
import { PolyBounds } from "./PolyBounds";
import * as L from "leaflet";
import { Point2D } from "../mapdata/mapTypes";

const STATS_IDS = [
  "ipd_score",
  "d_score",
  "em_score",
  "f_score",
  "fb_score",
  "lep_score",
  "li_score",
  "oa_score",
  "rm_score",
  "y_score"
];

export class StatsModal {
  private manager : FeatureManager;
  private lastCollision : PolyBounds;
  private htmlModal : HTMLElement;
  private highlightedPoly : L.Polygon;

  constructor(manager: FeatureManager) {
    this.manager = manager;
    this.lastCollision = null;
    this.highlightedPoly = null;
    this.htmlModal = document.getElementById("stats");
    this.updateModal();

    // build around an HTML element which can contain map data
  }

  handleMouseEvent(e: L.LeafletMouseEvent) {
    const collide = this.manager.testCollision([e.latlng.lat, e.latlng.lng]);
    if (collide !== this.lastCollision) {
      this.lastCollision = collide;
      this.updateModal();
    }
  }

  private updateModal() {
    if (this.highlightedPoly !== null) {
      this.manager.getMap().removeLayer(this.highlightedPoly);
    }

    if (this.lastCollision === null) {
      this.htmlModal.classList.add("hidden");
    } else {
      this.highlightedPoly = L.polygon(this.lastCollision.getPolyData() as Array<Array<Point2D>>, { color: "white"});
      this.manager.getMap().addLayer(this.highlightedPoly);
      this.htmlModal.classList.remove("hidden");
      for (let stat of STATS_IDS) {
        document.getElementById(stat).querySelector(".score").textContent = this.lastCollision.props[stat];
      }
    }
  }
}