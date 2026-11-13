FROM node:26-alpine AS build
LABEL maintainer="Stavros Grigoriou <unix121@protonmail.com>"

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN npm run build -- --configuration=production

FROM nginx:stable-alpine
LABEL maintainer="Stavros Grigoriou <unix121@protonmail.com>"

RUN rm /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/conf.d

COPY --from=build /app/dist/ui/browser /usr/share/nginx/html

EXPOSE 80
