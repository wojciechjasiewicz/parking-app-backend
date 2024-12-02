import { DataSource } from 'typeorm';
import { ParkingPlace } from './parking-place.entity';

export const parkingPlaceProviders = [
  {
    provide: 'PARKING_PLACE_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(ParkingPlace),
    inject: ['DATA_SOURCE'],
  },
];
