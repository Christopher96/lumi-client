import chalk from 'chalk';

export class Console {
  static title(...title: any[]) {
    console.log(chalk.yellow(chalk.bgBlack(...title)));
  }

  static success(...successMessage: any[]) {
    console.log(chalk.green(...successMessage));
  }
  static error(...error: any[]) {
    console.log(chalk.red(...error));
  }
  static blue(...message: any[]) {
    console.log(chalk.blue(...message));
  }
  static green(...message: any[]) {
    console.log(chalk.green(...message));
  }
  static yellow(...message: any[]) {
    console.log(chalk.yellow(...message));
  }
  static log(...message: any[]) {
    console.log(...message);
  }
}
