/* eslint-disable no-console */
class LoggerClass {
  readonly log!: (...params: unknown[]) => void;
  readonly info!: (...params: unknown[]) => void;
  readonly warn!: (...params: unknown[]) => void;
  readonly error!: (...params: unknown[]) => void;

  constructor() {
    this.log = console.log.bind(console);
    this.info = console.info.bind(console);
    this.warn = console.warn.bind(console);
    this.error = console.error.bind(console);
  }
}

export const logger = new LoggerClass();
