import * as Diff from 'diff';
import readFileGo from 'readfile-go';
import fs from 'fs-extra';
import { assert } from 'chai';

describe('We shall be able to create diffs from files to send and apply patches', () => {
  it('testing ParsedDiff[] method', () => {
    const source = 'test-repo/source.txt';
    const shadow = 'test-repo/shadow/source.txt';

    const diff = Diff.createTwoFilesPatch(shadow, source, readFileGo(shadow), readFileGo(source));
    console.log(diff);

    const patch = Diff.parsePatch(diff);
    console.log(patch[0].hunks);

    // const data = Diff.applyPatches(patch);
  });
});
