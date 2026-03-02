FROM node:18-bullseye

WORKDIR /app/backend

COPY backend/package*.json ./
RUN npm install

COPY backend/ ./

EXPOSE 3001

CMD ["npm", "run", "dev"]
