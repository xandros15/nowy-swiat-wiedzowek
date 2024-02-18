# nowy-swiat-wiedzowek
Projekt dla konwentowego zglaszania odpowiedzi

Aby używać aplikacji, potrzebujecie nodejs, npma lub dockera i make.

Należy dodać plik o nazwie `.env` do bazując na `.env.example`
do folderu `/` uzupełniony o:

```
PORT=2137
OAUTH2_CLIENT=
OAUTH2_SECRET=
OAUTH2_REDIRECT=http://localhost:2137/login
DEBUG=0
```

parametry:

| Nazwa           | Opis                                                                                             |
|:----------------|:-------------------------------------------------------------------------------------------------|
| PORT            | wolny port numeryczny, domyślnie 2137                                                            |
| OAUTH2_CLIENT   | client_id do systemu oauth2 dla operatorów                                                       |
| OAUTH2_SECRET   | client_secret do systemu oauth2 dla operatorów                                                   |
| OAUTH2_REDIRECT | adress na którym będzie stać aplikacja frontendowa zakończony `/login`. Należy pamiętać o porcie |
| DEBUG           | do debugowania                                                                                   |


## docker

Aby zbudować i postawić środowisko należy:

```
make start
```

Następnie wchodzimy pod http://localhost:2137 i mamy postawioną aplikację :)

Aby zbudować jedynie frontend, wystarczy wpisać komendę:

```
make build-frontend
```

Obraz powinien zbudować się pod nazwą domyślną `docker.animesongs.local:5000/quiz-answer/frontend:unreleased `
Jeśli chce się użyć innej nazwy, należy wprowadzić własną do pliku .env pod parametrem `DOCKER_IMAGE_NAME`

```
DOCKER_IMAGE_NAME=jenoty.org:2137/wiedzowka
```

## node

Z uwagi na problemy z instalacją różnych wersji nodejs zaleca się używania dockera do budowania środowiska.

Wpierw kopiujemy plik z uzupełnionymi zmiennymi środowiskowymi (`.env`) do kalatogu z backendem.
Należy dopisać zmienną środowiskową `PORT_BACKEND=3333`, tak by backend mógł zostać uruchomiony pod odpowiednim portem.
Wykonujemy następujące komendy by zainstalowac zależności:

```
cd /frontend
npm install
cd ../backend
npm install
```

Aby uruchomić aplikacje w trybie deweloperskim, należy wykonać następujące komendy:

```
cd /frontend
npm run serve
```
oraz
```
cd /backend
node app.js
```

Aby zbudować frontend aplikacji, należy wykonać komendę:
```
cd /frontend
npm run build
```

## Pominięcie oauth2

Żeby można było się zalogować do panelu zarządzania pokojem w aplikacji z pominięciem oauth2, należy stworzyć plik `rooms.yml` na wzór
`example.rooms.yml` i wstawić go do folderu z aplikacją (w wersji dockerowej w roocie projektu, w wersji node w roocie backendu)

Przykładowy plik `rooms.yml`:
```yaml
- room: animesongs
  key: 'mieczGutsaToBardzoDlugiMiecz'
- room: ławica
  key: 'gdzieJestNemo?'
- room: radioanime24
  key: 'toniejestanime24'
- room: karczma
  key: 'animewasmistake'
- room: kartel
  key: 'shipponiewie'
```

By zalogować się bez sso, należy użyć adresu `/{nazwa_pokoju}/admin` zamiast `/login` 
