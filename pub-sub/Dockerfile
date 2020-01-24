# define base image for multi-step process
FROM node:alpine as builder

# define working directory of docker container
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# install dependencies
COPY package.json /usr/src/app/
RUN npm install

# copy app into working directory
COPY . /usr/src/app

EXPOSE 9000
CMD [ "npm", "start" ]
