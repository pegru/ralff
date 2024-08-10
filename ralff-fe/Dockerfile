FROM node:20.10.0
LABEL authors="petergrubelnik"
WORKDIR /ralff-fe

COPY package*.json .
RUN npm install
ADD . .

CMD ["npm", "run", "start"]