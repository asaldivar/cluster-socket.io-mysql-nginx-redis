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

# build production version of app
RUN npm run build

FROM nginx
EXPOSE 3000
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /usr/src/app/build /usr/share/nginx/html