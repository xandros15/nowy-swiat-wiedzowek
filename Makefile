#!/usr/bin/env make
DOCKER_IMAGE_NAME := docker.animesongs.local:5000/quiz-answer

-include .env
export

start:
	docker compose up -d

build:
	docker build --target=frontend --tag ${DOCKER_IMAGE_NAME}/frontend:unreleased -f docker/Dockerfile .
	docker build --target=proxy --tag ${DOCKER_IMAGE_NAME}/web:unreleased -f docker/Dockerfile .
	docker build --target=backend --tag ${DOCKER_IMAGE_NAME}/backend:unreleased -f docker/Dockerfile .

save:
	docker save -o frontend.tar ${DOCKER_IMAGE_NAME}/frontend:unreleased
	docker save -o web.tar ${DOCKER_IMAGE_NAME}/web:unreleased
	docker save -o backend.tar ${DOCKER_IMAGE_NAME}/backend:unreleased

build-frontend:
	docker build --target=frontend --tag ${DOCKER_IMAGE_NAME}/frontend:unreleased -f docker/Dockerfile .
