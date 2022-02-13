import { vec3 } from "gl-matrix";

export class HSVGradient {
  private colorList: Array<vec3>;
  private stopList: Array<number>;

  constructor() {
    this.colorList = [];
    this.stopList = [];
  }

  // https://mattlockyer.github.io/iat455/documents/rgb-hsv.pdf

  addRGBStop(col: vec3, stop: number) {
    const colHSV = HSVGradient.rgbToHSV(col);

    if (this.stopList.length === 0) {
      this.stopList.push(stop);
      this.colorList.push(colHSV);
    } else {
      let stopIndex = -1;
      for (let i = 0; i < this.stopList.length; i++) {
        if (stop < this.stopList[i]) {
          stopIndex = i;
          break;
        }
      }

      if (stopIndex === -1) {
        // stop > all stops
        this.stopList.push(stop);
        this.colorList.push(colHSV);
      } else {
        this.stopList.splice(stopIndex, 0, stop);
        this.colorList.splice(stopIndex, 0, colHSV);
      }
    }
  }

  getColor(stop: number) {
    if (this.colorList.length === 0) {
      return [0, 0, 0];
    }

    let stopIndex = -1;
    for (let i = 0; i < this.stopList.length; i++) {
      if (stop < this.stopList[i]) {
        stopIndex = i;
        break;
      }
    }
    
    if (stopIndex === -1) {
      return HSVGradient.hsvToRGB(this.colorList[this.colorList.length - 1]);
    } else if (stopIndex === 0) {
      return HSVGradient.hsvToRGB(this.colorList[0]);
    }

    const res = [] as Array<number> as vec3;
    const stopA = this.stopList[stopIndex - 1];
    const stopB = this.stopList[stopIndex];
    const stopDelta = stopB - stopA;

    const stopMix = ((stop - stopA) / stopDelta);

    vec3.zero(res);
    vec3.scaleAndAdd(res, res, this.colorList[stopIndex - 1], (1.0 - stopMix));
    vec3.scaleAndAdd(res, res, this.colorList[stopIndex], stopMix);
    return HSVGradient.hsvToRGB(res);
  }

  private static hsvToRGB(hsv: vec3) {
    if (isNaN(hsv[0])) {
      return [hsv[2], hsv[2], hsv[2]];
    }

    const alpha = hsv[2] * (1 - hsv[1]);
    const beta = hsv[2] * (1 - (hsv[0] - Math.floor(hsv[0])) * hsv[1]);
    const gamma = hsv[2] * (1 - (1 - (hsv[0] - Math.floor(hsv[0]))) * hsv[1]);

    switch (Math.floor(hsv[0])) {
      case 0:
        return [hsv[2], gamma, alpha];
      case 1:
        return [beta, hsv[2], alpha];
      case 2:
        return [alpha, hsv[2], gamma];
      case 3:
        return [alpha, beta, hsv[2]];
      case 4:
        return [gamma, alpha, hsv[2]];
      case 5:
        return [hsv[2], alpha, beta];
    }
  }

  private static rgbToHSV(col: vec3) {
    let maxChannel = -1;
    let minChannel = -1;
    const maxValue = Math.max(...col);
    const minValue = Math.min(...col);

    for (let i = 0; i < 3; i++) {
      if (maxValue === col[i]) {
        maxChannel = i;
      }
      
      if (minValue === col[i]) {
        minChannel = i;
      }
    }

    if (maxChannel === -1 || minChannel === -1) {
      throw Error("max func modifies floating point values");
    }

    const delta = maxValue - minValue;
    const hueDiff = col[(maxChannel + 1) % 3] - col[(maxChannel + 2) % 3];

    // 0 - 6, from the paper
    // NaN will be our undefined val placeholder
    const hue = (delta === 0 ? NaN : hueDiff / delta + 2 * maxChannel);
    const val = maxValue;
    const sat = (val === 0 ? 0 : (maxValue - minValue) / val);

    return [hue, sat, val] as vec3;
  }
}