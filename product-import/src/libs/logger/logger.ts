import { Context } from 'aws-lambda';
import { createLogger, transports, Logger as WinstonLogger } from 'winston';
import { LambdaLogger, LogEvent, LoggerConfig, LogLevel, LogMessage } from './types';

export class LambdaLoggerService implements LambdaLogger {
  private readonly _logger: WinstonLogger;
  private _lambdaContext: Context;

  constructor({ logLevel }: LoggerConfig) {
    this._logger = createLogger({ transports: [new transports.Console({ level: logLevel })] });
  }

  setLambdaContext(lambdaContext: Context): void {
    this._lambdaContext = lambdaContext;
  }

  error(event: LogEvent): void {
    const message = this.constructMessage(LogLevel.ERROR, event);
    this._logger.error(JSON.stringify(message));
  }

  info(event: LogEvent): void {
    const message = this.constructMessage(LogLevel.INFO, event);
    this._logger.info(JSON.stringify(message));
  }

  private constructMessage(logLevel: LogLevel, event: LogEvent): LogMessage {
    const currentTime = new Date().toISOString();
    const lambdaName = this._lambdaContext?.functionName;
    const lambdaId = this._lambdaContext?.awsRequestId || process.pid;
    const lambdaRemainingTime = this._lambdaContext?.getRemainingTimeInMillis();

    return {
      ...event,
      L: logLevel,
      Fnc: lambdaName,
      RmT: lambdaRemainingTime,
      Id: lambdaId,
      CT: currentTime,
    };
  }
}
