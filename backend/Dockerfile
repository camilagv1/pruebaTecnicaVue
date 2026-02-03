FROM node:18

WORKDIR /app

# Install nodemon globally for development
RUN npm install -g nodemon

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
