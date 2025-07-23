FROM node:22-slim


WORKDIR /app


COPY package*.json ./


RUN npm ci --omit=dev


COPY . .


EXPOSE 3000


ENV PORT 3000

CMD [ "npm", "start" ]