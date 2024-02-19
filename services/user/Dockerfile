FROM node:16-alpine

WORKDIR /usr/src/app
COPY package*.json ./

RUN npm install --only=production

COPY . .

RUN npm run build

EXPOSE 11231
CMD ["npm", "start"]