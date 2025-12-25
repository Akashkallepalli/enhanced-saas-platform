FROM node:20.15-alpine3.19

WORKDIR /app

# Needed to compile bcrypt native bindings
RUN apk add --no-cache python3 make g++

# Copy only package files first
COPY package*.json ./

# Install ALL dependencies (including bcrypt) inside the image
RUN npm install && npm cache clean --force

# Now copy the rest of the app
COPY . .

EXPOSE 5000

CMD ["node", "src/server.js"]
