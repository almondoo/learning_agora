start-up:
	@make build
	@make up

build:
	docker-compose build

up:
	docker-compose up -d

bash:
	docker-compose exec web ash
