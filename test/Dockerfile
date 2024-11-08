FROM docker:dind AS build

RUN apk add nodejs npm
WORKDIR /app

COPY package*.json ./

RUN npm ci
COPY  . .


ENTRYPOINT ["npm", "run", "waitforexit"]
