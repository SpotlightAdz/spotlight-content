import { Config } from "@remotion/cli/config";
Config.setBrowserExecutable("/opt/pw-browsers/chromium-1243/chrome-linux64/chrome");
Config.setChromiumOpenGlRenderer("angle-egl"); // WebGL2 for @remotion/effects (light leaks etc.); swangle has no WebGL2
