FROM node:16-alpine

WORKDIR /usr/src/app
COPY package*.json ./

RUN npm install --only=production

COPY . .

ENV NODE_ENV='production'
ENV RABBITMQ_URL_DEV='amqp://guest:guest@164.8.222.89:5672'
ENV RABBITMQ_URL='amqp://student:student123@rabbit:5672'
ENV PORT=11231
ENV SECRET='secret'
ENV PRODUCT_SERVICE_URL='http://product-service:11233'
ENV DB_PROD='mongodb://user-db:27017/'
ENV DB='mongodb+srv://test:dy2nSenFodHf5V3V@cluster0.kfl4t.mongodb.net/user-service?retryWrites=true&w=majority'

RUN npm run build

EXPOSE 11231
CMD ["npm", "start"]