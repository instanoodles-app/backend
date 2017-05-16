![Build](https://api.travis-ci.org/instanoodles-app/backend.svg?branch=master)

# Instanoodles backend

Backend for instanoodles. Created with Node.js, Express and a bunch of middleware.

## Setting up

1. Set up a postgreSQL database.
2. Define the required environment variables:
    - `DB_NAME`(name of the databse)
    - `DB_USERNAME`
    - `DB_PASSWORD`
    - `DB_HOST` (default is localhost)
3. Run `npm install` to install all required dependencies.
4. You'll also need an AWS account for S3 and cloudfront.
5. Define these environment variables for the CDN
    - S3_BUCKET
    - AWS\_ACCESS_KEY
    - AWS\_ACCESS_SECRET
5. To start the server, run `npm start`.

## Links

[Documentation](/docs/docs_root.md)