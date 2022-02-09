import { DVRPCFeature, DVRPCFeatureCollection, Point2D } from "../mapdata/mapTypes";
import * as L from "leaflet";
import { PolyBounds } from "./PolyBounds";
import { vec2 } from "gl-matrix";

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
    for (let feature of features.features) {
      multipoly.push(feature.geometry.coordinates);
    }

    const perfStart = performance.now();
    const poly = L.polygon(multipoly, {color: "blue"}).addTo(map);
    map.fitBounds(poly.getBounds());
    const perfEnd = performance.now();
    
    console.log(`Polygons constructed in ${perfEnd - perfStart} MS`)

    this.collisionList = [];

    for (let feature of features.features) {
      this.collisionList.push(new PolyBounds(feature.geometry.coordinates, feature.properties));
    }

    const perfBoundsEnd = performance.now();

    console.log(`Collision boxes generated in ${perfBoundsEnd - perfEnd} MS`);
  }

  testCollision(latlong: vec2) {
    for (let i = 0; i < this.collisionList.length; i++) {
      if (this.collisionList[i].testCollision(latlong)) {
        console.log(this.collisionList[i].props);
        return this.collisionList[i];
      }
    }
  }

  private static cleanUpFeature(feature: DVRPCFeature) {
    // some features are incorrectly nested
    // a good marker for this is that we have an array of length 1
    const arr = feature.geometry.coordinates;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].length < 3) {
        // not a polygon, actual poly is nested down
        arr[i] = (arr[i][0] as unknown) as Point2D[];
      }
    }
  }

  private static flipPolyData(feature: DVRPCFeature) {
    if (feature.geometry.coordinates.length > 1) {
      console.log("eep!!!");
      console.log(feature.geometry.coordinates);
    }

    for (let poly of feature.geometry.coordinates) {
      for (let point of poly) {
        [point[0], point[1]] = [point[1], point[0]];
      }
    }
  }
}