import { vec3 } from "gl-matrix";

// work with 255 as max
export function rgbToHexString(col: vec3) {
  let colR = Math.floor(col[0]).toString(16);
  let colG = Math.floor(col[1]).toString(16);
  let colB = Math.floor(col[2]).toString(16);
  if (colR.length < 2) {
    colR = "0" + colR;
  } 
  if (colG.length < 2) {
    colG = "0" + colG;
  } 
  if (colB.length < 2) {
    colB = "0" + colB;
  }

  return `#${colR}${colG}${colB}`;
}