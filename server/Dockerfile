FROM --platform=linux/amd64 node:22-alpine as base

WORKDIR /runner

COPY ./package.json /runner/package.json
COPY ./package-lock.json /runner/package-lock.json

# Install dependencies
RUN npm install
# Copy all content
COPY . .
# Expose port
EXPOSE 3000

# CMD
CMD [ "node", "./runner/server.js"]