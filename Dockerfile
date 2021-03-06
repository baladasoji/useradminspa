FROM mhart/alpine-node:latest
#RUN apk add --no-cache curl tar bash
MAINTAINER Bala Dasoji

ARG VCS_REF
ARG BUILD_DATE

RUN npm i http-server -g

RUN mkdir /public
COPY *.html *.js *.css /public/
#COPY *.js /public/
#COPY *.css /public/
#COPY dist /public/dist/
WORKDIR /public
EXPOSE 8080
CMD ["http-server"]
