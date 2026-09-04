// E9.4: Capacitor iskeleti — index.html'i (tek dosya mimarisi) DEĞİŞTİRMEDEN
// capacitor.config.json'daki webDir="www" klasörüne kopyalar. Gerçek `npx cap add ios/android`
// + Xcode/Android Studio build'i kullanıcıda (mağaza hesabı/imzalama gerektirir) — bkz. README.md
// "Mobil mağaza sarmalı (Capacitor)".
import { mkdirSync, cpSync, existsSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const www = join(root, 'www');

if (existsSync(www)) rmSync(www, { recursive: true, force: true });
mkdirSync(www, { recursive: true });

const FILES = ['index.html', 'manifest.json', 'sw.js', 'icon-192.png', 'icon-512.png'];
for (const f of FILES) {
  const src = join(root, f);
  if (existsSync(src)) cpSync(src, join(www, f));
}
cpSync(join(root, 'data'), join(www, 'data'), { recursive: true });

console.log(`www/ hazır (${FILES.length} dosya + data/) — şimdi: npx cap sync`);
