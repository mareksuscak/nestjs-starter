import { MikroOrmModule } from '@mikro-orm/nestjs';
import mikroOrmConfig from './mikro-orm.config';

export const DatabaseModule = MikroOrmModule.forRoot({
  ...mikroOrmConfig,
  allowGlobalContext: process.env.NODE_ENV === 'test',
  entities: [],
  entitiesTs: [],
  autoLoadEntities: true,
});
