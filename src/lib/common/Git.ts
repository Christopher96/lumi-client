import * as path from 'path';
import * as fse from 'fs-extra';
import { Console } from '../utils/Console';

export class Git {
  public getIgnoredFilesRegex() {
    const file = this.getIngoreFile();

    if (!file) return null;
    else return this.parseFile(file);
  }

  private parseFile(gitIngoreFile: string) {
    console.log(gitIngoreFile);
    /// TODO
    // IMPLEMENT PARSING OF THE IGNORE FILE
    // CURRENLTY ONLY RETURNS ANY FILE WHICH INCLUDE THE
    // WORD NODE MODULES
    return /.*node_modules.*/;
  }

  private getPath() {
    return path.join(process.cwd(), '.gitignore');
  }

  private getIngoreFile() {
    const path = this.getPath();

    if (!fse.existsSync(path)) {
      Console.warn(
        `No git ignore file found on path ${path} please use this in the future to minimize burden on our poor server`
      );
      return;
    }

    return fse.readFileSync(path, 'utf-8');
  }
}
