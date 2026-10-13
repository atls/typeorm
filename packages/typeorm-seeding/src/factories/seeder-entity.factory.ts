import type { EntityTarget }         from 'typeorm'
import type { ObjectLiteral }        from 'typeorm'
import type { DeepPartial }          from 'typeorm'
import type { Repository }           from 'typeorm'

import type { SeederFactoryOptions } from './seeder-factory.interfaces.js'

import { getMetadataArgsStorage }    from 'typeorm'

import { generator }                 from '../generators/index.js'
import { isBooleanColumn }           from './typeorm.utils.js'
import { isNumberColumn }            from './typeorm.utils.js'
import { isDateColumn }              from './typeorm.utils.js'
import { isTextColumn }              from './typeorm.utils.js'
import { isUuidColumn }              from './typeorm.utils.js'

type ColumnMetadata = ReturnType<ReturnType<typeof getMetadataArgsStorage>['filterColumns']>[number]

export class SeederEntityFactory<Entity extends ObjectLiteral> {
  private withData: DeepPartial<Entity> = {} as DeepPartial<Entity>

  private repository: Repository<Entity>

  constructor(
    private readonly options: SeederFactoryOptions,
    private readonly entity: EntityTarget<Entity>
  ) {
    this.repository = this.options.connection.getRepository(this.entity)
  }

  with(data: DeepPartial<Entity> = {} as DeepPartial<Entity>) {
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

  private generateColumns(
    metadata: ReturnType<typeof getMetadataArgsStorage>,
    exclude: Array<string> = []
  ): DeepPartial<Entity> {
    const columns = metadata.filterColumns(this.repository.metadata.target)

    const generated = columns.reduce<Record<string, unknown>>((result, column) => {
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

    return generated as DeepPartial<Entity>
  }

  private generateColumn(column: ColumnMetadata): unknown {
    if (column.options.default) {
      const defaultValue: unknown = column.options.default

      return defaultValue
    }

    const { type } = column.options

    if (!type) {
      return undefined
    }

    if (isDateColumn(type)) {
      return generator.date()
    }

    if (isBooleanColumn(type)) {
      return generator.boolean()
    }

    if (isNumberColumn(type)) {
      return generator.number()
    }

    if (isTextColumn(type)) {
      return generator.text()
    }

    if (isUuidColumn(type)) {
      return generator.uuid()
    }

    return undefined
  }
}
