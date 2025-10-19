FROM node:20.18.0-alpine3.19

WORKDIR /backend
COPY . .

RUN npm install
EXPOSE 3000

CMD ["npm", "start"]