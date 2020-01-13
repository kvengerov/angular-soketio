FROM node:11.15.0-alpine as build-stage
WORKDIR /app
COPY package*.json /app/
RUN npm install
COPY ./ /app/
RUN npm run build

FROM nginx:1.16.0-alpine as prod-stage
COPY --from=build-stage /app/dist/angular-soketio /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
