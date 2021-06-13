import faker               from 'faker'

import { numberGenerator } from './number.generator'
import { dateGenerator }   from './date.generator'
import { textGenerator }   from './text.generator'

export const generator = {
  number: numberGenerator,
  date: dateGenerator,
  text: textGenerator,

  boolean: faker.datatype.boolean,
  uuid: faker.datatype.uuid,
  json: faker.datatype.json,
}
