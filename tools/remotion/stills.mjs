// node stills.mjs <CompId> <outDir> <frame,frame,...>  -> PNG key frames + one contact sheet
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";
const [id, out, frames] = process.argv.slice(2);
const browserExecutable = "/opt/pw-browsers/chromium-1243/chrome-linux64/chrome";
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const composition = await selectComposition({ serveUrl, id, browserExecutable });
for (const f of frames.split(",").map(Number)) {
  await renderStill({ serveUrl, composition, frame: f, output: `${out}/${id}-${String(f).padStart(4, "0")}.${process.env.FMT || "png"}`, browserExecutable, scale: Number(process.env.SCALE || 0.5), imageFormat: process.env.FMT || "png", ...(process.env.FMT === "jpeg" ? { jpegQuality: 94 } : {}) });
}
console.log("ok");
