import { expect } from "chai";
import { vec2 } from "gl-matrix";
import { polyBoundsCheck } from "../client/ts/maphandler/polyBoundsCheck";

function generatePoint(theta: number, radius: number) {
  const res = vec2.create();
  res[0] = Math.cos(theta) * radius;
  res[1] = Math.sin(theta) * radius;

  return res;
}

describe("polyBoundsCheck", function() {
  it("passes bounds check for a simple poly", function() {
    const poly : Array<vec2> = [];

    for (let i = 0; i < 16; i++) {
      poly.push(generatePoint(i * Math.PI / 8.0, 1.0));
    }

    expect(polyBoundsCheck(poly, [0, 0])).to.be.true;
    expect(polyBoundsCheck(poly, [0.999, 0])).to.be.true;
    expect(polyBoundsCheck(poly, [1.001, 0])).to.be.false;

    expect(polyBoundsCheck(poly, [-0.5, -0.5])).to.be.true;
  });

  it("passes bounds check on a convex quadrilateral", function() {
    const poly : Array<vec2> = [];
    poly.push([0, 0]);
    poly.push([1.0, -0.2]);
    poly.push([0.0, 1.0]);
    poly.push([-1.0, -0.2]);

    expect(polyBoundsCheck(poly, [0.0, 0.5])).to.be.true;
    expect(polyBoundsCheck(poly, [-0.5, 0.0])).to.be.true;
    expect(polyBoundsCheck(poly, [0.0, -0.1])).to.be.false;
  });

  it("handles cw rotation order", function() {
    const poly: Array<vec2> = [];
    for (let i = 0; i < 16; i++) {
      poly.push(generatePoint((2.0 * Math.PI) - (i * Math.PI / 8.0), 1.0));
    }

    expect(polyBoundsCheck(poly, [0, 0])).to.be.true;
    expect(polyBoundsCheck(poly, [0.999, 0])).to.be.true;
    expect(polyBoundsCheck(poly, [1.001, 0])).to.be.false;

    expect(polyBoundsCheck(poly, [-0.5, -0.5])).to.be.true;
  })
});