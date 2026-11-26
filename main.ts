// The World Today — front page for Thursday 26 November 2026.
// Draws a newspaper front page summarising the day's world news with
// @napi-rs/canvas and writes it to $MAKEFUN_OUTPUT_DIR/entry.png
// (default /output/entry.png).
import { createCanvas } from "@napi-rs/canvas";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const W = 1024;
const H = 1024;
const INK = "#1a1a1a";
const PAPER = "#f7f2e7";
const RED = "#a41212";
const BLUE = "#1d4e89";

const canvas = createCanvas(W, H);
const ctx = canvas.getContext("2d");

// ---------- helpers ----------
function wrapText(text: string, maxWidth: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const test = line ? line + " " + word : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function para(text: string, x: number, y: number, w: number, size: number, lh: number, color = INK): number {
  ctx.fillStyle = color;
  ctx.font = `${size}px sans-serif`;
  const lines = wrapText(text, w);
  for (const line of lines) {
    ctx.fillText(line, x, y);
    y += lh;
  }
  return y;
}

function headline(text: string, x: number, y: number, w: number, size: number, lh: number): number {
  ctx.fillStyle = INK;
  ctx.font = `bold ${size}px sans-serif`;
  const lines = wrapText(text, w);
  for (const line of lines) {
    ctx.fillText(line, x, y);
    y += lh;
  }
  return y;
}

function rule(x: number, y: number, w: number, thick = 2): void {
  ctx.fillStyle = INK;
  ctx.fillRect(x, y, w, thick);
}

function kicker(text: string, x: number, y: number): void {
  ctx.fillStyle = RED;
  ctx.font = "bold 13px sans-serif";
  ctx.fillText(text.toUpperCase(), x, y);
}

// ---------- paper ----------
ctx.fillStyle = PAPER;
ctx.fillRect(0, 0, W, H);
ctx.strokeStyle = INK;
ctx.lineWidth = 3;
ctx.strokeRect(6, 6, W - 12, H - 12);

// ---------- masthead ----------
ctx.fillStyle = INK;
ctx.textAlign = "center";
ctx.font = "bold 72px Georgia, serif";
ctx.fillText("THE WORLD TODAY", W / 2, 92);
ctx.textAlign = "left";
rule(28, 108, W - 56, 3);
rule(28, 114, W - 56, 1);
ctx.font = "bold 21px Georgia, serif";
ctx.textAlign = "center";
ctx.fillText("THURSDAY, 26 NOVEMBER 2026", W / 2, 146);
ctx.textAlign = "left";
ctx.font = "14px sans-serif";
ctx.fillStyle = "#555555";
ctx.fillText("No. 330  •  Price: one day's news", 28, 146);
ctx.fillText("World edition", W - 28 - ctx.measureText("World edition").width, 146);
ctx.fillStyle = INK;
rule(28, 158, W - 56, 2);

// ---------- LEAD: US tariffs ----------
const LX = 28;
const LW = 600;
// container-ship illustration
ctx.save();
ctx.translate(LX, 176);
ctx.fillStyle = "#cfe3f2";
ctx.fillRect(0, 0, LW, 160);
ctx.fillStyle = "#7fa8c9";
ctx.fillRect(0, 132, LW, 28); // sea
ctx.fillStyle = "#ffffff";
ctx.beginPath();
ctx.ellipse(90, 42, 60, 14, 0, 0, Math.PI * 2);
ctx.ellipse(210, 30, 80, 16, 0, 0, Math.PI * 2);
ctx.ellipse(420, 44, 70, 13, 0, 0, Math.PI * 2);
ctx.fill();
// ship hull
ctx.fillStyle = "#22384f";
ctx.beginPath();
ctx.moveTo(60, 118);
ctx.lineTo(540, 118);
ctx.lineTo(505, 152);
ctx.lineTo(95, 152);
ctx.closePath();
ctx.fill();
// containers
const cols = ["#b3402e", "#2e6b34", "#c98a1b", "#33527a", "#7a2e5e", "#b3402e", "#2e6b34", "#c98a1b"];
for (let i = 0; i < 8; i++) {
  ctx.fillStyle = cols[i];
  ctx.fillRect(95 + i * 52, 84, 48, 34);
  ctx.fillStyle = "rgba(255,255,255,0.25)";
  ctx.fillRect(95 + i * 52, 84, 48, 5);
}
ctx.fillStyle = "#22384f";
ctx.fillRect(470, 46, 34, 38); // bridge
ctx.fillStyle = "#ffd34d";
ctx.fillRect(476, 52, 22, 10);
// tariff bars rising at right
ctx.fillStyle = "#a41212";
const bars = [26, 44, 62, 84];
for (let i = 0; i < 4; i++) {
  ctx.fillRect(540 + i * 14, 150 - bars[i], 10, bars[i]);
}
ctx.restore();
ctx.fillStyle = INK;
ctx.font = "italic 13px Georgia, serif";
ctx.fillText("Container shipping faces new US tariffs on goods from China, the EU and Brazil.", LX, 356);

let y = 384;
kicker("Trade  •  Washington", LX, y);
y = headline("US UNVEILS SWEEPING NEW TARIFFS ON CHINA, EU AND BRAZIL", LX, y + 30, LW, 30, 35);
y = para(
  "The Trump administration announces broad new tariffs on imports from China, the EU, Brazil and others, saying the duties answer subsidised factories abroad.",
  LX, y + 8, LW, 15, 20,
);

// ---------- RIGHT COLUMN TOP: Cairo fire ----------
const RX = 656;
const RW = 340;
ctx.save();
ctx.translate(RX, 176);
ctx.fillStyle = "#f3d9c2";
ctx.fillRect(0, 0, RW, 160);
// highway
ctx.fillStyle = "#3a3a3a";
ctx.fillRect(0, 108, RW, 52);
ctx.fillStyle = "#f7f2e7";
for (let i = 0; i < 5; i++) ctx.fillRect(10 + i * 68, 136, 34, 5);
// tanker
ctx.fillStyle = "#8c8c8c";
ctx.fillRect(60, 76, 200, 34);
ctx.beginPath();
ctx.arc(260, 93, 17, 0, Math.PI * 2);
ctx.fill();
ctx.fillStyle = "#22384f";
ctx.fillRect(270, 76, 34, 34);
ctx.fillStyle = "#1a1a1a";
ctx.beginPath();
ctx.arc(100, 114, 13, 0, Math.PI * 2);
ctx.arc(230, 114, 13, 0, Math.PI * 2);
ctx.fill();
// flames
ctx.fillStyle = "#e8641b";
ctx.beginPath();
ctx.moveTo(120, 80); ctx.quadraticCurveTo(100, 20, 150, 2);
ctx.quadraticCurveTo(160, 40, 190, 24); ctx.quadraticCurveTo(200, 60, 180, 80);
ctx.closePath(); ctx.fill();
ctx.fillStyle = "#f7b731";
ctx.beginPath();
ctx.moveTo(140, 80); ctx.quadraticCurveTo(135, 42, 158, 28);
ctx.quadraticCurveTo(168, 52, 162, 80);
ctx.closePath(); ctx.fill();
ctx.restore();
ctx.fillStyle = INK;
ctx.font = "italic 13px Georgia, serif";
ctx.fillText("A fuel tanker crash set a Cairo highway ablaze.", RX, 356);

y = 384;
kicker("Disaster  •  Cairo", RX, y);
y = headline("FUEL TANKER FIRE ON CAIRO HIGHWAY KILLS AT LEAST 31", RX, y + 30, RW, 22, 26);
y = para(
  "A fuel tanker crash ignites a massive fire on a major highway around Cairo. At least 31 people are killed.",
  RX, y + 6, RW, 15, 20,
);

rule(28, 620, W - 56, 2);

// ---------- LOWER GRID: five stories ----------
const GY = 644;
// five columns: x positions
const xs = [28, 228, 428, 628, 828];
const cw = 168;

function story(x: number, kick: string, head: string, body: string, draw: (ox: number, oy: number) => void): void {
  ctx.save();
  ctx.translate(x, GY);
  ctx.fillStyle = "#e9e2d0";
  ctx.fillRect(0, 0, cw, 96);
  draw(0, 0);
  ctx.restore();
  let yy = GY + 118;
  kicker(kick, x, yy);
  yy = headline(head, x, yy + 24, cw, 17, 21);
  para(body, x, yy + 4, cw, 13, 17);
}

// 1. Iowa detonation — explosion burst
story(xs[0], "USA • Iowa", "ARMY BLOWS UP 5 TONS OF TOXIC EXPLOSIVE",
  "The US Army detonates nearly 10,000 lb of unstable lead azide in Iowa after a court clears the way.",
  (ox, oy) => {
    ctx.fillStyle = "#f7b731";
    ctx.save(); ctx.translate(ox + 84, oy + 48);
    for (let i = 0; i < 12; i++) {
      ctx.rotate(Math.PI / 6);
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(10, -46); ctx.lineTo(-10, -46); ctx.closePath(); ctx.fill();
    }
    ctx.restore();
    ctx.fillStyle = "#e8641b";
    ctx.beginPath(); ctx.arc(ox + 84, oy + 48, 22, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#a41212";
    ctx.beginPath(); ctx.arc(ox + 84, oy + 48, 11, 0, Math.PI * 2); ctx.fill();
  });

// 2. Colombia hostages — storefront
story(xs[1], "Colombia", "POLICE FREE 20 HOSTAGES IN SUPERMARKET",
  "Colombian police storm a supermarket and free 20 people held hostage for 17 hours.",
  (ox, oy) => {
    ctx.fillStyle = "#33527a";
    ctx.fillRect(ox + 34, oy + 30, 100, 66);
    ctx.fillStyle = "#f7f2e7";
    ctx.fillRect(ox + 44, oy + 40, 80, 22);
    ctx.fillStyle = "#c98a1b";
    ctx.fillRect(ox + 34, oy + 22, 100, 10);
    ctx.fillStyle = "#1a1a1a";
    ctx.font = "bold 11px sans-serif";
    ctx.fillText("MARKET", ox + 58, oy + 56);
    ctx.fillStyle = "#2e6b34";
    ctx.fillRect(ox + 74, oy + 70, 20, 26);
  });

// 3. Pakistan astronaut — rocket
story(xs[2], "Space • China", "PAKISTAN'S FIRST ASTRONAUT HEADS TO SPACE",
  "China selects a Pakistani payload specialist for Shenzhou-24 — the first foreign national chosen for its space station.",
  (ox, oy) => {
    ctx.fillStyle = "#1d2f4a";
    ctx.fillRect(ox, oy, cw, 96);
    ctx.fillStyle = "#ffffff";
    for (const [sx, sy] of [[20, 18], [60, 30], [140, 16], [120, 44], [30, 70], [150, 70]]) {
      ctx.beginPath(); ctx.arc(ox + sx, oy + sy, 2, 0, Math.PI * 2); ctx.fill();
    }
    ctx.fillStyle = "#e8e8e8";
    ctx.beginPath();
    ctx.moveTo(ox + 84, oy + 12); ctx.quadraticCurveTo(ox + 100, oy + 36, ox + 96, oy + 66);
    ctx.lineTo(ox + 72, oy + 66); ctx.quadraticCurveTo(ox + 68, oy + 36, ox + 84, oy + 12);
    ctx.fill();
    ctx.fillStyle = "#e8641b";
    ctx.beginPath();
    ctx.moveTo(ox + 74, oy + 66); ctx.lineTo(ox + 84, oy + 92); ctx.lineTo(ox + 94, oy + 66);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#2e6b34";
    ctx.fillRect(ox + 80, oy + 34, 8, 10);
  });

// 4. Huawei — chip / gavel
story(xs[3], "Tech • USA", "HUAWEI GUILTY OF STEALING US TRADE SECRETS",
  "A US court convicts the Chinese tech giant on 10 counts, including theft of trade secrets.",
  (ox, oy) => {
    ctx.fillStyle = "#22384f";
    ctx.fillRect(ox + 54, oy + 28, 60, 60);
    ctx.fillStyle = "#c98a1b";
    ctx.fillRect(ox + 74, oy + 48, 20, 20);
    ctx.strokeStyle = "#c98a1b";
    ctx.lineWidth = 3;
    for (let i = 0; i < 4; i++) {
      ctx.beginPath(); ctx.moveTo(ox + 54, oy + 38 + i * 14); ctx.lineTo(ox + 42, oy + 38 + i * 14); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(ox + 114, oy + 38 + i * 14); ctx.lineTo(ox + 126, oy + 38 + i * 14); ctx.stroke();
    }
    ctx.fillStyle = "#a41212";
    ctx.font = "bold 12px sans-serif";
    ctx.fillText("GUILTY", ox + 62, oy + 20);
  });

// 5. Sandringham — house
story(xs[4], "UK • Royals", "TWO CHARGED OVER BREAK-IN AT ROYAL HOME",
  "Two men are charged after a break-in at the Sandringham Estate, home of the Prince and Princess of Wales.",
  (ox, oy) => {
    ctx.fillStyle = "#2e6b34";
    ctx.fillRect(ox, oy + 72, cw, 24);
    ctx.fillStyle = "#8c5a2e";
    ctx.beginPath();
    ctx.moveTo(ox + 34, oy + 52); ctx.lineTo(ox + 84, oy + 22); ctx.lineTo(ox + 134, oy + 52);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#c98a1b";
    ctx.fillRect(ox + 44, oy + 52, 80, 28);
    ctx.fillStyle = "#1d4e89";
    ctx.fillRect(ox + 74, oy + 60, 20, 20);
    ctx.fillStyle = "#f7f2e7";
    ctx.fillRect(ox + 52, oy + 58, 14, 14);
    ctx.fillRect(ox + 102, oy + 58, 14, 14);
  });

rule(28, 936, W - 56, 1);
ctx.fillStyle = "#555555";
ctx.font = "13px sans-serif";
ctx.textAlign = "center";
ctx.fillText("All stories first reported on Thursday 26 November 2026  •  Sources: AP, BBC, Reuters, France 24", W / 2, 962);
ctx.font = "italic 13px Georgia, serif";
ctx.fillText("— The World Today —", W / 2, 988);
ctx.textAlign = "left";

// ---------- write ----------
const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.png");
writeFileSync(outPath, canvas.toBuffer("image/png"));
console.log("wrote", outPath);
