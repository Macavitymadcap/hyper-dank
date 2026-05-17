import type * as Fs from "node:fs";
import type * as Url from "node:url";

const clientEntry = "src/client/main.ts";
const manifestUrl = new URL("../../../../dist/client/.vite/manifest.json", import.meta.url);

interface ViteManifestChunk {
  css?: string[];
  file: string;
  imports?: string[];
}

type ViteManifest = Record<string, ViteManifestChunk>;

interface RenderAssetTagOptions {
  devServerUrl?: string;
  manifest?: ViteManifest | null;
}

export const renderAssetTags = (options: RenderAssetTagOptions = {}) => {
  const devServerUrl = options.devServerUrl ?? process.env.VITE_DEV_SERVER_URL;
  if (devServerUrl) {
    const origin = devServerUrl.replace(/\/$/, "");

    return [
      <script type="module" src={`${origin}/@vite/client`}></script>,
      <script type="module" src={`${origin}/${clientEntry}`}></script>,
    ];
  }

  const manifest = options.manifest === undefined ? readManifest() : options.manifest;
  const entry = manifest?.[clientEntry];
  if (!entry) return [];

  const cssFiles = collectCssFiles(manifest, entry);

  return [
    ...cssFiles.map((file) => <link rel="stylesheet" href={`/${file}`} />),
    <script type="module" src={`/${entry.file}`}></script>,
  ];
};

function readManifest(): ViteManifest | null {
  if (typeof document !== "undefined" || typeof process === "undefined") return null;

  const fs = process.getBuiltinModule("node:fs") as typeof Fs;
  const url = process.getBuiltinModule("node:url") as typeof Url;
  const manifestPath = url.fileURLToPath(manifestUrl);
  if (!fs.existsSync(manifestPath)) return null;

  return JSON.parse(fs.readFileSync(manifestPath, "utf8")) as ViteManifest;
}

function collectCssFiles(manifest: ViteManifest, entry: ViteManifestChunk): string[] {
  const files = new Set<string>();
  const seen = new Set<ViteManifestChunk>();

  const visit = (chunk: ViteManifestChunk) => {
    if (seen.has(chunk)) return;
    seen.add(chunk);

    for (const file of chunk.css ?? []) {
      files.add(file);
    }

    for (const importKey of chunk.imports ?? []) {
      const imported = manifest[importKey];
      if (imported) visit(imported);
    }
  };

  visit(entry);
  return [...files];
}
