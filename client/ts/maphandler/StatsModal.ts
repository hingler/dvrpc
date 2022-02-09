import { FeatureManager } from "./FeatureManager";
import { PolyBounds } from "./PolyBounds";

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

  constructor(manager: FeatureManager) {
    this.manager = manager;
    this.lastCollision = null;
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
    if (this.lastCollision === null) {
      this.htmlModal.classList.add("hidden");
    } else {
      this.htmlModal.classList.remove("hidden");
      for (let stat of STATS_IDS) {
        document.getElementById(stat).querySelector(".score").textContent = this.lastCollision.props[stat];
      }
    }
  }
}