# UI

Angular 22 front end for the template, built with PrimeNG 22 (Aura preset), PrimeFlex and ngx-translate. Use Node.js 22.22.3+, 24.15+ or 26 (current LTS), as required by Angular CLI 22.

## Setup

Run `npm ci` to install the dependencies from `package-lock.json`.

## Development server

Run `npm start` (`ng serve`) and open `http://localhost:4200/`. The development configuration uses `src/environments/environment.development.ts`, and the application reloads when a source file changes.

## Build

Run `npm run build -- --configuration=production` for a production build, or `npm run build -- --configuration=development` for a development build. The output goes to `dist/ui/browser`.

## Unit tests

Run `npm test` to run the unit tests once with [Vitest](https://vitest.dev) through the Angular `@angular/build:unit-test` builder (jsdom, no browser needed). Run `npm run test:watch` to re-run the tests on every change.

## PrimeNG license

PrimeNG 22 is distributed under the PrimeUI License (https://primeui.dev/licenses), not MIT. Without a license key the page shows an "Invalid PrimeUI License" notice. Put the key in `PRIMEUI_LICENSE` in `src/environments/environment.ts` and `environment.development.ts`.

## Docker

The `Dockerfile` builds the production configuration on `node:26-alpine` and serves `dist/ui/browser` with `nginx:stable-alpine`. The production API URL is `http://localhost:8000/api/`, which matches the port mapping in the root `docker-compose.yaml`.
