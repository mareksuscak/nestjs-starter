import { Migration } from '@mikro-orm/migrations';

export class Migration20220916212605 extends Migration {
  async up(): Promise<void> {
    this.addSql(`create extension if not exists pgcrypto;`);

    // Source: https://blog.daveallie.com/ulid-primary-keys
    this.addSql(`
    CREATE OR REPLACE FUNCTION generate_ulid() RETURNS uuid
      AS $$
        SELECT (lpad(to_hex(floor(extract(epoch FROM clock_timestamp()) * 1000)::bigint), 12, '0') || encode(gen_random_bytes(10), 'hex'))::uuid;
      $$ LANGUAGE SQL;
    `);

    this.addSql(
      'create table "user" ("id" uuid not null default generate_ulid(), "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "first_name" varchar(255) null, "last_name" varchar(255) null, "email" varchar(320) not null, "role" text check ("role" in (\'user\', \'admin\')) not null, constraint "user_pkey" primary key ("id"));',
    );
    this.addSql(
      'alter table "user" add constraint "user_email_unique" unique ("email");',
    );
  }
}
