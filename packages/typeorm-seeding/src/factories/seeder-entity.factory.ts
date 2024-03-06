import { EntityTarget }           from 'typeorm'
import { ObjectLiteral }          from 'typeorm'
import { DeepPartial }            from 'typeorm'
import { Repository }             from 'typeorm'
import { getMetadataArgsStorage } from 'typeorm'

import { SeederFactoryOptions }   from './seeder-factory.interfaces'
import { generator }              from '../generators'
import { isBooleanColumn }        from './typeorm.utils'
import { isNumberColumn }         from './typeorm.utils'
import { isDateColumn }           from './typeorm.utils'
import { isTextColumn }           from './typeorm.utils'
import { isJsonColumn }           from './typeorm.utils'
import { isUuidColumn }           from './typeorm.utils'

export class SeederEntityFactory<Entity extends ObjectLiteral> {
  private withData: DeepPartial<Entity> = {}

  private repository: Repository<Entity>

  constructor(
    private readonly options: SeederFactoryOptions,
    private readonly entity: EntityTarget<Entity>
  ) {
    this.repository = this.options.connection.getRepository(this.entity)
  }

  with(data: DeepPartial<Entity> = {}) {
    this.withData = { ...this.withData, ...data }

    return this
  }

  async create(count: number = 1) {
    const items = Array.from(Array(count), () => this.generate())

    const result = await this.repository.save(items)

    return count === 1 ? result[0] : result
  }

  private generate() {
    const metadata = getMetadataArgsStorage()

    const columns = this.generateColumns(metadata, Object.keys(this.withData))

    return this.repository.merge(this.repository.create(columns), this.withData)
  }

  private generateColumns(metadata, exclude: Array<string> = []): DeepPartial<Entity> {
    const columns = metadata.filterColumns(this.entity)

    return columns.reduce((result, column) => {
      if (exclude.includes(column.propertyName)) {
        return result
      }

      if (!column.options.type) {
        return result
      }

      return {
        ...result,
        [column.propertyName]: this.generateColumn(column),
      }
    }, {})
  }

  private generateColumn(column) {
    if (column.options.default) {
      return column.options.default
    }

    if (isDateColumn(column.options.type)) {
      return generator.date()
    }

    if (isBooleanColumn(column.options.type)) {
      return generator.boolean()
    }

    if (isNumberColumn(column.options.type)) {
      return generator.number()
    }

    if (isTextColumn(column.options.type)) {
      return generator.text()
    }

    if (isJsonColumn(column.options.type)) {
      return generator.json()
    }

    if (isUuidColumn(column.options.type)) {
      return generator.uuid()
    }

    return undefined
  }
}
