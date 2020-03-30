import * as diff from 'diff';
import readFileGo from 'readfile-go';
import fs from 'fs-extra';
import watch from 'node-watch';
import EventEmitter from 'events';
import nodePath from 'path';
import slash from 'slash';

// Takes a source and destination and synchronize them
const syncDirs = (syncSource: string, syncShadow: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(syncShadow)) {
      resolve();
    } else {
      // Copies the source repo to a shadow copy recursively
      fs.copy(syncSource, syncShadow, err => {
        if (err) {
          reject(err);
        }
        resolve();
      });
    }
  });
};

// Watches a source repository for changes and sends patches
export const patchWatch = (syncSource: string): EventEmitter => {
  const syncShadow = `.${syncSource}.shadow`;

  // Create emitter so we can send multiple paches
  const emitter = new EventEmitter();

  const watchDir = (sourceDir: string): void => {
    // Watch file changes recursively in the directory
    watch(sourceDir, { recursive: true }, (event, sourceFile) => {
      if (event == 'update') {
        // Split the path to an array (windows and unix path harmony)
        const sourcePath = sourceFile.split(nodePath.sep);
        // Change the directory to the shadow
        sourcePath[0] = syncShadow;
        // Construct the path for the shadow file
        const shadowFile = nodePath.join(...sourcePath);

        // Read the source and shadow file
        const sourceData = readFileGo(sourceFile);
        const shadowData = readFileGo(shadowFile);

        // Diff the of the source and shadow file
        const patchData = diff.createPatch(slash(shadowFile), shadowData, sourceData);

        // Create a patch from the diff
        const patch = diff.parsePatch(patchData);

        // Send the patch back to the caller
        emitter.emit('patched', patch);
      }
    });
  };

  fs.lstat(syncSource)
    .then(stat => {
      // Check if the source is a directory
      if (stat.isDirectory()) {
        // Create the shadow directory
        return syncDirs(syncSource, syncShadow);
      } else {
        throw 'path is not a directory';
      }
    })
    // Listen for changes in the source
    .then(() => watchDir(syncSource));

  return emitter;
};

// Apply a patch from another client
export const patchApply = (diffs: Diff.ParsedDiff[]): Promise<void> => {
  return new Promise((resolve, reject) => {
    // For each specific file patch in the patch
    diffs.forEach(patch => {
      // Resolve paths to current operating system
      patch.index = nodePath.resolve(patch.index);
      patch.oldFileName = nodePath.resolve(patch.oldFileName);
      patch.newFileName = nodePath.resolve(patch.newFileName);

      // Which file do we want to patch?
      const filePath = patch.index;

      // Get the old data from the file we want to change
      const oldData = readFileGo(filePath);

      // Apply the patch to the old data
      const appliedData = diff.applyPatch(oldData, patch);

      // Write the new data the the file
      fs.writeFile(filePath, appliedData, err => {
        if (err) reject('could not write to file');
        resolve();
      });
    });
  });
};
