import { build } from 'esbuild';
import config from './common.config';

build(config)
  .then(() => console.log('Build for production is complete!'))
  .catch(() => console.log('Build failed. Please try again.'));
