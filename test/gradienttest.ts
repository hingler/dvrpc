import { expect } from "chai";
import { HSVGradient } from "../client/ts/gradient/HSVGradient"
import { vec3 } from "gl-matrix";

describe("gradientTest", function() {
  it("Creates a simple gradient between two colors", function() {
    const grad = new HSVGradient();
    grad.addRGBStop([255, 0, 0], 0);
    grad.addRGBStop([0, 255, 0], 1);
    
    const test = grad.getColor(0.5);
    expect(test.length).to.equal(3);
    const t3 = test as vec3;

    console.log(t3);

    expect(vec3.equals(t3, [255, 255, 0])).to.be.true;
  });
  it("Handles 0-hue cases", function() {
    const grad = new HSVGradient();
    grad.addRGBStop([0, 0, 0], 0);
    grad.addRGBStop([128, 128, 128], 1);

    const test = grad.getColor(0.5);
    expect(test.length).to.equal(3);

    const t3 = test as vec3;

    expect(vec3.equals(t3, [64, 64, 64])).to.be.true;
  });

});