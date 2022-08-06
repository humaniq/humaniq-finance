export class Logger {
  static log(...params: any[]) {
    console.log(params);
  }

  static debug(...params: any[]) {
    console.debug(params);
  }

  static error(...params: any[]) {
    console.error(params);
  }

  static info(...params: any[]) {
    console.info(params);
  }

  static warning(...params: any[]) {
    console.warn(params);
  }
}
