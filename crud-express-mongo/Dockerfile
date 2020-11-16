FROM node:12.16.3

WORKDIR /code

EXPOSE 80

COPY package.json /code/package.json

RUN npm install

COPY . /code

CMD ["node", "src/server.js"]

