FROM node:22-alpine

WORKDIR /app

RUN npm install -g npm@latest

COPY package*.json ./

RUN npm ci --omit=dev

COPY . .

EXPOSE 5005

CMD ["npm", "start"]