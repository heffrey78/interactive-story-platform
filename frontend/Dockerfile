FROM node:16.14.0

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libgtk2.0-0 \
    libgtk-3-0 \
    libgbm-dev \
    libnotify-dev \
    libgconf-2-4 \
    libnss3 \
    libxss1 \
    libasound2 \
    libxtst6 \
    xauth \
    xvfb

WORKDIR /app

# Create .npmrc file
RUN echo "legacy-peer-deps=true" > .npmrc

# Copy package files and ajv setup
COPY package*.json ./
COPY ajv-setup.js ./

# Clean and prepare npm
RUN npm cache clean --force && \
    rm -rf node_modules package-lock.json

# Install dependencies
RUN npm install --legacy-peer-deps

# Install Cypress and verify
RUN npm install cypress --save-dev && \
    npx cypress verify

# Copy the rest of the application code
COPY . .

# Set permissions
RUN mkdir -p node_modules/.cache && chmod -R 777 node_modules/.cache

# Expose port
EXPOSE 3000

# Set environment
ENV NODE_ENV=development
ENV AJV_FORMATS_ENABLED=true

# Start the application
CMD ["npm", "start"]