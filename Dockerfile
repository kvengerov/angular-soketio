# Stage 0, "build-stage", based on Node.js, to build and compile Angular
FROM tiangolo/node-frontend:10 as build-stage

WORKDIR /app

COPY package*.json /app/

RUN npm install

COPY ./ /app/

RUN npm run test:docker

RUN npm run build:docker -- --output-path=./dist/out

# Stahge 1, based on Nginx, to have only the compiled app, ready for production with Nginx
FROM nginx:1.15

COPY --from=build-stage /app/dist/out/ /usr/share/nginx/html

COPY ci/nginx.conf /etc/nginx/conf.d/default.conf

# override environment variables from .env on each docker start
ADD ci/run.sh .

ENTRYPOINT ["sh", "run.sh"]