import * as diff from 'diff';
import readFileGo from 'readfile-go';
import watch from 'node-watch';
import EventEmitter from 'events';
import nodePath from 'path';

// Watches a source repository for changes and sends patches
export const patchWatch = (source: string, copy: string): EventEmitter => {
  // Create emitter so we can send multiple paches
  const emitter = new EventEmitter();

  const watchDir = (sourceDir: string): void => {
    // Watch file changes recursively in the directory
    watch(sourceDir, { recursive: true }, (event, sourceFile) => {
      if (event == 'update') {
        // Split the path to an array (windows and unix path harmony)
        const sourcePath = sourceFile.split(nodePath.sep);

        // Set the folder path to the copy folder
        sourcePath[0] = copy;

        // Construct the path for the copy file
        const copyFile = nodePath.join(...sourcePath);

        // Read the source and copy file
        const sourceData = readFileGo(sourceFile);
        const copyData = readFileGo(copyFile);

        // Diff the of the source and copy file
        const diffData = diff.createPatch(copyFile, copyData, sourceData);

        // Create a patch from the diff
        const patch = diff.parsePatch(diffData);

        // Send the patch back to the caller
        emitter.emit('patch', patch);
      }
    });
  };

  // Copy source then listen for file changes
  watchDir(source);

  return emitter;
};
