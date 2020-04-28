import * as Diff from 'diff';
import readFileGo from 'readfile-go';
import fs from 'fs-extra';
import { assert } from 'chai';

describe('We shall be able to create diffs from files to send and apply patches', () => {
  it('testing ParsedDiff[] method', () => {
    const source = 'test-repo/source.txt';
    const shadow = 'test-repo/shadow/source.txt';

    const sourceData = readFileGo(source);
    const shadowData = readFileGo(shadow);

    const diff = Diff.createTwoFilesPatch(shadow, source, shadowData, sourceData);

    const patch = Diff.parsePatch(diff);
    console.log(patch);

    patch.forEach(part => {
      const data = Diff.applyPatch(shadowData, part);
      fs.writeFileSync(shadow, data);
    });
  });
});
