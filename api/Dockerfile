FROM node:7
WORKDIR /api
COPY package.json /api
RUN npm install
COPY . /api
CMD  npm start
EXPOSE 8080