# first stage: build the ap
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# second stage: production stage
FROM node:22-alpine AS production

WORKDIR /app 

COPY --from=builder --chown=node:node /app/dist ./dist
COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/package*.json ./

USER node

CMD ["node", "dist/src/main.js"]