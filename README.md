# Flamingo

<p align="center">
  <img src="https://i.imgur.com/YFTFKzP.png" alt="Flamingo"/>
</p>

## A configuration UI for promotional campaigns.

---
---

## Getting Started
This is a Hyraco service serving a React app.

The backend application will both serve any static files put in the `resources/static` folder as well as route API requests to correct service.

To run the backend, either open IntelliJ and go to `Application.kt` and click start, or open a terminal and run:
```bash
/platform-flamingo > $ mvn clean compile exec:java
```

The backend is hosted locally on [http://localhost:8080/flamingo](http://localhost:8080/flamingo)

If you're working on the frontend you need to run that separately.\
Open a second terminal and run:
```bash
/platform-flamingo > $ cd src/main/javascript
/platform-flamingo/src/main/javascript > $ yarn start
```

Open [http://localhost:3000](http://localhost:3000) to see the result. It uses the backend service for the `/api` routes, so the backend needs to be running in the background for the frontend to work.\
Login with your regular BO credentials.

---

## Production builds

To trigger a production build:
```bash
/platform-flamingo/src/main/javascript > $ yarn build
/platform-flamingo > $ mvn clean compile
```

To run the production build locally, just do:
```bash
/platform-flamingo > $ mvn exec:java
```

---

## What API's does it use?

For the authentication part it's using `bo-integration`.\
The campaign scheduling part is using `optimove-integration`.

The frontend does not connect to any other service directly, it uses proxy endpoints set up in the backend application. All api-calls have a proxy endpoint.

---

## Frontend guidelines

Every route has it's own folder in [/pages](/src/main/javascript/src/pages). Any component specific for that page should reside in that folder.\
Components used in multiple pages should reside in [/components](/src/main/javascript/src/components). They should try to be simple and functionally pure.\
When you feel your component is getting messy with too much logic, try to move code to a utils file. See [/utils](/src/main/javascript/src/utils). Create one file per `page`. Utils functions used in multiple pages should be put in [utils/common.js](/src/main/javascript/src/utils/common.js)
