FROM node:20.10.0
LABEL authors="petergrubelnik"
WORKDIR /ralff-fe

# Set environment variables during the build process - passed over docker-compose.yml
ENV VITE_RALFF_BE_WS=$VITE_RALFF_BE_WS

COPY package*.json .
RUN npm install
ADD . .

CMD ["npm", "run", "dev"]