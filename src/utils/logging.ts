/* eslint-disable no-console, import/prefer-default-export */

enum StatusType {
  DEBUG = 0x0,
  INFO = 0x1,
  WARNING = 0x2,
  ERROR = 0x3,
  FATAL = 0x4,
}

type StatusArgs = Array<unknown>;
type StatusEntry = {
  type: StatusType,
  args: StatusArgs,
}

class Status {
  entries: StatusEntry[];

  constructor() {
    this.entries = [];
  }

  add(type: StatusType, ...args: StatusArgs) {
    this.entries.push({ type, args });
  }

  debug(...args: StatusArgs) {
    console.debug(...args);
    this.add(StatusType.DEBUG, ...args);
  }

  info(...args: StatusArgs) {
    console.info(...args);
    this.add(StatusType.INFO, ...args);
  }

  warning(...args: StatusArgs) {
    console.warn(...args);
    this.add(StatusType.WARNING, ...args);
  }

  error(...args: StatusArgs) {
    console.error(...args);
    this.add(StatusType.ERROR, ...args);
  }

  fatal(...args: StatusArgs) {
    console.error(...args);
    this.add(StatusType.FATAL, ...args);
  }
}

export { Status };
