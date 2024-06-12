import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import { NodeEnv } from '../config/app/enums/node-env.enum';
import * as dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.DATABASE_PORT, 10),
  username: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  synchronize: process.env.NODE_ENV === NodeEnv.DEV,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
} as DataSourceOptions);

// export class DataSource implements TypeOrmOptionsFactory {
//   constructor(private configService: ConfigService<AllConfigType>) {}
//
//   createTypeOrmOptions(): TypeOrmModuleOptions {
//     return {
//       type: 'postgres',
//       host: this.configService.get('postgres.host', { infer: true }),
//       port: this.configService.get('postgres.port', { infer: true }),
//       username: this.configService.get('postgres.username', { infer: true }),
//       password: this.configService.get('postgres.password', { infer: true }),
//       database: this.configService.get('postgres.database', { infer: true }),
//       entities: [__dirname + '/../**/*.entity{.ts,.js}'],
//       migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
//     } as TypeOrmModuleOptions;
//   }
// }
