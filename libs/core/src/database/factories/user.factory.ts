import { Factory, Faker } from '@mikro-orm/seeder';
import { User, UserRole } from '../entities/user.entity';

export class UserFactory extends Factory<User> {
  model = User;

  definition(faker: Faker): Partial<User> {
    return {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.helpers.unique(faker.internet.email),
      role: UserRole.Admin,
    };
  }
}
