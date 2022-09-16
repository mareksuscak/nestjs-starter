-- The following snippet will create a test database
CREATE USER "app-test" WITH PASSWORD 'app-test';
CREATE DATABASE "app-test";
GRANT ALL PRIVILEGES ON DATABASE "app-test" TO "app-test";
