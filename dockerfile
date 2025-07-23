FROM node:22-slim AS build

WORKDIR /app


COPY package*.json ./


RUN npm install --force


COPY . .


RUN npm run build

FROM node:22-slim AS production

WORKDIR /app

COPY --from=build /app/dist ./dist

COPY package*.json ./

RUN npm install --omit=dev


EXPOSE 3000


CMD [ "npm", "start" ]