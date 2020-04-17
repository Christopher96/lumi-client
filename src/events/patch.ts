import * as diff from 'diff';
import readFileGo from 'readfile-go';
import watch from 'node-watch';
import EventEmitter from 'events';
import nodePath from 'path';
import events from 'common/events';
import { patchApply } from 'common/apply';
import { EventHandler } from 'common/interfaces';

// Watches a source repository for changes and sends patches
export const patchWatch = (source: string, roomId: string): EventEmitter => {
  // Create emitter so we can send multiple paches
  const emitter = new EventEmitter();

  const watchDir = (sourceDir: string): void => {
    // Watch file changes recursively in the directory
    watch(sourceDir, { recursive: true }, (event, sourceFile) => {
      if (event == 'update') {
        // Split the path to an array (windows and unix path harmony)
        const sourcePath = sourceFile.split(nodePath.sep);

        // Construct the path for the copy file
        const copyFile = nodePath.join(roomId, ...sourcePath);

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

export class PatchEvents implements EventHandler {
  constructor(private server: SocketIOClient.Socket) {
    this.addEvents();
  }

  addEvents(): void {
    // On incoming patches of other clients
    this.server.on(events.PATCH, (patch: Diff.ParsedDiff[]) => {
      // Apply the patch to the shadow directory
      patchApply(patch).then(() => console.log('patched'));
    });

    // On patches that have been sent but not accepted by the server
    this.server.on(events.PATCH_ERR, () => {
      // TODO Alert the user that the patch could not be applied
      console.log('invalid patch, could not apply it');
    });
  }
}
