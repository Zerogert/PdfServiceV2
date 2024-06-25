ARG ALPINE_VERSION=3.20

FROM node:20-alpine${ALPINE_VERSION} AS builder
WORKDIR /build-stage
COPY package*.json ./
RUN npm ci
COPY . ./
RUN npm install --production




FROM alpine:${ALPINE_VERSION}

RUN apk upgrade --no-cache --available \
    && apk add --no-cache \
      chromium-swiftshader \
      ttf-freefont \
      font-noto-emoji \
    && apk add --no-cache \
      --repository=https://dl-cdn.alpinelinux.org/alpine/edge/community \
      font-wqy-zenhei

WORKDIR /usr/src/app

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD 1
ENV PUPPETEER_EXECUTABLE_PATH /usr/bin/chromium-browser

RUN apk add --no-cache libstdc++ dumb-init \
  && addgroup -g 1000 node && adduser -u 1000 -G node -s /bin/sh -D node \
  && chown node:node ./

COPY --from=builder /usr/local/bin/node /usr/local/bin/
COPY --from=builder /usr/local/bin/docker-entrypoint.sh /usr/local/bin/
ENTRYPOINT ["docker-entrypoint.sh"]
USER node
COPY --from=builder /build-stage/node_modules ./node_modules
COPY --from=builder /build-stage/src .
# Run with dumb-init to not start node with PID=1, since Node.js was not designed to run as PID 1
CMD ["dumb-init", "node", "index.js"]