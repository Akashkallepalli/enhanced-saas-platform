FROM node:20.15-alpine3.19 AS builder

WORKDIR /app

RUN apk add --no-cache dumb-init

COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

COPY . .

FROM node:20.15-alpine3.19

RUN apk add --no-cache dumb-init
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --chown=nodejs:nodejs . .

USER nodejs
EXPOSE 3000

ENTRYPOINT ["/sbin/dumb-init", "--"]
CMD ["npm", "run", "dev"]
