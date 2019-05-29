FROM node:10
LABEL maintainer Jure Stepisnik

WORKDIR /app

COPY package.json /app/package.json
COPY index.js /app/index.js
COPY config.js /app/config.js
COPY src /app/src

RUN npm install
CMD node index.js