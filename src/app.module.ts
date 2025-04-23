import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { ParkingPlacesModule } from './parking-places/parking-places.module';
import { ReservationsModule } from './reservations/reservations.module';
import { ParkingMapsModule } from './parking-maps/parking-maps.module';
import * as multer from 'multer';
import { ConfigModule, ConfigService } from '@nestjs/config';
// import databaseConfig from './config/database.config';
import { OfficesModule } from './offices/offices.module';
import { UsersModule } from './users/users.module';
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
    ParkingPlacesModule,
    ReservationsModule,
    ParkingMapsModule,
    OfficesModule,
    UsersModule,
  ],
})
export class AppModule {}
