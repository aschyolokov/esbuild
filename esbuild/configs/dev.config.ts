import { build } from 'esbuild';
import config, { resolveRoot } from './common.config';
import express from 'express';
import { EventEmitter } from 'events';

const PORT = Number(process.env.PORT) || 3000;

const server = express();
const emitter = new EventEmitter();

server.use(express.static(resolveRoot('build')));

server.get('/subscribe', (req, res) => {
  const headers = {
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive',
    'Cache-Control': 'no-cache',
  };

  res.writeHead(200, headers);

  res.write('');

  emitter.on('refresh', () => res.write('data: message\n\n'));
});

server.listen(PORT, () => console.log(`Server start on: http://localhost:${PORT}`));

build({
  ...config,
  watch: {
    onRebuild(error, result) {
      if (error) {
        console.error(error);
      } else {
        console.info('Rebuild files...');
        emitter.emit('refresh', 'Page reloaded')
      }
    }
  },
});
