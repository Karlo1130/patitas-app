FROM node:20-buster

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . ./app

EXPOSE 5000

CMD ["npm", "run", "dev"]
