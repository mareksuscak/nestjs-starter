import { MikroOrmModule } from '@mikro-orm/nestjs';
import mikroOrmConfig from './mikro-orm.config';

export const DatabaseModule = MikroOrmModule.forRoot({
  ...mikroOrmConfig,
  entities: [],
  entitiesTs: [],
  autoLoadEntities: true,
});
