# server-triple-h

Server for Triple-H travel-social-network

## Quick start

1. Install Nodejs (skip if you already installled):

   You can install Nodejs for your device follow by [link](https://nodejs.org/en/download/)

2. Install nodemon (skip if you already installed):

   Install global:

   ```bash
   npm i -g nodemon
   ```

   Install dependency:

   ```bash
   npm i nodemon
   ```

3. Install npm package for project:

   ```bash
   cd /path/to/dir
   npm i

   ```

4. Add `.env` file:

   ```
   PORT=
   MONGO_URL=
   ACTIVATION_TOKEN_SECRET=
   ACCESS_TOKEN_SECRET=
   REFRESH_TOKEN_SECRET=
   CLIENT_URL=
   MAILING_SERVICE_CLIENT_ID=
   MAILING_SERVICE_CLIENT_SECRET=
   MAILING_SERVICE_REFRESH_TOKEN=
   SENDER_EMAIL_ADDRESS=
   RECOMBEE_DB=
   RECOMBEE_TOKEN=
   ```

5. Run project:
   ```
   npm start
   ```
