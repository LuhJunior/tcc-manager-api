FROM node:lts-alpine as development

WORKDIR /app

COPY package*.json ./

COPY tsconfig.json ./

RUN npm ci --quiet
