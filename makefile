start-up:
	@make build
	@make up

build:
	docker-compose build

up:
	docker-compose up -d

down:
	docker-compose down

bash:
	docker-compose exec web ash

ps:
	docker-compose ps
