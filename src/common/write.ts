import fs from 'fs-extra';
import { IChunk, Room } from './interfaces';

export const writeChunk = (chunk: IChunk): Promise<void> => {
  // TODO Create write stream to handle larger files
  return fs.outputFile(chunk.source, chunk.data, { flag: 'w' });
};
