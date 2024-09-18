import { EntityTarget }           from 'typeorm'
import { ObjectLiteral }          from 'typeorm'
import { DeepPartial }            from 'typeorm'
import { Repository }             from 'typeorm'
import { getMetadataArgsStorage } from 'typeorm'

import { SeederFactoryOptions }   from './seeder-factory.interfaces.js'
import { generator }              from '../generators/index.js'
import { isBooleanColumn }        from './typeorm.utils.js'
import { isNumberColumn }         from './typeorm.utils.js'
import { isDateColumn }           from './typeorm.utils.js'
import { isTextColumn }           from './typeorm.utils.js'
import { isUuidColumn }           from './typeorm.utils.js'

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
    metadata: Record<string, any>,
    exclude: Array<string> = []
  ): DeepPartial<Entity> {
    const columns = metadata.filterColumns(this.entity)

    // @ts-ignore
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

  // @ts-ignore
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

    if (isUuidColumn(column.options.type)) {
      return generator.uuid()
    }

    return undefined
  }
}
