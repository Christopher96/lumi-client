FROM node:9-slim
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm","run", "start:aws"]