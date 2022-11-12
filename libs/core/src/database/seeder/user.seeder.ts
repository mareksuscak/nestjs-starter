import { Dictionary, EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { UserFactory } from '../factories/user.factory';

export class UserSeeder extends Seeder {
  async run(em: EntityManager, context: Dictionary): Promise<void> {
    const factory = new UserFactory(em);
    const users = factory.make(1);
    em.persist(users);
    context.user = users[0];
  }
}
