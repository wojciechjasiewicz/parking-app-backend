import { DataSource } from 'typeorm';
import { Office } from './office.entity';

export const officeProviders = [
  {
    provide: 'OFFICE_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Office),
    inject: ['DATA_SOURCE'],
  },
];
