# Dockerfile
FROM node:20.11.1-alpine

# create destination directory
RUN mkdir -p /usr/src/back-app
WORKDIR /usr/src/back-app

# update and install dependency
RUN apk update && apk upgrade
RUN apk add git

# install node dependencies
COPY package.json package-lock.json ./
RUN npm install

# copy the app, note .dockerignore
COPY . /usr/src/back-app/

EXPOSE 8003

CMD ["npm", "run", "dev"]
