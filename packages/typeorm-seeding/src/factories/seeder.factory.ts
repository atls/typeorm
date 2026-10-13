import type { EntityTarget }         from 'typeorm'
import type { ObjectLiteral }        from 'typeorm'

import type { SeederFactoryOptions } from './seeder-factory.interfaces.js'

import { SeederEntityFactory }       from './seeder-entity.factory.js'

export class SeederFactory {
  constructor(private readonly options: SeederFactoryOptions) {}

  for<Entity extends ObjectLiteral>(entity: EntityTarget<Entity>): SeederEntityFactory<Entity> {
    return new SeederEntityFactory<Entity>(this.options, entity)
  }
}
