import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { ParkingPlacesModule } from './parking-places/parking-places.module';
import { ReservationsModule } from './reservations/reservations.module';
import { ParkingMapsModule } from './parking-maps/parking-maps.module';
import * as multer from 'multer';
import { ConfigModule } from '@nestjs/config';
import databaseConfig from './config/database.config';
import { OfficesModule } from './offices/offices.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: false,
      isGlobal: true,
      load: [databaseConfig],
      envFilePath: ['.env'],
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
