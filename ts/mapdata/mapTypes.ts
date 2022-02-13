// data returned by DVRPC API

export type Point2D = [number, number];

export interface DVRPCInfo {
  type: string;
}

// properties for each map region
export interface DVRPCProperties extends DVRPCInfo {
  readonly d_score: number,
  readonly em_score: number,
  readonly f_score: number,
  readonly fb_score: number,
  readonly ipd_score: number,
  readonly lep_score: number,
  readonly li_score: number,
  readonly oa_score: number,
  readonly rm_score: number,
  readonly y_score: number
}

// geometry data
export interface DVRPCPolygon extends DVRPCInfo {
  type: "Polygon",
  coordinates: Array<Array<Point2D>>
}

// map region data
export interface DVRPCFeature extends DVRPCInfo {
  type: "Feature",
  geometry: DVRPCPolygon,
  properties: DVRPCProperties
}

// API return data
export interface DVRPCFeatureCollection extends DVRPCInfo {
  type: "FeatureCollection",
  features: Array<DVRPCFeature>;
}