export default {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'Pass123$',
  database: 'postgres',
  entities: [__dirname + '/**/*.entity.{ts,js}'],
  synchronize: false, // set true in dev only; recommended false in production
  migrations: [__dirname + '/migrations/*.{ts,js}'],
};
