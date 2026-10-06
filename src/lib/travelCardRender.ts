// Draws the personal Travel Card on a canvas. 1080x1350 (4:5) is the largest portrait ratio the Facebook
// mobile feed shows without cropping. Everything is drawn locally: no network, no external images.
import { DATA } from '../data/map-data';
import { DISTRICT_DETAILS, DIVISIONS, toBengaliNumber } from '../data/bangladesh-data';
import { routeLabel, type CardData } from './travelCard';

export const CARD_W = 1080;
export const CARD_H = 1350;

const GOLD = '#f5b83d';
const GOLD_SOFT = '#fcd77f';
const FONT = '"Anek Bangla", "Noto Sans Bengali", sans-serif';
const f = (weight: number, size: number) => `${weight} ${size}px ${FONT}`;

type Ctx = CanvasRenderingContext2D;

function spaced(ctx: Ctx, px: number) {
  if ('letterSpacing' in ctx) (ctx as unknown as { letterSpacing: string }).letterSpacing = `${px}px`;
}

function fit(ctx: Ctx, text: string, x: number, y: number, maxW: number, weight: number, size: number, min = 18) {
  let s = size;
  ctx.font = f(weight, s);
  while (ctx.measureText(text).width > maxW && s > min) {
    s -= 2;
    ctx.font = f(weight, s);
  }
  let t = text;
  while (ctx.measureText(t).width > maxW && t.length > 3) t = `${t.slice(0, -2)}…`;
  ctx.fillText(t, x, y);
}

function wrap(ctx: Ctx, text: string, maxW: number, maxLines: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let cur = '';
  for (const w of words) {
    const next = cur ? `${cur} ${w}` : w;
    if (ctx.measureText(next).width <= maxW) cur = next;
    else {
      if (cur) lines.push(cur);
      cur = w;
    }
  }
  if (cur) lines.push(cur);
  if (lines.length > maxLines) {
    const kept = lines.slice(0, maxLines);
    let last = kept[maxLines - 1];
    while (ctx.measureText(`${last}…`).width > maxW && last.length > 1) last = last.slice(0, -1);
    kept[maxLines - 1] = `${last}…`;
    return kept;
  }
  return lines;
}

function panel(ctx: Ctx, x: number, y: number, w: number, h: number, accent = false) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, 26);
  ctx.fillStyle = accent ? 'rgba(245,184,61,0.12)' : 'rgba(255,255,255,0.07)';
  ctx.fill();
  ctx.strokeStyle = accent ? 'rgba(245,184,61,0.55)' : 'rgba(255,255,255,0.16)';
  ctx.lineWidth = 2;
  ctx.stroke();
}

function star(ctx: Ctx, cx: number, cy: number, r: number, filled: boolean) {
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const a = (Math.PI / 5) * i - Math.PI / 2;
    const rad = i % 2 === 0 ? r : r * 0.45;
    ctx.lineTo(cx + Math.cos(a) * rad, cy + Math.sin(a) * rad);
  }
  ctx.closePath();
  ctx.fillStyle = filled ? GOLD : 'rgba(255,255,255,0.18)';
  ctx.fill();
}

function background(ctx: Ctx) {
  const g = ctx.createLinearGradient(0, 0, CARD_W, CARD_H);
  g.addColorStop(0, '#021a16');
  g.addColorStop(0.55, '#064e3b');
  g.addColorStop(1, '#0a6b58');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, CARD_W, CARD_H);

  for (const [x, y, r, c] of [
    [880, 120, 420, 'rgba(245,184,61,0.16)'],
    [120, 1200, 460, 'rgba(16,185,129,0.20)'],
  ] as const) {
    const rg = ctx.createRadialGradient(x, y, 0, x, y, r);
    rg.addColorStop(0, c);
    rg.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = rg;
    ctx.fillRect(0, 0, CARD_W, CARD_H);
  }

  ctx.fillStyle = 'rgba(255,255,255,0.05)';
  for (let x = 40; x < CARD_W; x += 36) for (let y = 40; y < CARD_H; y += 36) ctx.fillRect(x, y, 2, 2);

  ctx.strokeStyle = 'rgba(245,184,61,0.55)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(22, 22, CARD_W - 44, CARD_H - 44, 40);
  ctx.stroke();
}

function drawMap(ctx: Ctx, d: CardData, ox: number, oy: number, height: number) {
  const s = height / DATA.h;
  const visited = new Set(d.visited);
  ctx.save();
  ctx.translate(ox, oy);
  ctx.scale(s, s);
  ctx.lineJoin = 'round';

  for (const feat of DATA.f) {
    if (visited.has(feat.n)) continue;
    const p = new Path2D(feat.d);
    ctx.fillStyle = 'rgba(255,255,255,0.09)';
    ctx.fill(p);
    ctx.strokeStyle = 'rgba(255,255,255,0.28)';
    ctx.lineWidth = 1 / s;
    ctx.stroke(p);
  }
  for (const feat of DATA.f) {
    if (!visited.has(feat.n)) continue;
    const p = new Path2D(feat.d);
    ctx.save();
    ctx.shadowColor = 'rgba(245,184,61,0.65)';
    ctx.shadowBlur = 16;
    const gr = ctx.createLinearGradient(0, 0, DATA.w, DATA.h);
    gr.addColorStop(0, GOLD_SOFT);
    gr.addColorStop(1, '#e8960f');
    ctx.fillStyle = gr;
    ctx.fill(p);
    ctx.restore();
    ctx.strokeStyle = 'rgba(2,26,22,0.55)';
    ctx.lineWidth = 1.2 / s;
    ctx.stroke(p);
  }

  if (d.plan) {
    const pts = d.plan.route
      .map((id) => DATA.f.find((x) => x.n === id)?.c)
      .filter((c): c is [number, number] => !!c);
    if (pts.length > 1) {
      ctx.setLineDash([9 / s, 7 / s]);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3 / s;
      ctx.beginPath();
      pts.forEach(([x, y], i) => (i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)));
      ctx.stroke();
      ctx.setLineDash([]);
      pts.forEach(([x, y], i) => {
        ctx.beginPath();
        ctx.arc(x, y, 11 / s, 0, Math.PI * 2);
        ctx.fillStyle = i === 0 ? '#ffffff' : '#021a16';
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2.5 / s;
        ctx.stroke();
        if (i === 0) {
          star(ctx, x, y, 7 / s, true);
          ctx.fillStyle = '#021a16';
          ctx.fill();
        } else {
          ctx.fillStyle = '#ffffff';
          ctx.font = f(800, 14 / s);
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(String(i), x, y + 1 / s);
        }
      });
    }
  }
  ctx.restore();
  ctx.textBaseline = 'alphabetic';
}

export async function drawTravelCard(canvas: HTMLCanvasElement, d: CardData, site: string): Promise<boolean> {
  const ctx = canvas.getContext('2d');
  if (!ctx) return false;
  // The Bangla font must be ready before anything is measured or drawn
  await Promise.all([500, 600, 700, 800].map((w) => document.fonts.load(`${w} 24px "Anek Bangla"`, 'বাংলাদেশ০১৯'))).catch(() => undefined);

  canvas.width = CARD_W;
  canvas.height = CARD_H;
  background(ctx);
  ctx.textBaseline = 'alphabetic';

  // ---- header
  ctx.textAlign = 'left';
  ctx.fillStyle = GOLD;
  ctx.font = f(800, 40);
  ctx.fillText('দেশভ্রমণ', 70, 98);
  ctx.fillStyle = 'rgba(255,255,255,0.65)';
  ctx.font = f(600, 15);
  spaced(ctx, 3);
  ctx.fillText('DESHBHROMON · PERSONAL TRAVEL CARD', 70, 126);
  spaced(ctx, 0);
  ctx.textAlign = 'right';
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.font = f(600, 18);
  ctx.fillText('বাংলাদেশ · ৬৪ জেলা', CARD_W - 70, 98);

  // ---- traveller + badge
  ctx.textAlign = 'left';
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.font = f(600, 20);
  ctx.fillText('ভ্রমণকারী', 70, 190);
  ctx.fillStyle = '#ffffff';
  fit(ctx, d.hasName ? d.name : 'আমার বাংলাদেশ', 70, 268, CARD_W - 140, 800, 84, 40);

  ctx.font = f(700, 26);
  const badgeText = `${d.badge.title} · ${d.badge.en}`;
  const bw = Math.min(CARD_W - 140, ctx.measureText(badgeText).width + 56);
  ctx.beginPath();
  ctx.roundRect(70, 292, bw, 54, 27);
  ctx.fillStyle = GOLD;
  ctx.fill();
  ctx.fillStyle = '#3b2400';
  fit(ctx, badgeText, 98, 329, bw - 56, 700, 26, 16);

  // ---- map (left) + stats (right)
  const top = 384;
  const mapH = 600;
  const mapW = (mapH * DATA.w) / DATA.h;
  drawMap(ctx, d, 70 + (550 - mapW) / 2, top, mapH);

  const sx = 640;
  const sw = CARD_W - 70 - sx;
  panel(ctx, sx, top, sw, 214, true);
  ctx.textAlign = 'left';
  ctx.fillStyle = GOLD;
  ctx.font = f(800, 120);
  ctx.fillText(toBengaliNumber(d.visitedCount), sx + 30, top + 118);
  const numW = ctx.measureText(toBengaliNumber(d.visitedCount)).width;
  ctx.fillStyle = '#ffffff';
  ctx.font = f(700, 30);
  ctx.fillText('/ ৬৪ জেলা', sx + 40 + numW, top + 118);
  ctx.fillStyle = 'rgba(255,255,255,0.18)';
  ctx.beginPath();
  ctx.roundRect(sx + 30, top + 140, sw - 60, 16, 8);
  ctx.fill();
  if (d.visitedCount > 0) {
    ctx.fillStyle = GOLD;
    ctx.beginPath();
    ctx.roundRect(sx + 30, top + 140, Math.max(16, ((sw - 60) * d.visitedCount) / 64), 16, 8);
    ctx.fill();
  }
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.font = f(600, 22);
  ctx.fillText(`সারা বাংলাদেশের ${toBengaliNumber(d.percent)}% ঘোরা`, sx + 30, top + 186);

  // divisions
  const dy = top + 234;
  panel(ctx, sx, dy, sw, 176);
  ctx.fillStyle = '#ffffff';
  ctx.font = f(700, 22);
  ctx.fillText(`${toBengaliNumber(d.divisionsCovered.length)}/৮ বিভাগ ছোঁয়া`, sx + 30, dy + 44);
  const cw = (sw - 60 - 12) / 2;
  DIVISIONS.forEach((dv, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = sx + 30 + col * (cw + 12);
    const y = dy + 58 + row * 28;
    const on = d.divisionsCovered.includes(dv.id);
    ctx.beginPath();
    ctx.roundRect(x, y, cw, 24, 12);
    ctx.fillStyle = on ? GOLD : 'rgba(255,255,255,0.08)';
    ctx.fill();
    ctx.fillStyle = on ? '#3b2400' : 'rgba(255,255,255,0.55)';
    ctx.font = f(on ? 700 : 500, 16);
    ctx.textAlign = 'center';
    ctx.fillText(dv.bn, x + cw / 2, y + 18);
  });
  ctx.textAlign = 'left';

  // diary / wishlist / world
  const ry = dy + 196;
  const rh = top + mapH - ry;
  panel(ctx, sx, ry, sw, rh);
  const rows: [string, string][] = [];
  if (d.diary) rows.push(['ডায়েরির স্মৃতি', `${toBengaliNumber(d.diary.count)}টি`]);
  if (d.wishlistCount) rows.push(['স্বপ্নের তালিকা', `${toBengaliNumber(d.wishlistCount)}টি জেলা`]);
  if (d.countryCount) rows.push(['ঘোরা দেশ', `${toBengaliNumber(d.countryCount)}টি`]);
  if (!rows.length) {
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.font = f(600, 20);
    ctx.fillText('বাংলাদেশের মানচিত্রে', sx + 30, ry + rh / 2 - 6);
    ctx.fillText('আমার পদচিহ্ন', sx + 30, ry + rh / 2 + 24);
  }
  const step = Math.min(64, (rh - 20) / Math.max(1, rows.length));
  rows.forEach(([label, value], i) => {
    const y = ry + 24 + i * step + step / 2;
    ctx.textAlign = 'left';
    ctx.fillStyle = 'rgba(255,255,255,0.75)';
    ctx.font = f(600, 20);
    ctx.fillText(label, sx + 30, y + 7);
    ctx.textAlign = 'right';
    ctx.fillStyle = GOLD_SOFT;
    ctx.font = f(800, 26);
    ctx.fillText(value, sx + sw - 30, y + 8);
  });
  ctx.textAlign = 'left';

  // ---- bottom blocks: next trip, best memory / quote
  type Block = { h: number; draw: (y: number) => void };
  const blocks: Block[] = [];
  const W = CARD_W - 140;
  if (d.plan) {
    const plan = d.plan;
    blocks.push({
      h: 104,
      draw: (y) => {
        panel(ctx, 70, y, W, 104, true);
        ctx.textAlign = 'left';
        ctx.fillStyle = GOLD;
        ctx.font = f(700, 18);
        ctx.fillText('পরবর্তী যাত্রা', 100, y + 34);
        ctx.fillStyle = '#ffffff';
        fit(ctx, routeLabel(plan.route), 100, y + 78, W - 290, 800, 30, 18);
        ctx.textAlign = 'right';
        ctx.fillStyle = 'rgba(255,255,255,0.85)';
        ctx.font = f(700, 22);
        ctx.fillText(`${toBengaliNumber(plan.days)} দিন · ${toBengaliNumber(plan.travelers)} জন`, 70 + W - 30, y + 62);
      },
    });
  }
  if (d.quote || d.diary?.best) {
    blocks.push({
      h: d.quote ? 132 : 84,
      draw: (y) => {
        const h = d.quote ? 132 : 84;
        panel(ctx, 70, y, W, h);
        ctx.textAlign = 'left';
        const best = d.diary!.best!;
        const place = DISTRICT_DETAILS[best.districtId]?.bn ?? best.districtId;
        ctx.fillStyle = GOLD;
        ctx.font = f(700, 18);
        ctx.fillText('সেরা স্মৃতি', 100, y + 34);
        ctx.fillStyle = '#ffffff';
        ctx.font = f(800, 26);
        ctx.fillText(place, 100 + 118, y + 36);
        for (let i = 0; i < 5; i++) star(ctx, 70 + W - 140 + i * 26, y + 27, 10, i < best.rating);
        if (d.quote) {
          ctx.fillStyle = 'rgba(255,255,255,0.88)';
          ctx.font = f(500, 22);
          wrap(ctx, `“${d.quote}”`, W - 60, 2).forEach((line, i) => ctx.fillText(line, 100, y + 76 + i * 30));
        }
      },
    });
  }
  const bottomTop = top + mapH + 26;
  const gap = 14;
  const total = blocks.reduce((s, b) => s + b.h, 0) + gap * Math.max(0, blocks.length - 1);
  const avail = 1262 - bottomTop;
  let y = bottomTop + Math.max(0, (avail - total) / 2);
  if (!blocks.length) {
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.font = f(700, 30);
    ctx.fillText('আমার বাংলাদেশ ভ্রমণ, আমার গল্প', CARD_W / 2, bottomTop + avail / 2 + 10);
  }
  for (const b of blocks) {
    b.draw(y);
    y += b.h + gap;
  }

  // ---- footer
  ctx.textAlign = 'left';
  ctx.fillStyle = GOLD;
  ctx.font = f(700, 24);
  ctx.fillText(site, 70, 1296);
  ctx.textAlign = 'right';
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.font = f(600, 20);
  ctx.fillText(new Date().toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' }), CARD_W - 70, 1296);
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(255,255,255,0.4)';
  ctx.font = f(500, 14);
  ctx.fillText('নিজের চিহ্নিত ভ্রমণ তথ্য থেকে তৈরি · সরকারি বা যাচাইকৃত নয়', CARD_W / 2, 1326);
  return true;
}
