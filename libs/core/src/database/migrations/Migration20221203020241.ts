import { Migration } from '@mikro-orm/migrations';

export class Migration20221203020241 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "user" ("id" uuid not null default generate_ulid(), "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "first_name" varchar(255) null, "last_name" varchar(255) null, "email" varchar(320) not null, "last_login_at" timestamptz(0) null, "deleted_at" timestamptz(0) null, "role" text check ("role" in (\'user\', \'admin\')) not null default \'user\', constraint "user_pkey" primary key ("id"));',
    );
    this.addSql('alter table "user" add constraint "user_email_unique" unique ("email");');
    this.addSql('CREATE UNIQUE INDEX "user_email_lower_unique" ON "user" (LOWER("email"));;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "user" cascade;');
  }
}
