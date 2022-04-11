export class Logger {
  static log(msg: any, ...optionalParams: any[]) {
    console.log(msg, optionalParams);
  }

  static debug(msg: any, ...optionalParams: any[]) {
    console.debug(msg, optionalParams);
  }

  static error(msg: any, err: any, ...optionalParams: any[]) {
    console.error(msg, err, optionalParams);
  }

  static info(msg: any, ...optionalParams: any[]) {
    console.info(msg, optionalParams);
  }

  static warning(msg: any, ...optionalParams: any[]) {
    console.warn(msg, optionalParams);
  }
}
