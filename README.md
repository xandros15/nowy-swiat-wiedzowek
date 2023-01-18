# nowy-swiat-wiedzowek
Projekt dla konwentowego zglaszania odpowiedzi

Aby używać aplikacji potrzebujecie nodejs, npma lub dockera i make.

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
+
```
cd /backend
node app.js
```
