import { Context } from 'aws-lambda';

export enum LogLevel {
  ERROR = 'error',
  INFO = 'info',
}

export interface LogEvent {
  Msg?: string;
  Exp?: string;
  Stack?: string;
}

export type LogMessage = LogEvent & {
  L: LogLevel;
  RmT: number;
  Fnc: string;
  Id: string | number;
  CT: string;
};

type LogFunction = (logEvent: LogEvent) => void;

export interface LoggerConfig {
  logLevel: LogLevel;
}

export interface Logger {
  info: LogFunction;
  error: LogFunction;
}

export interface LambdaLogger extends Logger {
  setLambdaContext(lambdaContext: Context);
}
