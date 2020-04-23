import * as diff from 'diff';
import readFileGo from 'readfile-go';
import fs from 'fs-extra';

// Apply a patch from another client
export const patchApply = (diffs: Diff.ParsedDiff[]): Promise<void> => {
  return new Promise((resolve, reject) => {
    // For each specific file patch in the patch
    diffs.forEach(patch => {
      // Which file do we want to patch?
      const filePath = patch.index;

      // Get the old data from the file we want to change
      const oldData = readFileGo(filePath);

      // Apply the patch to the old data
      const appliedData = diff.applyPatch(oldData, patch);

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
