import { DVRPCFeature, DVRPCFeatureCollection, Point2D } from "../mapdata/mapTypes";
import * as L from "leaflet";
import { PolyBounds } from "./PolyBounds";
import { vec2, vec3 } from "gl-matrix";
import { HSVGradient } from "../gradient/HSVGradient";
import { rgbToHexString } from "../gradient/rgbToHexString";

/**
 * Manages map geometry and detects which polys the mouse is over.
 */
export class FeatureManager {
  private featurelist: DVRPCFeatureCollection;
  private map: L.Map;

  private collisionList: Array<PolyBounds>;

  constructor(features: DVRPCFeatureCollection, map: L.Map) {
    this.featurelist = features;
    this.map = map;
    for (let feature of features.features) {
      FeatureManager.cleanUpFeature(feature);
      FeatureManager.flipPolyData(feature);
    }

    const multipoly : Array<Array<Array<Point2D>>> = [];
    const colorMap : Map<number, Array<Array<Array<Point2D>>>> = new Map();
    for (let feature of features.features) {
      const ipd = feature.properties.ipd_score;
      if (!colorMap.has(ipd)) {
        colorMap.set(ipd, []);
      }

      colorMap.get(ipd).push(feature.geometry.coordinates);
      multipoly.push(feature.geometry.coordinates);
    }

    const perfStart = performance.now();

    // classify by color
    const colorGrad = new HSVGradient();
    colorGrad.addRGBStop([0, 0, 128], 8);
    colorGrad.addRGBStop([255, 255, 0], 32);
    for (let col of colorMap) {
      const colString = rgbToHexString(colorGrad.getColor(col[0]) as vec3);
      const poly = L.polygon(col[1], { color: colString, weight: 1});
      map.addLayer(poly);
    }

    const perfEnd = performance.now();
    console.debug(`Polygons constructed in ${perfEnd - perfStart} MS`)

    this.collisionList = [];
    for (let feature of features.features) {
      this.collisionList.push(new PolyBounds(feature.geometry.coordinates, feature.properties));
    }

    const perfBoundsEnd = performance.now();
    console.debug(`Collision boxes generated in ${perfBoundsEnd - perfEnd} MS`);
  }

  /**
   * @returns leaflet map object.
   */
  getMap() {
    return this.map;
  }

  /**
   * Tests the polygons on the map for any collisions with the specified point.
   * @param latlong - point to check for collisions.
   * @returns the polygon which contains the defined point.
   */
  testCollision(latlong: vec2) {
    for (let i = 0; i < this.collisionList.length; i++) {
      if (this.collisionList[i].testCollision(latlong)) {
        return this.collisionList[i];
      }
    }

    return null;
  }

  // cleans up features which may be improperly nested.
  private static cleanUpFeature(feature: DVRPCFeature) {
    const arr = feature.geometry.coordinates;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].length < 3) {
        // not a polygon, actual poly is nested down
        arr[i] = (arr[i][0] as unknown) as Point2D[];
      }
    }
  }

  // flips feature coordinates to negotiate between API and leaflet
  private static flipPolyData(feature: DVRPCFeature) {
    for (let poly of feature.geometry.coordinates) {
      for (let point of poly) {
        [point[0], point[1]] = [point[1], point[0]];
      }
    }
  }
}