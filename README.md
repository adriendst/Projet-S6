# Projet-S6

ROUBLOT, DESTREMONT, STANCATO, HIPPERT

## Project links:

-   [Enoncé sur Github](https://github.com/adriendst/Projet-S6/blob/main/projetTutore.pdf)
-   [Documentation sur Github](https://github.com/adriendst/Projet-S6/blob/main/Documentation.pdf)
-   [Github](https://github.com/adriendst/Projet-S6/)
-   [Trello](https://trello.com/b/GndgC8xN/projet-tut-s6)
-   [Google Doc](https://docs.google.com/document/d/1S0IetihBVwitLCX3-taJNvmP4AL-9vvyjZV2kDhPdg8/edit#heading=h.vkxgr83ff0xh)
-   [Diapo Google Doc](https://docs.google.com/presentation/d/1s6-4J8xWgdjisUulrizWPVaGDpLK9iu2ZI42S0hkSYs/edit#slide=id.p)
-   [Documentation de l'API en locale](http://localhost:9090/doc/)
-   [Page react en locale](http://localhost:3000/)
-   [GitHub Types](https://github.com/yannHippert/LP-Steam-Wiki-Types)
-   [npm Types](https://www.npmjs.com/package/@steam-wiki/types)

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

## Types package

### Check the version:

```sh
npm list @steam-wiki/types
```
