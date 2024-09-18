import { DataSource } from 'typeorm'

export interface SeederFactoryOptions {
  connection: DataSource
}
