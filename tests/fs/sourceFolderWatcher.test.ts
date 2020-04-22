import { SourceFolderWatcher } from '../../src/fs/sourceFolderWatcher';
import { FileEventType } from '../../src/fs/fileEventType';
import path from 'path';
import fs from 'fs';
import { assert } from 'chai';

describe('We shall be able to setup a file watcher in the source folder', () => {
  it('Should be defined', () => {
    assert.exists(SourceFolderWatcher);
  });

  it('Should be defined', () => {
    assert.exists(FileEventType);
  });

  it('Should work to start and stop watching a source folder', done => {
    const sfw = new SourceFolderWatcher('./test-source-folder');
    sfw.onError(error => assert(false, error.message));
    sfw
      .stop()
      .then(() => done())
      .catch(() => assert.fail());
  });

  it('Should detect when a folder is created and when a file is created', done => {
    fs.mkdirSync('./test-source-folder');
    const sfw = new SourceFolderWatcher('./test-source-folder');

    sfw.onError(error => assert(false, error.message));

    let checks = [
      { event: FileEventType.DIR_CREATED, path: path.join('test-source-folder', 'a') },
      { event: FileEventType.DIR_CREATED, path: path.join('test-source-folder', 'b') },
      { event: FileEventType.DIR_CREATED, path: path.join('test-source-folder', 'c') },
      { event: FileEventType.DIR_CREATED, path: path.join('test-source-folder', 'a', 'd') },
      { event: FileEventType.DIR_CREATED, path: path.join('test-source-folder', 'b', 'e') },
      { event: FileEventType.DIR_CREATED, path: path.join('test-source-folder', 'c', 'f') },
      { event: FileEventType.DIR_CREATED, path: path.join('test-source-folder', 'a', 'd', 'g') },
      { event: FileEventType.DIR_CREATED, path: path.join('test-source-folder', 'b', 'e', 'h') },
      { event: FileEventType.DIR_CREATED, path: path.join('test-source-folder', 'c', 'f', 'i') },
      { event: FileEventType.FILE_CREATED, path: path.join('test-source-folder', 'a', 'a.txt') },
      { event: FileEventType.FILE_CREATED, path: path.join('test-source-folder', 'a', 'b.txt') },
      { event: FileEventType.FILE_CREATED, path: path.join('test-source-folder', 'a', 'd', 'c.txt') },
      { event: FileEventType.FILE_CREATED, path: path.join('test-source-folder', 'c', 'f', 'd.txt') },
      { event: FileEventType.FILE_CREATED, path: path.join('test-source-folder', 'c', 'f', 'i', 'e.txt') }
    ];

    sfw.onFileChange((event: FileEventType, path: string) => {
      const newChecks = checks.filter(row => !(row.event == event && row.path == path));
      assert.isTrue(newChecks.length === checks.length - 1);
      checks = newChecks;
      if (checks.length === 0) {
        done();
      }
    });

    sfw.onReady(() => {
      checks.forEach(({ event, path }) => {
        switch (event) {
          case FileEventType.FILE_CREATED:
            fs.writeFileSync(path, '');
            break;
          case FileEventType.DIR_CREATED:
            fs.mkdirSync(path);
            break;
        }
      });
    });
  });
});
