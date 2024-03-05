import { EntityTarget }         from 'typeorm'

import { SeederEntityFactory }  from './seeder-entity.factory'
import { SeederFactoryOptions } from './seeder-factory.interfaces'

export class SeederFactory {
  constructor(private readonly options: SeederFactoryOptions) {}

  for<Entity>(entity: EntityTarget<Entity>): SeederEntityFactory<Entity> {
    return new SeederEntityFactory<Entity>(this.options, entity)
  }
}
