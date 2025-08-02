import { geometry } from "../geometry";
import objLine from "./line.js";

export default {
  name: "microscopeSlide",

  create(mouse) {
    return { p1: mouse, p2: mouse };
  },

  draw(obj, canvas) {
    const ctx = canvas.getContext("2d");
    ctx.strokeStyle = "rgba(0, 128, 255, 0.5)";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(obj.p1.x, obj.p1.y);
    ctx.lineTo(obj.p2.x, obj.p2.y);
    ctx.stroke();
  },

  shoot(ray, obj) {
    const rp1 = ray.p;
    const rp2 = geometry.point(ray.p.x + Math.cos(ray.angle), ray.p.y + Math.sin(ray.angle));
    const sp1 = obj.p1;
    const sp2 = obj.p2;

    const intersect = geometry.linesIntersection(rp1, rp2, sp1, sp2);
    if (!intersect) return;

    const norm = geometry.normal(sp1, sp2);
    const incidence = ray.angle;
    const reflectAngle = geometry.reflect(incidence, norm);

    // Reflectivity varies along x
    const R = 0.2 + 0.6 * Math.abs(Math.sin(intersect.x / 30));

    // Reflect ray
    ray.addRay({
      p: intersect,
      angle: reflectAngle,
      brightness: ray.brightness * R,
    });

    // Transmit ray
    ray.addRay({
      p: intersect,
      angle: ray.angle,
      brightness: ray.brightness * (1 - R),
    });
  },

  move: objLine.move,
  rotate: objLine.rotate,
  getShotData: objLine.getShotData,
};
