import { DataSource } from 'typeorm';

// 여기선 로컬서 쓰는 값으로 하드코딩
// 필요하면 수정해야
export const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'password',
  database: 'test',
  entities: [__dirname + '/src/*.entity{.ts,.js}'],
  synchronize: false,
  migrations: [__dirname + '/src/migrations/*{.ts,.js}'],
  migrationsTableName: 'migrations',
});
