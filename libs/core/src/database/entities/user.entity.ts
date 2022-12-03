import { IsEmail } from 'class-validator';
import { Entity, EntityRepositoryType, Enum, Filter, Formula, Index, Property } from '@mikro-orm/core';
import { BaseEntity } from './base.entity';
import { UserRepository } from '../repositories/user.repository';

@Entity({ customRepository: () => UserRepository })
@Filter({ name: 'default', cond: { deletedAt: { $eq: null } }, default: true })
@Index({
  name: 'user_email_lower_unique',
  expression: `CREATE UNIQUE INDEX "user_email_lower_unique" ON "user" (LOWER("email"));`,
})
export class User extends BaseEntity {
  [EntityRepositoryType]?: UserRepository;

  @Property({ nullable: true })
  firstName?: string;

  @Property({ nullable: true })
  lastName?: string;

  @Formula((alias) => `CONCAT(${alias}.first_name, ' ', ${alias}.last_name)`)
  fullName?: string;

  @Property({ length: 320, unique: true })
  @IsEmail()
  email: string;

  @Formula((alias) => `LOWER(${alias}.email)`)
  emailLower: string;

  @Property({ nullable: true })
  lastLoginAt?: Date;

  @Property({ nullable: true })
  deletedAt?: Date;

  @Enum(() => UserRole)
  role: UserRole = UserRole.User;
}

export enum UserRole {
  User = 'user',
  Admin = 'admin',
}
