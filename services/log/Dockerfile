FROM node:16-alpine

WORKDIR /usr/src/app
COPY package*.json ./

RUN npm install --only=production

COPY . .

ENV PORT=11235
ENV PRODUCT_SERVICE_URL='http://product-service:11233'
ENV SECRET='ms-secret'

# Database
ENV DB='mongodb+srv://test:dy2nSenFodHf5V3V@cluster0.kfl4t.mongodb.net/log-service?retryWrites=true&w=majority'
ENV DB_USER='mongodb+srv://test:dy2nSenFodHf5V3V@cluster0.kfl4t.mongodb.net/user-service?retryWrites=true&w=majority'


RUN npm run build

EXPOSE 11235
CMD ["npm", "start"]
