FROM node:16

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Install global dependencies
RUN npm install -g @nestjs/cli

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:dev"]
