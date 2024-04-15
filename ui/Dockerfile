FROM node:latest AS build
MAINTAINER Stavros Grigoriou <unix121@protonmail.com>

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

# FIXME: Uncomment for production build
#RUN npm run build --configuration=production
RUN npm run build --configuration=development

FROM nginx:latest

RUN rm /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/conf.d

COPY --from=build /app/dist/ui/browser /usr/share/nginx/html

EXPOSE 80
