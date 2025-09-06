#Here we will use node as the base image.
FROM node:16.13.1

#create a working directory inside the container.
WORKDIR /app

# Copy app dependencies to container
COPY ./package*.json ./

# Add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

COPY . .

# Install dependencies
RUN npm install --force

EXPOSE 3005

# Deploy app for local development
CMD ["npm", "start"]