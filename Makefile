run: docker-up migrate
	@echo Visit http://localhost:9090 to add bucket policy for readonly anonymous/public access.
	@echo Add the following line below to your /etc/hosts file.
	@echo "127.0.0.1  s3"

docker-up:
	docker compose up -d

migrate:
	docker compose exec app php artisan migrate --force