# There's a bug that causes segfaults on Google Cloud Run
# https://github.com/google/gvisor/issues/267
# https://github.com/nodejs/docker-node/issues/1158

# base node image
FROM node:18-alpine as base

# build stage
FROM base As build
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn run build api
RUN yarn run build worker
RUN yarn run build scheduler

# production stage
FROM base as production
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
ARG COMMIT_REF
ENV COMMIT_REF=${COMMIT_REF}
ARG BUILD_DATE
ENV BUILD_DATE=${BUILD_DATE}
ENV TZ=Etc/UTC
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile && yarn cache clean
COPY --from=build /usr/src/app/apps ./apps
COPY --from=build /usr/src/app/libs ./libs
COPY --from=build /usr/src/app/dist ./dist
CMD [ "node", "dist/apps/api/main.js" ]
