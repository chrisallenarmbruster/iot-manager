FROM node:18

WORKDIR /app

RUN npm config set registry https://registry.npmmirror.com

RUN npm install -g forever

COPY package*.json ./

RUN npm config set fetch-retry-maxtimeout 120000 && \
    npm config set fetch-retry-mintimeout 30000 && \
    (for i in {1..5}; do npm install --verbose && break || sleep 15; done; if [ $? -ne 0 ]; then exit 1; fi)

COPY . .

EXPOSE 2500 3000

CMD ["forever", "server/index.js"]
