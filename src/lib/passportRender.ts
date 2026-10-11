import { COVERS, STAMPS_PER_PAGE, stampStyle, type CoverId } from './passport';

export const PASSPORT_W = 1080;
export const PASSPORT_H = 1350;

const FONT = '"Anek Bangla", "Noto Sans Bengali", sans-serif';

async function ready(): Promise<void> {
  try {
    await Promise.all([document.fonts.load(`800 40px ${FONT}`), document.fonts.load(`500 24px ${FONT}`)]);
  } catch {
    /* fonts fall back to the system font */
  }
}

function shapePath(ctx: CanvasRenderingContext2D, shape: string, cx: number, cy: number, r: number) {
  ctx.beginPath();
  if (shape === 'circle') ctx.arc(cx, cy, r, 0, Math.PI * 2);
  else if (shape === 'oval') ctx.ellipse(cx, cy, r * 1.15, r * 0.82, 0, 0, Math.PI * 2);
  else if (shape === 'rounded') ctx.roundRect(cx - r * 1.05, cy - r * 0.8, r * 2.1, r * 1.6, r * 0.22);
  else {
    for (let i = 0; i < 6; i++) {
      const a = (Math.PI / 3) * i - Math.PI / 6;
      const x = cx + r * Math.cos(a);
      const y = cy + r * Math.sin(a);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
  }
}

function fitText(ctx: CanvasRenderingContext2D, text: string, weight: number, max: number, start: number): number {
  let size = start;
  ctx.font = `${weight} ${size}px ${FONT}`;
  while (ctx.measureText(text).width > max && size > 14) {
    size -= 2;
    ctx.font = `${weight} ${size}px ${FONT}`;
  }
  return size;
}

export interface StampLabel {
  id: string;
  name: string; // shown in the language chosen by the traveller
  sub: string; // division
}

export function drawStamp(ctx: CanvasRenderingContext2D, s: StampLabel, cx: number, cy: number, r: number) {
  const st = stampStyle(s.id);
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(st.rotation);
  ctx.translate(-cx, -cy);
  ctx.globalAlpha = 0.88;
  ctx.strokeStyle = st.color;
  ctx.fillStyle = st.color;
  ctx.lineWidth = 6;
  shapePath(ctx, st.shape, cx, cy, r);
  ctx.stroke();
  ctx.lineWidth = 2;
  shapePath(ctx, st.shape, cx, cy, r * 0.86);
  ctx.stroke();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `700 15px ${FONT}`;
  ctx.fillText('DESHBHROMON', cx, cy - r * 0.52);
  const size = fitText(ctx, s.name, 800, r * 1.5, 44);
  ctx.font = `800 ${size}px ${FONT}`;
  ctx.fillText(s.name, cx, cy + 2);
  ctx.font = `600 16px ${FONT}`;
  ctx.fillText(s.sub, cx, cy + r * 0.5);
  ctx.restore();
}

export interface PassportPageData {
  name: string;
  number: string;
  issued: string;
  stamps: StampLabel[]; // every stamp, all pages
  page: number;
  pages: number;
  total: number; // districts in the country
  lang: 'bn' | 'en';
}

export async function drawPassportPage(canvas: HTMLCanvasElement, d: PassportPageData): Promise<void> {
  await ready();
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const en = d.lang === 'en';
  ctx.clearRect(0, 0, PASSPORT_W, PASSPORT_H);
  // paper
  const bg = ctx.createLinearGradient(0, 0, 0, PASSPORT_H);
  bg.addColorStop(0, '#fbf6e6');
  bg.addColorStop(1, '#f3ead0');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, PASSPORT_W, PASSPORT_H);
  // faint wave lines like security paper
  ctx.strokeStyle = 'rgba(15,118,110,0.07)';
  ctx.lineWidth = 2;
  for (let y = 120; y < PASSPORT_H; y += 26) {
    ctx.beginPath();
    for (let x = 0; x <= PASSPORT_W; x += 20) ctx.lineTo(x, y + Math.sin((x + y) / 60) * 8);
    ctx.stroke();
  }
  ctx.strokeStyle = '#b8a36a';
  ctx.lineWidth = 3;
  ctx.strokeRect(30, 30, PASSPORT_W - 60, PASSPORT_H - 60);

  // header
  ctx.textBaseline = 'alphabetic';
  ctx.textAlign = 'left';
  ctx.fillStyle = '#0f3d2e';
  ctx.font = `800 52px ${FONT}`;
  ctx.fillText(en ? 'Travel Passport' : 'ভ্রমণ পাসপোর্ট', 70, 120);
  ctx.font = `600 22px ${FONT}`;
  ctx.fillStyle = '#6b5b2a';
  ctx.fillText(en ? 'DESHBHROMON · TRAVEL PASSPORT' : 'দেশভ্রমণ · TRAVEL PASSPORT', 70, 156);
  ctx.textAlign = 'right';
  ctx.fillText(`${en ? 'Page' : 'পাতা'} ${d.page}/${d.pages}`, PASSPORT_W - 70, 120);

  // details
  ctx.textAlign = 'left';
  ctx.fillStyle = '#6b5b2a';
  ctx.font = `600 18px ${FONT}`;
  ctx.fillText(en ? 'NAME' : 'নাম / NAME', 70, 220);
  ctx.fillText(en ? 'PASSPORT NO.' : 'পাসপোর্ট নং / NO.', 560, 220);
  ctx.fillText(en ? 'ISSUED' : 'ইস্যু / ISSUED', 70, 305);
  ctx.fillText(en ? 'STAMPS' : 'সিল / STAMPS', 560, 305);
  ctx.fillStyle = '#0f3d2e';
  const nameSize = fitText(ctx, d.name, 800, 440, 44);
  ctx.font = `800 ${nameSize}px ${FONT}`;
  ctx.fillText(d.name, 70, 262);
  ctx.font = `800 40px ${FONT}`;
  ctx.fillText(d.number, 560, 262);
  ctx.font = `700 34px ${FONT}`;
  ctx.fillText(d.issued, 70, 348);
  ctx.fillText(`${d.stamps.length}/${d.total}`, 560, 348);
  ctx.strokeStyle = '#b8a36a';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(70, 385);
  ctx.lineTo(PASSPORT_W - 70, 385);
  ctx.stroke();

  // stamps: 3 columns x 4 rows
  const slice = d.stamps.slice((d.page - 1) * STAMPS_PER_PAGE, d.page * STAMPS_PER_PAGE);
  const cellW = (PASSPORT_W - 140) / 3;
  const cellH = 210;
  slice.forEach((s, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    drawStamp(ctx, s, 70 + cellW * col + cellW / 2, 410 + cellH * row + cellH / 2 + 8, 82);
  });
  if (slice.length === 0) {
    ctx.fillStyle = '#6b5b2a';
    ctx.textAlign = 'center';
    ctx.font = `600 28px ${FONT}`;
    ctx.fillText(en ? 'Mark districts as visited to collect stamps' : 'ঘোরা জেলা চিহ্নিত করলে এখানে সিল বসবে', PASSPORT_W / 2, 700);
  }

  // machine-readable style strip (decorative)
  ctx.textAlign = 'left';
  ctx.fillStyle = 'rgba(15,61,46,0.55)';
  ctx.font = `600 22px monospace`;
  const ascii = (d.name.replace(/[^A-Za-z]/g, '').toUpperCase() || 'TRAVELLER').slice(0, 14);
  ctx.fillText(`DB<${ascii.padEnd(14, '<')}<<<<<<<<<<<<<`.slice(0, 40), 70, PASSPORT_H - 95);
  ctx.fillText(`${d.number}<STAMPS${String(d.stamps.length).padStart(2, '0')}<TRAVEL<PASSPORT<`.slice(0, 40), 70, PASSPORT_H - 62);
  ctx.textAlign = 'right';
  ctx.font = `600 16px ${FONT}`;
  ctx.fillStyle = '#6b5b2a';
  ctx.fillText(en ? 'A fun keepsake, not a travel document' : 'এটি একটি মজার স্মারক, ভ্রমণ দলিল নয়', PASSPORT_W - 70, PASSPORT_H - 62);
}

export async function drawPassportCover(canvas: HTMLCanvasElement, opts: { name: string; cover: CoverId; lang: 'bn' | 'en'; stamps: number; mapPaths: string[] | null; mapW: number; mapH: number }): Promise<void> {
  await ready();
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const c = COVERS[opts.cover];
  const en = opts.lang === 'en';
  const g = ctx.createLinearGradient(0, 0, PASSPORT_W, PASSPORT_H);
  g.addColorStop(0, c.from);
  g.addColorStop(1, c.to);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, PASSPORT_W, PASSPORT_H);
  ctx.strokeStyle = '#d9b45b';
  ctx.lineWidth = 5;
  ctx.strokeRect(50, 50, PASSPORT_W - 100, PASSPORT_H - 100);
  ctx.lineWidth = 2;
  ctx.strokeRect(68, 68, PASSPORT_W - 136, PASSPORT_H - 136);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = '#e7c874';
  ctx.font = `800 100px ${FONT}`;
  ctx.fillText(en ? 'DeshBhromon' : 'দেশভ্রমণ', PASSPORT_W / 2, 250);
  ctx.font = `700 30px ${FONT}`;
  ctx.fillText('D E S H B H R O M O N', PASSPORT_W / 2, 305);
  if (opts.mapPaths) {
    const h = 640;
    const w = h * (opts.mapW / opts.mapH);
    ctx.save();
    ctx.translate(PASSPORT_W / 2 - w / 2, 350);
    ctx.scale(w / opts.mapW, h / opts.mapH);
    ctx.fillStyle = '#d9b45b';
    ctx.globalAlpha = 0.95;
    for (const d of opts.mapPaths) ctx.fill(new Path2D(d));
    ctx.restore();
  }
  ctx.fillStyle = '#e7c874';
  ctx.font = `800 70px ${FONT}`;
  ctx.fillText(en ? 'Travel Passport' : 'ভ্রমণ পাসপোর্ট', PASSPORT_W / 2, 1090);
  ctx.font = `700 28px ${FONT}`;
  ctx.fillText('T R A V E L   P A S S P O R T', PASSPORT_W / 2, 1135);
  const who = opts.name.trim();
  if (who) {
    const size = fitText(ctx, who, 700, 800, 40);
    ctx.font = `700 ${size}px ${FONT}`;
    ctx.fillText(who, PASSPORT_W / 2, 1215);
  }
}
