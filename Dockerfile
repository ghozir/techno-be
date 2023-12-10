FROM telkomindonesia/alpine:nodejs-14

# Install Node Modules Based on Node Packages Requirement
RUN apk add --update --no-cache --virtual .build-dev build-base python3 python3-dev
RUN npm i -g npm@6 node-gyp pm2

# Set Working Directory
WORKDIR /usr/src/app

# Create PM2 Drectory and Fix Permission
RUN mkdir /.pm2
RUN chmod -R 775 /.pm2

# Copy Node Packages Requirement
COPY package*.json ./

# Install Project Dependencies and Remove Unused Modules
RUN npm i
RUN apk del .build-dev

# Copy Node Source Code File
COPY . .

# Expose Application Port
EXPOSE 9000

# Run the Application
CMD ["pm2-runtime", "ecosystem.config.js"]
