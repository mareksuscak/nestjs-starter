import { Migration } from '@mikro-orm/migrations';

export class Migration20220714225152 extends Migration {
  async up(): Promise<void> {
    this.addSql(`create extension if not exists pgcrypto;`);

    // Source: https://blog.daveallie.com/ulid-primary-keys
    this.addSql(`
    CREATE OR REPLACE FUNCTION generate_ulid() RETURNS uuid
      AS $$
        SELECT (lpad(to_hex(floor(extract(epoch FROM clock_timestamp()) * 1000)::bigint), 12, '0') || encode(gen_random_bytes(10), 'hex'))::uuid;
      $$ LANGUAGE SQL;
    `);
  }

  async down(): Promise<void> {
    this.addSql('drop function generate_ulid;');
    this.addSql('drop extension pgcrypto;');
  }
}
