FROM node:18.14-alpine as base

WORKDIR /app
COPY package*.json ./
EXPOSE 8000

FROM base as production
ENV NODE_ENV=production
RUN npm ci 
COPY . .
WORKDIR /app/src
CMD ["node", "index.js"]

FROM base as dev
ENV NODE_ENV=development
RUN npm install -g nodemon && npm install
COPY . .
WORKDIR /app/src
CMD ["nodemon", "index.js"]