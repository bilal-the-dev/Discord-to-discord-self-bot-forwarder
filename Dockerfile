# Select slim version
FROM node:lts-bookworm-slim

# Put at start to take advantage of caching in images
RUN apt-get update && apt-get install -y --no-install-recommends dumb-init

#  Optimize Node.js tooling for production
ENV NODE_ENV production

# Set the working directory in the container
WORKDIR /usr/src/app


# Create a dummy file to prevent caching of COPY and RUN commands
# Change file attributes to invalidate cache
# This will force Docker to not use cached layers for next commands
RUN touch dummyfile && \
    echo "dummy content" > dummyfile

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# Remove dummy file after npm install
RUN rm dummyfile

# Bundle rest of the source code
COPY . .

# properly forward events to process, npm client with npm start doesnt forward
CMD ["dumb-init", "node", "src/index.js"]