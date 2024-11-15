# Use an official Node.js runtime as the base image
FROM node:14

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose port 5000
EXPOSE 5000

# Start the backend server
CMD ["node", "server.js"]
