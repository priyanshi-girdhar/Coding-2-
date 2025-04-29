import { Injectable, LoggerService } from "@nestjs/common";
import { Logger } from "winston";
import * as winston from "winston";
import * as path from "path";


@Injectable()
export class AppLogger implements LoggerService {
    private readonly logger: Logger;

    constructor() {
        this.logger = winston.createLogger({
          level: 'info',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.printf(({ level, message, timestamp }) => {
              return `${timestamp} [${level.toUpperCase()}]: ${message}`;
            }),
          ),
          transports: [
            new winston.transports.Console(),
            new winston.transports.File({
              filename: path.join(__dirname, '../../logs/application.log'),
              level: 'info', 
            }),
          ],
        });
      }

    log(message: string){
        this.logger.log({level: "info", message})
    }

    error(message: string){
        this.logger.log({level: "error", message})
    }

    warn(message: string){
        this.logger.log({level: "warn", message})
    }

}