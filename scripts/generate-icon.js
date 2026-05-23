import { Resvg } from '@resvg/resvg-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const svg = fs.readFileSync(path.join(__dirname, '../public/apple-touch-icon.svg'), 'utf8');
const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: 180 } });
const pngData = resvg.render();
fs.writeFileSync(path.join(__dirname, '../public/apple-touch-icon.png'), pngData.asPng());
console.log('apple-touch-icon.png written (180×180)');
