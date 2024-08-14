FROM node:16-alpine

WORKDIR /usr/src/app
COPY package*.json ./

RUN npm install --only=production

COPY . .

ENV PORT=11235
ENV STATS_URL='https://soa051323jdsf2.azurewebsites.net/'
ENV DB_PROD='mongodb://log-db:27017/'
ENV DB='mongodb+srv://test:dy2nSenFodHf5V3V@cluster0.kfl4t.mongodb.net/log-service?retryWrites=true&w=majority'
ENV NODE_ENV='production'
ENV RABBITMQ_URL_DEV='amqp://guest:guest@164.8.222.89:5672'
ENV RABBITMQ_URL='amqp://student:student123@rabbit:5672'

RUN npm run build

EXPOSE 11235
CMD ["npm", "start"]
