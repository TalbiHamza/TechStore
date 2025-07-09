FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build 

EXPOSE 3000

CMD [ "npm", "start" ]


# The build artifacts will be located in /app/build
# No need to have the second Nginx stage since it's handled by the standalone Nginx