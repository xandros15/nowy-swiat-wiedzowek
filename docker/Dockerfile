ARG NODE_ENV=production

FROM node:16.9.1-alpine AS frontend-builder
ENV NODE_ENV $NODE_ENV
WORKDIR /app
COPY ./frontend .
RUN npm ci && npm cache clean --force && npm run build

FROM node:16.9.1-alpine AS backend
ENV NODE_ENV $NODE_ENV
WORKDIR /app
RUN chown node:node ./
USER node
COPY ./backend/package.json ./backend/package-lock.json* ./
RUN npm ci && npm cache clean --force
COPY ./backend/src/* ./src/
COPY ./backend/app.js ./rooms.yml* ./
CMD ["node", "./app.js"]

FROM nginx:stable-alpine AS frontend
COPY --from=frontend-builder /app/dist /app
COPY ./docker/frontend /etc/nginx/conf.d
EXPOSE 80

FROM nginx:stable-alpine AS proxy
COPY ./docker/proxy /etc/nginx/conf.d
EXPOSE 80