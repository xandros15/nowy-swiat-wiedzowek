# nowy-swiat-wiedzowek
Projekt dla konwentowego zglaszania odpowiedzi

Aby używać aplikacji potrzebujecie nodejs, npma lub dockera i make.


Należy dodać plik o nazwie `.env`

Do folderu `/backend` uzupełniony o:

```
PORT=3333
OAUTH2_CLIENT=
OAUTH2_SECRET=
OAUTH2_REDIRECT=http://localhost:8080/login
DEBUG=0
```

parametry:

|Nazwa           | Opis     |
|:---------------|:---------|
|PORT            | wolny port numeryczny, defaultowo 33333 |
|OAUTH2_CLIENT   | client_id do systemu oauth2 dla operatorów |
|OAUTH2_SECRET   | client_secret do systemu oauth2 dla operatorów |
|OAUTH2_REDIRECT | adress na którym będzie stać aplikacja frontendowa zakończony `/login`. Należy pamiętać o porcie |
|DEBUG           | do debugowania |


## docker

Aby zbudować środowisko należy:

```
make install
```

Aby uruchomić należy:

```
make serve
```

wtedy wchodzimy pod http://localhost:8080 i mamy postawioną apke :)


## node

Aby zbudować środowisko należy:

```
cd /frontend
npm install
cd ../backend
npm install
```

Aby uruchomić należy:

```
cd /frontend
npm run serve
```
 oraz
```
cd /backend
node app.js
```
