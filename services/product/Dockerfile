FROM node:16-alpine

WORKDIR /usr/src/app
COPY package*.json ./

RUN npm install --only=production

COPY . .

RUN npm run build

ENV NODE_ENV='production'
ENV RABBITMQ_URL_DEV='amqp://guest:guest@164.8.222.89:5672'
ENV RABBITMQ_URL='amqp://student:student123@rabbit:5672'
ENV PORT=11233
ENV USER_SERVICE_URL='http://studentdocker.informatika.uni-mb.si:11231'
ENV DB_PROD='mongodb://product-db:27017/'
ENV DB='mongodb+srv://test:dy2nSenFodHf5V3V@cluster0.kfl4t.mongodb.net/product-service?retryWrites=true&w=majority'
ENV DB_LOG='mongodb://log-db:27017/'

EXPOSE 11231
CMD ["npm", "start"]
