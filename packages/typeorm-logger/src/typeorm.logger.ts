import { Logger }            from '@atls/logger'
import { Logger as ILogger } from 'typeorm'

export class TypeOrmLogger implements ILogger {
  private logger = new Logger('typeorm')

  logQuery(query: string, parameters?: any[]) {
    this.logger.debug({
      message: 'query',
      sql: {
        query,
        parameters,
      },
    })
  }

  logQueryError(error: string, query: string, parameters?: any[]) {
    this.logger.error({
      message: error,
      sql: {
        query,
        parameters,
      },
    })
  }

  logQuerySlow(time: number, query: string, parameters?: any[]) {
    this.logger.warn({
      message: 'slow query',
      sql: {
        time,
        query,
        parameters,
      },
    })
  }

  logSchemaBuild(message: string) {
    this.logger.debug(message, { context: 'schema' })
  }

  logMigration(message: string) {
    this.logger.debug(message, { context: 'migration' })
  }

  log(level: 'log' | 'info' | 'warn', message: any) {
    switch (level) {
      case 'log':
        this.log(level === 'log' ? 'info' : level, message)
        break
      case 'info':
        this.logger.info(message)
        break
      case 'warn':
        this.logger.warn(message)
        break
      default:
        this.logger.info(message)
        break
    }
  }
}
