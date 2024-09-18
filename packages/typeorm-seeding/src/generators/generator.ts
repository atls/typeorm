import { faker }           from '@faker-js/faker'

import { dateGenerator }   from './date.generator.js'
import { numberGenerator } from './number.generator.js'
import { textGenerator }   from './text.generator.js'

export const generator = {
  number: numberGenerator,
  date: dateGenerator,
  text: textGenerator,
  boolean: faker.datatype.boolean,
  uuid: faker.string.uuid,
}
