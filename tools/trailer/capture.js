// node capture.js stills t1,t2,...   -> stills/t.jpg
// node capture.js range f0 f1 out.mp4 -> encodes frames [f0,f1) at 30 fps
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const fs = require('fs');
const FPS = 30;
(async () => {
  const mode = process.argv[2];
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--font-render-hinting=none'] });
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  p.on('pageerror', e => console.error('PAGEERR', e.message));
  await p.goto('http://127.0.0.1:8765/index.html');
  await p.waitForFunction(() => window.seek && window.ready);
  await p.evaluate(() => window.ready);
  if (mode === 'stills') {
    fs.mkdirSync('stills', { recursive: true });
    for (const t of process.argv[3].split(',').map(Number)) {
      await p.evaluate(t => window.seek(t), t);
      await p.screenshot({ path: `stills/t${t.toFixed(2)}.jpg`, type: 'jpeg', quality: 90 });
    }
  } else if (mode === 'total') {
    console.log(await p.evaluate(() => [window.TOTAL, window.CUTS]));
  } else {
    const f0 = +process.argv[3], f1 = +process.argv[4], out = process.argv[5];
    const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
      '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '17', '-pix_fmt', 'yuv420p', out + '.part.mp4']);
    for (let f = f0; f < f1; f++) {
      await p.evaluate(t => window.seek(t), f / FPS);
      const buf = await p.screenshot({ type: 'jpeg', quality: 93 });
      if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    }
    ff.stdin.end();
    await new Promise(r => ff.on('close', r));
    fs.renameSync(out + '.part.mp4', out);
  }
  await b.close();
})();
