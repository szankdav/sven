FROM node:22.13.0-alpine AS build

LABEL org.opencontainers.image.source="https://github.com/szankdav/sven"

WORKDIR /sven

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:22.13.0-alpine AS runtime

LABEL org.opencontainers.image.source="https://github.com/szankdav/sven"

WORKDIR /sven

COPY --from=build /sven/package*.json ./

RUN npm install --omit=dev

COPY --from=build /sven/dist ./dist

EXPOSE 3000

CMD ["npm", "run", "start"]
