FROM node:16.13.2 AS builder

# Create app directory
WORKDIR /app

ENV PORT=3001
ENV DATABASE_URL="mysql://root:C0nt4inerS@116.0.5.202:33006/meal-delivery"

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./
COPY prisma ./prisma/

# Install app dependencies
RUN npm install

COPY . .

RUN npm run build

FROM node:16.13.2

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist

EXPOSE 3001
CMD [ "npm", "run", "start:prod" ]