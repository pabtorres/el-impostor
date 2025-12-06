FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

COPY server.js .

EXPOSE 4173

CMD ["node", "server.js"]
