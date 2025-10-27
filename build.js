import { build } from "esbuild";

await build({
  entryPoints: ["src/background.ts"],
  outfile: "dist/background.js",
  bundle: true,
  platform: "browser",
  target: ["chrome120"], // o quello che vuoi
  format: "esm",
});
