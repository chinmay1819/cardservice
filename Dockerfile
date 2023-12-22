# Use an official Node runtime as a parent image
FROM node:14

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the current directory contents into the container at /usr/src/app
COPY . .

# Expose port 3000
EXPOSE 3000

# Define environment variable for MongoDB connection URI
ENV DB_URI=mongodb://mongo:27017/card-tracking

# Command to run your application
CMD ["npm", "run", "start:prod"]
