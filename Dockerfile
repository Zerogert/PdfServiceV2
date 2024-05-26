FROM ghcr.io/puppeteer/puppeteer:22.10.0

USER node

ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY package.json .
RUN npm install --production --silent 
COPY . .
EXPOSE 3000


CMD ["node", "index.js"]
