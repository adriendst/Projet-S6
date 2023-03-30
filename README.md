# Projet-S6

Projet S6 l

## Start the containers:

In the root of the folder `*/Projet-S6`

```sh
docker compose -f ./backend/docker/docker-compose.yaml start
```

to start the elasticsearch server.

You can check if it worked by going to the following url: http://localhost:5601/app/dev_tools#/console

## Start the backend server

In the `*/Projet-S6/backend` folder (`cd ./backend/`)

```sh
npm run dev
```

to start the development server: If the server started successfully, the documentation for the API should be accessible under: http://localhost:9090/doc
