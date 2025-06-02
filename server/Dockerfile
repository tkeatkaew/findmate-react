FROM --platform=linux/amd64 node:22-alpine3.16 as base

WORKDIR /runner

COPY ./package.json /app/builder/package.json
COPY ./pnpm-lock.yaml /app/builder/package-lock.json

# Install dependencies
RUN npm install
# Copy all content
COPY . .
# Expose port
EXPOSE 3000

# CMD
CMD [ "node", "./dist/app"]