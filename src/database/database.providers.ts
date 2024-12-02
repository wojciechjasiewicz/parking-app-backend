import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'yourUsername',
        password: 'yourPassword',
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        migrations: ['dist/migration/*.js'],
        database: 'postgres',
        namingStrategy: new SnakeNamingStrategy(),
      });

      return dataSource.initialize();
    },
  },
];
