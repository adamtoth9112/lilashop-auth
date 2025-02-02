# Use Node.js official image as the base
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Compile TypeScript files
RUN npm run build

# Expose the application port
EXPOSE 5000

# Start the application
CMD ["node", "dist/server.js"]
