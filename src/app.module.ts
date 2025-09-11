import { Module } from '@nestjs/common'
import { MulterModule } from '@nestjs/platform-express'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule, ConfigService } from '@nestjs/config'
import * as multer from 'multer'

import { ReservationsModule } from './reservation/reservations.module'
import { ParkingMapModule } from './parking-map/parking-map.module'
import { UsersModule } from './user/users.module'
import { typeOrmConfig } from './config/typeorm.config'

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
    ParkingMapModule,
    UsersModule,
  ],
})
export class AppModule {}
