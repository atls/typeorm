import { EntityTarget }         from 'typeorm'

import { SeederFactoryOptions } from './seeder-factory.interfaces'
import { SeederEntityFactory }  from './seeder-entity.factory'

export class SeederFactory {
  constructor(private readonly options: SeederFactoryOptions) {}

  for<Entity>(entity: EntityTarget<Entity>): SeederEntityFactory<Entity> {
    return new SeederEntityFactory<Entity>(this.options, entity)
  }
}
