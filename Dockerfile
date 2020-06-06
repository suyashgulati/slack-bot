FROM node:12
WORKDIR /app

COPY . /app

RUN npm install
RUN npm run build-ts
CMD [ "npm", "start" ]
EXPOSE 9000