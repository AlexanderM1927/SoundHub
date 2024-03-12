# Dockerfile
FROM node:14.16.1-alpine

# create destination directory
RUN mkdir -p /usr/src/back-app
WORKDIR /usr/src/back-app

# update and install dependency
RUN apk update && apk upgrade
RUN apk add git

# copy the app, note .dockerignore
COPY . /usr/src/back-app/
RUN npm install

EXPOSE 8003

CMD ["npm", "run", "start"]
