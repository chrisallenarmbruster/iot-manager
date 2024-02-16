FROM node:20

ENV NODE_ENV=production

WORKDIR /app

RUN npm config set registry https://registry.npmjs.org/

RUN npm install -g forever

COPY package*.json ./

RUN npm install --verbose || { echo 'npm install failed'; exit 1; }

COPY . .

EXPOSE 2500 3000

CMD ["forever", "server/index.js"]
