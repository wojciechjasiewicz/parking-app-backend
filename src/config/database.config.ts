import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  name: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: 5432,
}));
