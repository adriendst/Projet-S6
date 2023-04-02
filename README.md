# Projet-S6

ROUBLOT, DESTREMONT, STANCATO, HIPPERT

## Project links:

-   [Enoncé sut Github](https://github.com/adriendst/Projet-S6/blob/main/projetTutore.pdf)
-   [Github](https://github.com/adriendst/Projet-S6/)
-   [Trello](https://trello.com/b/GndgC8xN/projet-tut-s6)
-   [Google Doc](https://docs.google.com/presentation/d/1s6-4J8xWgdjisUulrizWPVaGDpLK9iu2ZI42S0hkSYs/edit#slide=id.p)
-   [Documentation de l'API en locale](http://localhost:9090/doc/)
-   [Page react en locale](http://localhost:3000/)

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
