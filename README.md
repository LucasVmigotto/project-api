# simple-project-api

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
# Test and collect coverage info
npm test

# Start the test watch mode
npm run test:watch
```
