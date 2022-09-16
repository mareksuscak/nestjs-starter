ARG POSTGRES_VERSION=14.4

FROM postgres:${POSTGRES_VERSION}-alpine
COPY initdb.sql /docker-entrypoint-initdb.d/
