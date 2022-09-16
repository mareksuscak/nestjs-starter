#!/bin/sh
set -e

# Run command with npm if the first argument contains a "-" or is not a system command. The last
# part inside the "{}" is a workaround for the following bug in ash/dash:
# https://bugs.debian.org/cgi-bin/bugreport.cgi?bug=874264
if [ "${1#-}" != "${1}" ] || [ -z "$(command -v "${1}")" ] || { [ -f "${1}" ] && ! [ -x "${1}" ]; }; then
  set -- npm "$@"
fi

echo "==> Starting entrypoint: $@"

# Disabled because we're connecting via UNIX socket and NetCat can't verify these connections.
# wait on dependent services to become ready
# if [ "$1" = 'npm' ] || [ "$1" = 'node' ]; then
# 	until nc -z $DB_HOST $DB_PORT; do
# 		echo "==> Waiting for the DB to be ready..."
# 		sleep 1
# 	done
# fi

# Configures the main command as PID 1. This allows the command to receive any Unix signals sent to the container.
# https://docs.docker.com/develop/develop-images/dockerfile_best-practices/#entrypoint
exec "$@"
