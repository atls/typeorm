import type { DataSource } from 'typeorm'

export interface SeederFactoryOptions {
  connection: DataSource
}
