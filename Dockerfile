FROM node:18-alpine as builder
WORKDIR /usr/app/

COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine as runner
WORKDIR /usr/app/
COPY --from=builder /usr/app/package.json .
COPY --from=builder /usr/app/package-lock.json .
COPY --from=builder /usr/app/next.config.js ./
COPY --from=builder /usr/app/public ./public
COPY --from=builder /usr/app/.next/standalone ./
COPY --from=builder /usr/app/.next/static ./.next/static
EXPOSE 3000
ENTRYPOINT ["npm", "start"]