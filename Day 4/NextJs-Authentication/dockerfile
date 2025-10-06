FROM node:alpine

WORKDIR /authentication

# Copy only the package.json and package-lock.json files to leverage Docker's build cache
COPY package*.json ./

# Install project dependencies
RUN npm install

COPY  . .

EXPOSE 3000

CMD [ "npm", "run", "dev" ]