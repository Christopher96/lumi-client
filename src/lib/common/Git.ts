import * as path from 'path';
import * as fse from 'fs-extra';
import { Console } from '../utils/Console';
import globToRegExp from 'glob-to-regexp';

export class Git {
  public getIgnoredFilesRegex() {
    const file = this.getIngoreFile();

    if (!file) return null;
    else return this.parseFile(file);
  }

  private parseFile(gitIngoreFile: string) {
    // removes all empty rows.
    const lines = gitIngoreFile.split('\n').filter(v => v.length > 1);

    // creates a list of string which are regex representations of the
    // git ignore file.
    const regex = lines
      .map(v =>
        globToRegExp(v)
          .toString()
          .trim()
          // remove the first and final character since they are / and /
          .slice(1, globToRegExp(v).toString().length - 2)
      )
      // Checks if it was a comment.
      .filter(v => v.slice(0, 2) !== '^#')
      // Combines the regex with an or command
      .join('|');

    return new RegExp(regex);
  }

  private getPath() {
    return path.join(process.cwd(), '.gitignore');
  }

  private getIngoreFile() {
    const path = this.getPath();

    if (!fse.existsSync(path)) {
      return;
    }

    return fse.readFileSync(path, 'utf-8');
  }
}
