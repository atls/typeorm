import { EntityTarget }         from 'typeorm'

import { SeederEntityFactory }  from './seeder-entity.factory.js'
import { SeederFactoryOptions } from './seeder-factory.interfaces.js'

export class SeederFactory {
  constructor(private readonly options: SeederFactoryOptions) {}

  // @ts-ignore
  for<Entity>(entity: EntityTarget<Entity>): SeederEntityFactory<Entity> {
    // @ts-ignore
    return new SeederEntityFactory<Entity>(this.options, entity)
  }
}
