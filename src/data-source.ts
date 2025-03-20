import { DataSource } from 'typeorm';
import ormconfig from './ormconfig';

const AppDataSource = new DataSource({
  ...ormconfig,
  type: 'postgres',
});

export default AppDataSource;
