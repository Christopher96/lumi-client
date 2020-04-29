import * as Diff from 'diff';
import readFileGo from 'readfile-go';
import fs from 'fs-extra';
import path from 'path';
import { IPatch, IRoom } from './interfaces';

// Apply a patch from another client
export const patchApply = (iPatch: IPatch): Promise<void> => {
  return new Promise((resolve, reject) => {
    // For each specific file patch in the patch
    iPatch.diffs.forEach(patch => {
      // Which file do we want to patch?
      const filePath = patch.index;

      // Get the old data from the file we want to change
      const oldData = readFileGo(filePath);

      // Apply the patch to the old data
      const appliedData = Diff.applyPatch(oldData, patch);

      // Check wheter the patch is valid or not
      if (appliedData !== 'false') {
        // Write the new data the the file
        fs.writeFile(filePath, appliedData, err => {
          if (err) reject('could not write to file.');
        });
      } else {
        reject('could not apply patch.');
      }
    });

    resolve();
  });
};

export const patchCreate = (
  shadowFolderPath: string,
  sourceFolderPath: string,
  filePath: string
): Diff.ParsedDiff[] => {
  const shadowFile = path.join(shadowFolderPath, filePath);
  const sourceFile = path.join(sourceFolderPath, filePath);

  const shadowData = readFileGo(shadowFile);
  const sourceData = readFileGo(sourceFile);

  const patchData = Diff.createTwoFilesPatch(shadowFile, sourceFile, shadowData, sourceData);

  return Diff.parsePatch(patchData);
  // TODO Optimize this part
};
