# Use an official Node.js runtime as a parent image
FROM node:20 
# Change this to node:16 or higher

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application code
COPY . .

# Expose the port
EXPOSE 3500

# Define the command to run your app
CMD ["npm", "start"]
