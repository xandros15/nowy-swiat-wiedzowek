#!/usr/bin/env make

DOCKER_IMAGE_NAME := docker.animesongs.local:5000/quiz-answer

-include .env
export

start:
	docker compose up -d

build-frontend:
	docker build --target=frontend --tag ${DOCKER_IMAGE_NAME}/frontend:unreleased -f docker/Dockerfile .
