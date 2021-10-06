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

To run the backend, either open IntelliJ and go to `Application.kt` and click start, or open a terminal to build frontend into `src/main/resources/static` folder and run application using oneliner maven command from project root:
```bash
/platform-flamingo > $ mvn clean spring-boot:run -DskipTests
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
/platform-flamingo > $ mvn clean package
```

To trigger build with asciidoctor documentation, use `build-docs` maven profile:
```bash
/platform-flamingo > $ mvn clean package -P build-docs
```

To check REST API Documentation run:

```bash
npx serve target/docs
```

If you want to package production build including generated REST API Documentation located inside executable jar file, use both `build-docs` and `include-docs` profiles:
```bash
/platform-flamingo > $ mvn clean package -P build-docs,include-docs
```

NOTE: After flamingo server starts, documentation should be accessible on `/docs/` or `/docs/index.pdf` paths with running backend or can be manually served just like so:

```bash
npx serve target/classes/static/docs/
```

To run the production build locally use command:
```bash
/platform-flamingo > $ mvn spring-boot:run -DskipTests
```

Once NPM modules has been cached we could skip `yarn install` step to just build UI with `yarn build` command:

```bash
/platform-flamingo > $ mvn spring-boot:run -DskipTests -DskipYarnInstall
```

If frontend has been already build and source codes hasn't been changed we could simply skip all yarn steps:

```bash
/platform-flamingo > $ mvn spring-boot:run -DskipTests -DskipYarnInstall -DskipYarn
```

---

## What API's does it use?

For the authentication part it's using `bo-integration`.
The campaign scheduling part is using `optimove-integration`.
Affiliates are managed by `Platform-Aux-Affiliate` module. See documentation for details.

The frontend does not connect to any other service directly, it uses proxy endpoints set up in the backend application. All api-calls have a proxy endpoint.

## Development

### Non released versions usage

Very often we are developing using non released snapshots versions...
To make sure snapshot has been fetch downloaded and used, run maven
commands like so:

```bash
mvn -U validate...
```

This will download any new snapshot versions from Nexus

### Check production build.

To make sure that production build contains everything you need,
use these commands:

```bash
rm -rf target src/main/resources/static src/main/javascript/build src/main/javascript/node_modules
mvn clean verify -DskipTests
unzip -d target/content target/platform-flamingo-0.0.1-SNAPSHOT.jar
```

---

## Frontend guidelines

Every route has it's own folder in [/pages](/src/main/javascript/src/pages). Any component specific for that page should reside in that folder.\
Components used in multiple pages should reside in [/components](/src/main/javascript/src/components). They should try to be simple and functionally pure.\
When you feel your component is getting messy with too much logic, try to move code to a utils file. See [/utils](/src/main/javascript/src/utils). Create one file per `page`. Utils functions used in multiple pages should be put in [utils/common.js](/src/main/javascript/src/utils/common.js).
Shared types or interfaces should be in [/types](/src/main/javascript/src/types/index.js).
