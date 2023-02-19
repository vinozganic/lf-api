FROM node:18.14-alpine

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY package.json /usr/src/app

RUN npm install

COPY ./src /usr/src/app

EXPOSE 8000

CMD [ "node", "index.js" ]