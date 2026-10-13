import type { Logger as ILogger } from 'typeorm'

import { Logger }                 from '@atls/logger'

export class TypeOrmLogger implements ILogger {
  private readonly logger = new Logger('typeorm')

  logQuery(query: string, parameters?: Parameters<ILogger['logQuery']>[1]) {
    this.logger.debug({
      message: 'query',
      sql: {
        query,
        parameters,
      },
    })
  }

  logQueryError(
    error: string,
    query: string,
    parameters?: Parameters<ILogger['logQueryError']>[2]
  ) {
    this.logger.error({
      message: error,
      sql: {
        query,
        parameters,
      },
    })
  }

  logQuerySlow(time: number, query: string, parameters?: Parameters<ILogger['logQuerySlow']>[2]) {
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

  log(level: 'info' | 'log' | 'warn', message: Parameters<ILogger['log']>[1]) {
    switch (level) {
      case 'log':
        this.log('info', message)
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
