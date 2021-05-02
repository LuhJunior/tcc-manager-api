FROM node:lts-alpine as development

WORKDIR /app

COPY package*.json ./

COPY tsconfig.json ./

RUN npm ci --quiet

RUN npm run build

FROM node:lts-alpine as production

ENV NODE_ENV=production

WORKDIR /app

COPY package*.json ./

COPY /prisma ./

RUN npm ci --quiet --only=production

COPY --from=builder /app/dist ./dist

EXPOSE ${PORT}

RUN npx prisma migrate deploy

CMD ["node", "dist/main.js"]
