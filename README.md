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
