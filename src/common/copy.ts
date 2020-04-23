import fs from 'fs-extra';
// import { Chunk, Room } from './interfaces';
//
// // Takes a source and destination and copy source recursively
// export const copySource = (source: string, copy: string): Promise<void> => {
//   return new Promise((resolve, reject) => {
//     fs.lstat(source).then(stat => {
//       // Check if the source is a directory
//       if (stat.isDirectory()) {
//         // Create the copy directory
//         if (fs.existsSync(copy)) {
//           fs.removeSync(copy);
//         }
//         // Copies the source repo to a copy recursively
//         fs.copy(source, copy, err => {
//           if (err) {
//             reject(`Failed to copy: ${err}`);
//           }
//           resolve();
//         });
//       } else {
//         reject('Source is not a directory');
//       }
//     });
//   });
// };
//
// export const writeChunk = (chunk: Chunk): Promise<void> => {
//   // TODO Create write stream to handle larger files
//   return fs.outputFile(chunk.path, chunk.data, { flag: 'w' });
// };
