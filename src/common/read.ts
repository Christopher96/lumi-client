import fs from 'fs-extra';
import { EventEmitter } from 'events';
import { IRoom, Chunk } from './interfaces';

const walk = (source: string): string[] => {
  let results = [];
  const list = fs.readdirSync(source);
  list.forEach(function(file) {
    file = source + '/' + file;
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      // If the path is a directory upload that too
      results = results.concat(walk(file));
    } else {
      // If its a file push it to the list
      results.push(file);
    }
  });
  return results;
};

export const readChunks = (source: string): { files: string[]; emitter: EventEmitter } => {
  // Create emitter so we can send stream the data
  const emitter = new EventEmitter();

  const files = walk(source);
  emitter.emit('init', files.length);

  files.forEach(path => {
    // TODO Create read stream for larger files
    fs.readFile(path).then(data => {
      // TODO Use chunk interface
      const chunk = {
        path,
        data
      };
      emitter.emit('chunk', chunk);
    });
  });

  return { files, emitter };
};

export const readZip = (source: string): EventEmitter => {
  // Create emitter so we can send stream the data
  const emitter = new EventEmitter();

  const readStream = fs.createReadStream(source);
  const totalBytes = fs.statSync(source).size;

  readStream.on('data', function(data) {
    const progress = readStream.bytesRead / totalBytes;
    const done = progress == 1;

    const chunk: Chunk = {
      source,
      progress,
      done,
      data
    };

    emitter.emit('chunk', chunk);
  });

  return emitter;
};
