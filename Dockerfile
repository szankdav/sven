FROM node:18-alpine AS build

LABEL org.opencontainers.image.source="https://github.com/szankdav/sven"

WORKDIR /sven

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]
