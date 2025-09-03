# MoneyLike – Makefile
.PHONY: up down logs api web mobile seed
up: ; docker compose up -d db redis
down: ; docker compose down
logs: ; docker compose logs -f
api: ; cd backend && npm run start:dev
web: ; cd web && npm run dev
mobile: ; cd mobile && npm run start
seed: ; cd backend && npm run seed
