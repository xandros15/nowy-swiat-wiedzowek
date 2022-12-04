install:
	docker compose -f ./docker/docker-compose.yml run npm sh -c "npm install --prefix /frontend && npm install --prefix /backend install"

build:
	docker compose -f ./docker/docker-compose.yml run npm sh -c "npm run build --prefix /frontend"

serve:
	docker compose -f ./docker/docker-compose.yml run -p 8080:8080 npm sh -c "npm run serve --prefix /frontend"
