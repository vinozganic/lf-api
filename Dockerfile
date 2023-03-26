FROM node:18-bullseye as base

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
CMD ["npm", "run", "start:dev"]

FROM base as test
ENV NODE_ENV=test
RUN npm install -g jest && npm install
COPY . .
WORKDIR /app/src
CMD ["npm", "test"]