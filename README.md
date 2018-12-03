# Feinberg Investments

My submission for TTP Fullstack Application Build.

## Setup

In order to setup, follow these steps:

* Clone the app by running this command:

```
git clone https://github.com/JTFeinberg/TTP-FS-20180728.git
```

* Run `npm install` to install all dependencies.

* Make sure to have PostgreSQL installed and run `createdb feinberg-investments` and 
`createdb feinberg-investments-test`

* Run `npm run seed` to sync databases

* Finally, run `npm run start-dev` and open your browser to http://localhost:8080 to run app.

## Google OAuth

This app uses google authentication. To enable, follow these steps:

* Receive client ID and client secret credentials from https://console.developers.google.com/apis/credentials

* Create a file called `secrets.js` in the project root that looks like so:

  ```
    process.env.GOOGLE_CLIENT_ID = 'client ID credentials'
    process.env.GOOGLE_CLIENT_SECRET = 'client secret credentials'
    process.env.GOOGLE_CALLBACK = '/auth/google/callback'
  ```

* Make sure to NEVER git push secret.js

## Testing

Some tests have been written for this app. To see tests, run `npm test`.

## Future Implementations

These are some ideas that I want to integrate into the app some day:

* Styling

* A setup script

* Users ability to change account information
