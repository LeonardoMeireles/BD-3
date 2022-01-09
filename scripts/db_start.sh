source .env*
sudo -E docker run -e POSTGRES_PASSWORD=$POSTGRES_PASSWORD -p 5432:5432 --name trava-air-db-container trava-air-db