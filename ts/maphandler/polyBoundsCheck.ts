import { vec2 } from "gl-matrix";

export function polyBoundsCheck(poly: Array<vec2>, point: vec2) {
  const temp = [] as Array<number> as vec2;

  let angPrev : number;
  let angCur  : number;

  let angSum = 0;

  vec2.sub(temp, poly[0], point);
  vec2.normalize(temp, temp);
  angPrev = Math.atan2(temp[1], temp[0]);

  for (let i = 1; i <= poly.length; i++) {
    vec2.sub(temp, poly[i % poly.length], point);
    vec2.normalize(temp, temp);
    angCur = Math.atan2(temp[1], temp[0]);
    let dist = angCur - angPrev;
    if (Math.abs(dist) > Math.PI) {
      dist = -Math.sign(dist) * ((2 * Math.PI) - Math.abs(dist));
    }

    angSum += dist;
    angPrev = angCur;
  }

  return Math.abs(angSum) > (Math.PI);
}