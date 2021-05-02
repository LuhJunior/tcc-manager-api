FROM node:lts-alpine as development

WORKDIR /app

COPY package*.json ./

COPY tsconfig.json ./

RUN npm ci --quiet

FROM node:lts-alpine as production

ENV NODE_ENV=production

WORKDIR /app

COPY package*.json ./

COPY ./src ./src

RUN npm ci --quiet

RUN npm run build

COPY ./prisma ./prisma

RUN npm ci --quiet --only=production

EXPOSE ${PORT}

RUN npx prisma migrate deploy

CMD ["node", "dist/main.js"]
