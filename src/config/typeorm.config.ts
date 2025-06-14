import { registerAs } from '@nestjs/config'
import { config as dotenvConfig } from 'dotenv'
import { DataSource, type DataSourceOptions } from 'typeorm'
import { SnakeNamingStrategy } from 'typeorm-naming-strategies'

dotenvConfig({ path: '.env' })

let config: DataSourceOptions = {
  type: 'postgres',
  host: `${process.env.DB_HOST}`,
  port: 5432,
  username: `${process.env.DB_USER}`,
  password: `${process.env.DB_PASSWORD}`,
  database: `${process.env.DB_NAME}`,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../../db-migrations/*{.ts,.js}'],
  synchronize: false,
  namingStrategy: new SnakeNamingStrategy(),
  migrationsRun: true,
}

if (process.env.DB_USE_SSL === 'true') {
  config = { ...config, ssl: true }
}

console.log('config: ', JSON.stringify(config))

export const typeOrmConfig = registerAs('typeorm', () => config)
export default new DataSource(config as DataSourceOptions)
