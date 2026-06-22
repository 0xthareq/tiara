import { useEffect, useRef } from "react";

/* ─── Vec2 ─────────────────────────────────────────────────── */
class Vec2 {
  constructor(x = 0, y = 0) { this.x = x; this.y = y; }
  copy()      { return new Vec2(this.x, this.y); }
  add(v)      { this.x += v.x; this.y += v.y; return this; }
  mult(n)     { this.x *= n;   this.y *= n;   return this; }
  div(n)      { if (n !== 0) { this.x /= n; this.y /= n; } return this; }
  mag()       { return Math.hypot(this.x, this.y); }
  normalize() { const m = this.mag(); if (m > 0) this.div(m); return this; }
  limit(max)  { if (this.mag() > max) this.normalize().mult(max); return this; }
  heading()   { return Math.atan2(this.y, this.x); }
  static sub(a, b)  { return new Vec2(a.x - b.x, a.y - b.y); }
  static dist(a, b) { return Math.hypot(a.x - b.x, a.y - b.y); }
}

const AZURE      = "#1E4FDE";
const GREY_FILL  = "rgba(155,160,172,0.42)";
const MAX_BOIDS  = 250;

/* ─── Boid ──────────────────────────────────────────────────── */
class Boid {
  constructor(x, y, isLeader = false, color = null) {
    this.pos         = new Vec2(x, y);
    this.vel         = new Vec2((Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2);
    this.acc         = new Vec2();
    this.maxSpeed    = isLeader ? 2.2 : 3;
    this.maxForce    = 0.05;
    this.isLeader    = isLeader;
    this.color       = color ?? (isLeader ? AZURE : GREY_FILL);
    this.wanderAngle = Math.random() * Math.PI * 2;
  }

  applyForce(f) { this.acc.add(f); }

  update() {
    this.vel.add(this.acc).limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  borders(w, h) {
    const r = 4;
    if (this.pos.x < -r)  this.pos.x = w + r;
    if (this.pos.y < -r)  this.pos.y = h + r;
    if (this.pos.x > w+r) this.pos.x = -r;
    if (this.pos.y > h+r) this.pos.y = -r;
  }

  wander() {
    this.wanderAngle += (Math.random() - 0.5) * 0.25;
    this.applyForce(new Vec2(
      Math.cos(this.wanderAngle) * 5.5,
      Math.sin(this.wanderAngle) * 5.5,
    ));
  }

  separate(boids) {
    const dist = 20;
    let sx = 0, sy = 0, count = 0;
    for (const o of boids) {
      const d = Vec2.dist(this.pos, o.pos);
      if (d > 0 && d < dist) { sx += (this.pos.x - o.pos.x) / d; sy += (this.pos.y - o.pos.y) / d; count++; }
    }
    if (!count) return new Vec2();
    const steer = new Vec2(sx / count, sy / count);
    if (steer.mag() > 0) steer.normalize().mult(this.maxSpeed).add(new Vec2(-this.vel.x, -this.vel.y)).limit(this.maxForce);
    return steer;
  }

  align(boids) {
    const dist = 40;
    let sx = 0, sy = 0, count = 0;
    for (const o of boids) {
      const d = Vec2.dist(this.pos, o.pos);
      if (d > 0 && d < dist) { sx += o.vel.x; sy += o.vel.y; count++; }
    }
    if (!count) return new Vec2();
    const desired = new Vec2(sx / count, sy / count).normalize().mult(this.maxSpeed);
    return Vec2.sub(desired, this.vel).limit(this.maxForce);
  }

  cohesion(boids) {
    const dist = 50;
    let sx = 0, sy = 0, count = 0;
    for (const o of boids) {
      const d = Vec2.dist(this.pos, o.pos);
      if (d > 0 && d < dist) { sx += o.pos.x; sy += o.pos.y; count++; }
    }
    if (!count) return new Vec2();
    const desired = Vec2.sub(new Vec2(sx / count, sy / count), this.pos).normalize().mult(this.maxSpeed);
    return Vec2.sub(desired, this.vel).limit(this.maxForce);
  }

  flock(boids) {
    if (this.isLeader) {
      this.wander();
    } else {
      const sep = this.separate(boids); sep.mult(1.5);
      this.applyForce(sep);
      this.applyForce(this.align(boids));
      this.applyForce(this.cohesion(boids));
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.pos.x, this.pos.y);
    ctx.rotate(this.vel.heading());
    ctx.scale(0.02, 0.02);
    ctx.translate(-474, -680);
    ctx.fillStyle   = this.color;
    ctx.strokeStyle = this.color;

    ctx.beginPath();
    ctx.moveTo(0, 554.58);
    ctx.bezierCurveTo(0, 539.58, 12.28, 527.30, 27.28, 527.30);
    ctx.bezierCurveTo(137.78, 527.30, 237.37, 570.95, 311.03, 641.90);
    ctx.bezierCurveTo(350.59, 588.70, 376.51, 524.72, 381.97, 453.78);
    ctx.lineTo(154.15, 452.53);
    ctx.bezierCurveTo(139.15, 452.53, 126.87, 440.26, 126.87, 425.25);
    ctx.bezierCurveTo(126.87, 410.24, 139.15, 397.97, 154.15, 397.97);
    ctx.lineTo(410.62, 397.97);
    ctx.bezierCurveTo(582.50, 397.97, 744.84, 464.81, 866.25, 586.22);
    ctx.lineTo(941.28, 661.25);
    ctx.bezierCurveTo(946.73, 666.71, 949.46, 673.53, 949.46, 680.35);
    ctx.bezierCurveTo(949.46, 687.17, 946.73, 693.99, 941.28, 699.45);
    ctx.lineTo(866.25, 774.48);
    ctx.bezierCurveTo(744.84, 896.89, 582.50, 963.73, 410.62, 963.73);
    ctx.lineTo(154.15, 963.73);
    ctx.bezierCurveTo(139.15, 963.73, 126.87, 951.46, 126.87, 936.45);
    ctx.bezierCurveTo(126.87, 921.44, 139.15, 909.17, 154.15, 909.17);
    ctx.lineTo(381.97, 909.17);
    ctx.bezierCurveTo(376.51, 839.69, 350.59, 774.21, 311.03, 721.01);
    ctx.bezierCurveTo(237.37, 791.95, 137.78, 835.60, 27.28, 835.60);
    ctx.bezierCurveTo(12.28, 835.60, 0, 823.32, 0, 808.32);
    ctx.bezierCurveTo(0, 793.31, 12.28, 781.03, 27.28, 781.03);
    ctx.bezierCurveTo(124.14, 781.03, 211.45, 742.84, 275.56, 680.09);
    ctx.bezierCurveTo(211.45, 617.33, 124.14, 579.14, 27.28, 579.14);
    ctx.bezierCurveTo(12.28, 581.87, 0, 569.59, 0, 554.58);
    ctx.moveTo(883.98, 682.81);
    ctx.lineTo(828.05, 626.88);
    ctx.bezierCurveTo(723.01, 521.84, 585.23, 460.45, 436.53, 455.00);
    ctx.bezierCurveTo(431.08, 540.94, 398.34, 620.06, 347.86, 682.81);
    ctx.bezierCurveTo(398.34, 745.57, 431.08, 824.69, 436.53, 910.63);
    ctx.bezierCurveTo(583.87, 903.81, 723.01, 843.79, 828.05, 738.74);
    ctx.lineTo(883.98, 682.81);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
}

/* ─── Spawn warna TIARA ─────────────────────────────────────── */
const SPAWN_COLORS = [AZURE, AZURE, AZURE, "#2AA87A", "#E08A2C"];
const randSpawnColor = () => SPAWN_COLORS[Math.floor(Math.random() * SPAWN_COLORS.length)];
const randThreshold  = () => Math.floor(Math.random() * 6) + 5; // 5–10

/* ─── Component ─────────────────────────────────────────────── */
export default function BoidCanvas() {
  const canvasRef = useRef(null);
  const boidsRef  = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const syncSize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    syncSize();
    window.addEventListener("resize", syncSize);

    /* init kawanan awal */
    const w = canvas.width, h = canvas.height;
    const boids = [];
    for (let i = 0; i < 70; i++) {
      const isLeader = i === 0;
      const x = i < 35 ? w / 2 : Math.random() * w;
      const y = i < 35 ? h / 2 : Math.random() * h;
      boids.push(new Boid(x, y, isLeader));
    }
    boidsRef.current = boids;

    /* animation loop */
    let raf;
    const loop = () => {
      const cw = canvas.width, ch = canvas.height;
      ctx.clearRect(0, 0, cw, ch);
      for (const b of boids) {
        b.flock(boids);
        b.update();
        b.borders(cw, ch);
        b.draw(ctx);
      }
      raf = requestAnimationFrame(loop);
    };
    loop();

    /* click: spawn ikan berwarna dengan interval random */
    let clickCount = 0;
    let threshold  = randThreshold();

    const onWindowClick = (e) => {
      clickCount++;
      if (clickCount >= threshold) {
        if (boids.length < MAX_BOIDS) {
          const spawnCount = Math.floor(Math.random() * 3) + 1; // 1–3 ikan
          for (let i = 0; i < spawnCount; i++) {
            const color = i === 0 ? randSpawnColor() : GREY_FILL;
            const b = new Boid(e.clientX, e.clientY, false, color);
            // arah acak agar langsung menyebar
            b.vel = new Vec2((Math.random() - 0.5) * 4, (Math.random() - 0.5) * 4);
            boids.push(b);
          }
        }
        clickCount = 0;
        threshold  = randThreshold();
      }
    };
    window.addEventListener("click", onWindowClick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", syncSize);
      window.removeEventListener("click", onWindowClick);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: -1,
      }}
    />
  );
}
