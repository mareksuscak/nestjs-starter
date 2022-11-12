ARG POSTGRES_VERSION=14.6

FROM postgres:${POSTGRES_VERSION}-alpine
COPY initdb.sql /docker-entrypoint-initdb.d/
