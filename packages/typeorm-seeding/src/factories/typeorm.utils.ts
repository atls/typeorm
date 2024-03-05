import { ColumnType } from 'typeorm'

export const booleanTypes = ['bool', 'boolean']

export const numberTypes = [
  'tinyint',
  'smallint',
  'mediumint',
  'double',
  'double precision',
  'dec',
  'decimal',
  'numeric',
  'fixed',
  'int',
  'int2',
  'int4',
  'int8',
  'smallint',
  'integer',
  'bigint',
  'decimal',
  'numeric',
  'real',
  'float',
  'float4',
  'float8',
]

export const textTypes = [
  'character varying',
  'varchar',
  'character',
  'citext',
  'char',
  'nchar',
  'national char',
  'varchar',
  'nvarchar',
  'national varchar',
  'text',
  'tinytext',
  'mediumtext',
]

export const dateTypes = [
  'date',
  'time',
  'datetime',
  'timestamp',
  'year',
  'timetz',
  'timestamptz',
  'timestamp',
  'timestamp without time zone',
  'timestamp with time zone',
  'time without time zone',
  'time with time zone',
]

export const jsonTypes = ['json', 'jsonb', 'simple-json']

export const isTextColumn = (type: ColumnType) =>
  type === String || textTypes.includes(type as string)

export const isNumberColumn = (type: ColumnType) =>
  type === Number || numberTypes.includes(type as string)

export const isBooleanColumn = (type: ColumnType) =>
  type === Boolean || booleanTypes.includes(type as string)

export const isDateColumn = (type: ColumnType) =>
  type === Date || dateTypes.includes(type as string)

export const isJsonColumn = (type: ColumnType) => jsonTypes.includes(type as string)

export const isUuidColumn = (type: ColumnType) => type === 'uuid'
