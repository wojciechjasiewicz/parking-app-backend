import { DataSource } from 'typeorm';
import { ParkingMap } from './parking-maps.entity';

export const parkingMapProviders = [
  {
    provide: 'PARKING_MAP_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(ParkingMap),
    inject: ['DATA_SOURCE'],
  },
];
