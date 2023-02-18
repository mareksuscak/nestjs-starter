import { MikroOrmModule, MikroOrmModuleSyncOptions } from '@mikro-orm/nestjs';
import mikroOrmConfig from './mikro-orm.config';

const mikroOrmOptions: MikroOrmModuleSyncOptions = {
  ...mikroOrmConfig,
  allowGlobalContext: process.env.NODE_ENV === 'test',
  entities: [],
  entitiesTs: [],
  autoLoadEntities: true,
};

export const DatabaseModule = MikroOrmModule.forRoot(mikroOrmOptions);
