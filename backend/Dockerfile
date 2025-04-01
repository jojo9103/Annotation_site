
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# 필요한 디렉토리 생성
RUN mkdir -p uploads storage/users storage/exports

EXPOSE 8080

CMD ["node", "server.js"]

