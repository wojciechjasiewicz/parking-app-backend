import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { ReservationsModule } from './reservation/reservations.module';
import { ParkingMapsModule } from './parking-map/parking-map.module';
import * as multer from 'multer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './user/users.module';
import { typeOrmConfig } from './config/typeorm.config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeOrmConfig],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configService.get('typeorm'),
    }),
    MulterModule.register({
      storage: multer.memoryStorage(),
      limits: { fileSize: 1024 * 1024 * 5 },
    }),
    ReservationsModule,
    ParkingMapsModule,
    UsersModule,
  ],
})
export class AppModule {}
