FROM mysql:latest

ENV MYSQL_ROOT_PASSWORD exco
ENV MYSQL_DATABASE exco
ENV MYSQL_USER root
ENV MYSQL_PORT 3306

ADD setup.sql /docker-entrypoint-initdb.d
EXPOSE 3306