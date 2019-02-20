.PHONY: test

dev:
	docker-compose --file docker-compose-dev.yml up --build

test:
	docker-compose --file docker-compose-test.yml up --abort-on-container-exit --build
	docker-compose down

