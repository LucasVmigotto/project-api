<div align="center">
  <h1>simple-project-api</h1>
  <a href="https://travis-ci.org/LucasVmigotto/simple-project-api">
    <img alt="build" src="https://travis-ci.org/LucasVmigotto/simple-project-api.svg?branch=master">
  </a>
</div>

A simple project

## Development

Rename `.env.example` to `.env` and change variables if necessary

Prepare the environment

```bash
docker-compose run --rm api bash
npm install
npm run migrate:dev
exit
```

Start the service

```bash
docker-compose up api
```

PostgreSQL

```bash
docker-compose run --rm pgcli
```

## Testing

This API uses [Jest](https://goo.gl/oqnE3P) lb to perform unit tests.

```bash
# Test
npm test

# Test verbose mode
npm run test:verbose

# Test and collect coverage info
npm run test:coverage

# Start the test watch mode
npm run test:watch
```
