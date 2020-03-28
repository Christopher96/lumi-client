import * as diff from 'diff';
import readFileGo from 'readfile-go';
import fs from 'fs-extra';
import watch from 'node-watch';
import EventEmitter from 'events';

const syncDirs = (syncSource: string, syncShadow: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(syncShadow)) {
      resolve();
    } else {
      fs.copy(syncSource, syncShadow, err => {
        if (err) {
          reject(err);
        }
        resolve();
      });
    }
  });
};

export const patchWatch = (syncSource: string): EventEmitter => {
  const syncShadow = `.${syncSource}.shadow`;

  const emitter = new EventEmitter();

  const watchDir = (sourceDir: string): void => {
    watch(sourceDir, { recursive: true }, (event, sourceFile) => {
      if (event == 'update') {
        const path = sourceFile.substr(sourceFile.indexOf('/'));
        const shadowFile = `${syncShadow}${path}`;

        const sourceData = readFileGo(sourceFile);
        const shadowData = readFileGo(shadowFile);

        const patchData = diff.createPatch(shadowFile, shadowData, sourceData);
        const patch = diff.parsePatch(patchData);
        emitter.emit('patched', patch);
      }
    });
  };

  fs.lstat(syncSource)
    .then(stat => {
      if (stat.isDirectory()) {
        return syncDirs(syncSource, syncShadow);
      } else {
        throw 'path is not a directory';
      }
    })
    .then(() => watchDir(syncSource));

  return emitter;
};

export const patchApply = async (patch: Diff.ParsedDiff[]): Promise<void> => {
  return new Promise((resolve, reject) => {
    patch.forEach(filePatch => {
      const filePath = filePatch.index;
      const oldStr = readFileGo(filePath);
      const appliedStr = diff.applyPatch(oldStr, filePatch);

      fs.writeFile(filePath, appliedStr, err => {
        if (err) reject('could not write to file');
        resolve();
      });
    });
  });
};
