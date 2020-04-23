import fs from 'fs-extra';
import { Chunk } from './interfaces';

export const writeChunk = (chunk: Chunk, dest: string): Promise<void> => {
  console.log(`Writing chunk, progress: ${chunk.progress}`);
  // TODO Create write stream to handle larger files
  return fs.outputFile(dest, chunk.data, { flag: 'w' });
};
