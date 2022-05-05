# --- BASE ---
FROM node:17-slim AS base
# set for base and all layer that inherit from it
ENV NODE_ENV production

# --- INSTALL EDGEDB-JS ---
FROM base as edgedb-deps
WORKDIR /build
COPY package.json .
RUN echo '{"dependencies": {' $(grep -E -o '"edgedb":\s"(.*)"' package.json) '}}' > package.json && yarn

# --- GENERATE EDGEDB QUERY BUILDER ---
FROM edgedb/edgedb:1 AS edgedb
COPY --from=edgedb-deps /usr/local/bin/node /usr/local/bin/node
RUN mkdir /build && chown edgedb:edgedb /build
USER edgedb
WORKDIR /build
COPY --from=edgedb-deps /build .
COPY dbschema dbschema
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
# The generated edgeql-js client is now at /build/generated!

# --- SETUP APP BUILDER ---
FROM base as deps
WORKDIR /app

# Copy in the package file as well as other yarn
# dependencies in the local directory, assuming the
# yarn berry release module is inside .yarn/releases
# already
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn ./.yarn

RUN yarn install --immutable

# --- BUILD APP ---
FROM base as build
WORKDIR /app

ADD . .

COPY --from=deps /app/node_modules /app/node_modules
COPY --from=edgedb /build/generated /app/app/db/edgeql

RUN yarn build

# --- PROD IMAGE ---
FROM base
WORKDIR /app

ADD . .

COPY --from=deps /app/node_modules /app/node_modules
COPY --from=edgedb /build/generated /app/app/db/edgeql
COPY --from=edgedb /usr/bin/edgedb /usr/bin/edgedb

COPY --from=build /app/build /app/build
COPY --from=build /app/public /app/public

CMD ["yarn", "start"]
