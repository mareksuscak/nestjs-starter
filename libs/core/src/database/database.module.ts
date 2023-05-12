import { Module } from '@nestjs/common';
import { MikroOrmModule, MikroOrmModuleSyncOptions } from '@mikro-orm/nestjs';
import { User } from './entities/user.entity';
import mikroOrmConfig from './mikro-orm.config';

const mikroOrmOptions: MikroOrmModuleSyncOptions = {
  ...mikroOrmConfig,
  allowGlobalContext: process.env.NODE_ENV === 'test',
  entities: [],
  entitiesTs: [],
  autoLoadEntities: true,
};

@Module({
  imports: [MikroOrmModule.forRoot(mikroOrmOptions), MikroOrmModule.forFeature([User])],
})
export class DatabaseModule {}
