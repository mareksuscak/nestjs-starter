ARG POSTGRES_VERSION=15.1

FROM postgres:${POSTGRES_VERSION}-alpine
COPY initdb.sql /docker-entrypoint-initdb.d/
