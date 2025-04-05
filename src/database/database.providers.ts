import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { ConfigService } from '@nestjs/config';
import { type } from 'node:os';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => {
      console.log(configService);
      const dataSource = new DataSource({
        type: 'postgres',
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.user'),
        password: configService.get<string>('database.password'),
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        migrations: ['dist/migration/*.js'],
        database: configService.get<string>('database.name'),
        namingStrategy: new SnakeNamingStrategy(),
        ssl: true,
      });

      return dataSource.initialize();
    },
  },
];
