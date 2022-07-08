import { resolve } from 'path';
import { BuildOptions } from 'esbuild';
import CleanPlugin from '../plugins/clean.plugin';
import HtmlPlugin from '../plugins/html.plugin';

export type Mode = 'dev' | 'prod';

const mode: Mode = process.env.MODE as Mode || 'dev';

const isProd = mode === 'prod';
const isDev = mode === 'dev';

const _getLoaders = (extensions: string[]): Record<string, string> => extensions.reduce(
  (memo, extension) => ({
    ...memo,
    [extension]: 'file',
  }), {}
);

export const resolveRoot = (...segments: string[]) => resolve(__dirname, '..', '..', ...segments);

export default {
  metafile: true,
  bundle: true,
  minify: isProd,
  sourcemap: isDev,
  entryNames: '[dir]/bundle.[name]-[hash]',
  tsconfig: resolveRoot('tsconfig.json'),
  outdir: resolveRoot('build'),
  entryPoints: [
    resolveRoot('src', 'index.jsx'),
  ],
  loader: _getLoaders([
    '.png',
    '.svg',
    '.jpg',
  ]),
  plugins: [
    CleanPlugin,
    HtmlPlugin({
      title: 'ESBuild Template',
      mode,
    }),
  ],
} as BuildOptions;
