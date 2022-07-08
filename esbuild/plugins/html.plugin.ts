import { Plugin } from 'esbuild';
import { writeFile } from 'fs';
import path from 'path';
import { Mode } from '../configs/common.config';

type HtmlpPluginOptions = {
  mode?: Mode;
  template?: string;
  title?: string;
  paths?: {
    js?: string[];
    css?: string[];
  },
};

const renderHtml = ({ title, template, paths, mode }: HtmlpPluginOptions) => {
  const { js: jsPaths, css: cssPaths } = paths ?? {};

  const hotReloadScriptTemplate = `
    <script>
      const eventSource = new EventSource('http://localhost:3000/subscribe');
      eventSource.onopen = () => console.log('open');
      eventSource.onerror = () => console.error('error');
      eventSource.onmessage = () => window.location.reload();
    </script>
  `;

  return template || `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title ?? 'Document'}</title>
        ${cssPaths?.map(file => `<link href="${file}" rel="stylesheet">`).join('\n')}
      </head>
      <body>
        <div id="root"></div>
        ${jsPaths?.map(file => `<script src="${file}"></script>`).join('\n')}
        ${mode === 'dev' ? hotReloadScriptTemplate : ''}
      </body>
    </html>
  `;
};

const preparePaths = (outputs?: Record<string, any>): [string[], string[]] => {
  const paths = Object.keys(outputs ?? {});

  return paths.reduce<[string[], string[]]>((memo, path) => {
    const [js, css] = memo;
    const file = path.split('/')[1];

    if (file.endsWith('.js')) {
      js.push(file);
    }

    if (file.endsWith('.css')) {
      css.push(file);
    }

    return memo;
  }, [[], []]);
};

export const HtmlPlugin = (options: HtmlpPluginOptions): Plugin => {
  return {
    name: 'HtmlPlugin',
    setup({ onEnd, initialOptions: { outdir } }) {
      onEnd(async ({ metafile: { outputs } = {} }) => {
        const [js, css] = preparePaths(outputs);

        try {
          if (outdir) {
            await writeFile(
              path.resolve(outdir, 'index.html'),
              renderHtml({ paths: { js, css }, ...options }),
              () => { }
            );
          }
        } catch (error) {
          console.log(`Failed to write html file: ${error}`);
        }
      });
    }
  };
};

export default HtmlPlugin;
