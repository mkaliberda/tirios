FROM node:20.19-bullseye

WORKDIR /app/backend

COPY backend/package*.json ./
RUN npm install
COPY backend/ ./
RUN npx prisma generate --schema=./prisma/schema.prisma

EXPOSE 3001

CMD ["npm", "run", "dev"]
