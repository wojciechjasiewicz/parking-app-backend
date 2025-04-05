import { DataSource, DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { ConfigService } from '@nestjs/config';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => {
      const useSSL = configService.get<boolean>('database.useSSL');
      let options: DataSourceOptions = {
        type: 'postgres',
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.user'),
        password: configService.get<string>('database.password'),
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        migrations: ['dist/migration/*.js'],
        database: configService.get<string>('database.name'),
        namingStrategy: new SnakeNamingStrategy(),
      };

      if (useSSL) {
        options = { ...options, ssl: true };
      }

      const dataSource = new DataSource(options);

      return dataSource.initialize();
    },
  },
];
