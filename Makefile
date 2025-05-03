# Переменные
COMPOSE          := docker compose
DCFILE           := -f docker-compose.yml
WEB_SERVICE      := web
DB_SERVICE       := db
DB_USER          := user
DB_NAME          := mydb
# Для подключения к БД внутри контейнера
PSQL_CMD         := psql -U $(DB_USER) -d $(DB_NAME)

.PHONY: help build up down restart logs ps web-shell db-shell clean

help:  ## Показать список доступных команд
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' Makefile | awk 'BEGIN {FS=":.*?##"; printf "\nДоступные команды:\n"} {printf "  %-15s %s\n", $$1, $$2}'

build:  ## Собрать образы всех сервисов
	$(COMPOSE) $(DCFILE) build

up:  ## Запустить контейнеры в фоне
	$(COMPOSE) $(DCFILE) up -d

down:  ## Остановить и удалить контейнеры (но не тома)
	$(COMPOSE) $(DCFILE) down

restart: down up  ## Перезапустить сервисы

logs:  ## Смотреть логи всех сервисов
	$(COMPOSE) $(DCFILE) logs -f

ps:  ## Показать статус контейнеров
	$(COMPOSE) $(DCFILE) ps

web-shell:  ## Открыть bash в web-контейнере
	$(COMPOSE) $(DCFILE) exec $(WEB_SERVICE) bash

db-shell:  ## Открыть psql в контейнере БД
	$(COMPOSE) $(DCFILE) exec $(DB_SERVICE) $(PSQL_CMD)

clean:  ## Остановить и удалить контейнеры, сети и тома
	$(COMPOSE) $(DCFILE) down -v --rmi all --remove-orphans
