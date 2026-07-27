import { readFile, readdir } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';

const assetsDirectory = new URL('../dist/assets/', import.meta.url);
const assetNames = await readdir(assetsDirectory);

const assets = await Promise.all(
  assetNames.map(async (name) => {
    const contents = await readFile(new URL(name, assetsDirectory));

    return {
      gzipBytes: gzipSync(contents).byteLength,
      name,
      rawBytes: contents.byteLength,
    };
  }),
);

const javascriptGzipBytes = assets
  .filter(({ name }) => name.endsWith('.js'))
  .reduce((total, asset) => total + asset.gzipBytes, 0);
const cssGzipBytes = assets
  .filter(({ name }) => name.endsWith('.css'))
  .reduce((total, asset) => total + asset.gzipBytes, 0);
const imageAssets = assets.filter(({ name }) =>
  /\.(?:avif|gif|jpe?g|png|webp)$/i.test(name),
);
const largestImageBytes = Math.max(0, ...imageAssets.map(({ rawBytes }) => rawBytes));

const budgets = [
  {
    actualBytes: javascriptGzipBytes,
    label: 'JavaScript total compactado',
    limitBytes: 180 * 1024,
  },
  {
    actualBytes: cssGzipBytes,
    label: 'CSS total compactado',
    limitBytes: 16 * 1024,
  },
  {
    actualBytes: largestImageBytes,
    label: 'Maior imagem publicada',
    limitBytes: 120 * 1024,
  },
];

const failures = budgets.filter(({ actualBytes, label, limitBytes }) => {
  const passed = actualBytes <= limitBytes;
  const formattedActual = (actualBytes / 1024).toFixed(1);
  const formattedLimit = (limitBytes / 1024).toFixed(0);

  console.log(
    `${passed ? '✓' : '✗'} ${label}: ${formattedActual} KiB / ${formattedLimit} KiB`,
  );

  return !passed;
});

if (failures.length > 0) {
  throw new Error('O build excedeu o orçamento de desempenho documentado.');
}
