# --- BASE ---
FROM node:17-slim AS base
# set for base and all layer that inherit from it
ENV NODE_ENV production

# --- INSTALL EDGEDB-JS ---
FROM base as edgedb-deps
WORKDIR /build
COPY package.json .
RUN echo '{"dependencies": {' $(grep -E -o '"edgedb":\s"(.*)"' package.json) '}}' > package.json && yarn install

# --- GENERATE EDGEDB QUERY BUILDER ---
FROM edgedb/edgedb:1 AS edgedb
COPY --from=edgedb-deps /usr/local/bin/node /usr/local/bin/node
RUN mkdir /build && chown edgedb:edgedb /build
USER edgedb
WORKDIR /build
COPY --from=edgedb-deps /build .
COPY dbschema dbschema
# The generated edgeql-js client will be at /build/generated!
RUN edgedb-server \
    -D /build/data \
    --security insecure_dev_mode \
    --runstate-dir /build/runstate \
    & edgedb migration apply \
    -H localhost \
    --tls-security insecure \
    --wait-until-available 2m \
    && node ./node_modules/.bin/edgeql-js \
    -H localhost \
    --target cjs \
    --tls-security insecure \
    --output-dir generated

# --- INSTALL ALL DEPENDENCIES ---
FROM base as deps
WORKDIR /app

COPY package.json yarn.lock ./
# Set env to dev so we can build the client app
RUN NODE_ENV=development yarn install --frozen-lockfile


# --- BUILD APP ---
FROM base as build
WORKDIR /app

ADD . .

COPY --from=deps /app/node_modules /app/node_modules
COPY --from=edgedb /build/generated /app/app/db/edgeql

# Prune out dev dependencies after building
# https://github.com/yarnpkg/yarn/issues/696#issuecomment-258418656
RUN yarn build && yarn install --production --ignore-scripts --prefer-offline


# --- PROD IMAGE ---
FROM base
WORKDIR /app

ADD . .

COPY --from=build /app/node_modules /app/node_modules
COPY --from=edgedb /build/generated /app/app/db/edgeql
COPY --from=edgedb /usr/bin/edgedb /usr/bin/edgedb

COPY --from=build /app/build /app/build
COPY --from=build /app/public /app/public

CMD ["yarn", "start"]
