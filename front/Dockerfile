# Dockerfile
FROM node:14.16.1-alpine

# create destination directory
RUN mkdir -p /usr/src/front-app
WORKDIR /usr/src/front-app

# update and install dependency
RUN apk update && apk upgrade
RUN apk add git

# copy the app, note .dockerignore
COPY . /usr/src/front-app/
RUN npm install -g @quasar/cli@1.0
RUN npm install

EXPOSE 9093

CMD ["quasar", "dev"]
