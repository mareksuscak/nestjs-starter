import { IsEmail } from 'class-validator';
import { Entity, EntityRepositoryType, Enum, Property } from '@mikro-orm/core';
import { BaseEntity } from './base.entity';
import { UserRepository } from '../repositories/user.repository';

@Entity({ customRepository: () => UserRepository })
export class User extends BaseEntity {
  [EntityRepositoryType]?: UserRepository;

  @Property({ nullable: true })
  firstName?: string;

  @Property({ nullable: true })
  lastName?: string;

  @Property({ length: 320, unique: true })
  @IsEmail()
  email: string;

  @Enum(() => UserRole)
  role: UserRole = UserRole.User;
}

export enum UserRole {
  User = 'user',
  Admin = 'admin',
}
