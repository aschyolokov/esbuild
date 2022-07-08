import { Plugin } from 'esbuild';
import { rm } from 'fs/promises';

const CleanPlugin: Plugin = {
  name: 'CleanPlugin',
  setup({ onStart, initialOptions: { outdir } }) {
    onStart(async () => {
      try {
        if (outdir) {
          await rm(outdir, { recursive: true });
        }
      } catch (error) {
        console.log(`Clean build folder is failed: ${error}`);
      }
    });
  }
};

export default CleanPlugin;
