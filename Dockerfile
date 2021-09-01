FROM node:lts-alpine

RUN apk add dumb-init

WORKDIR /usr/src/app
COPY . /usr/src/app

RUN yarn install
RUN yarn build

EXPOSE 4001

CMD ["dumb-init", "node", "lib/index.js"]