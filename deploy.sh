#!/bin/sh

set -e

cd /var/www/flight360-ai-backend

echo "Pulling latest code..."

git fetch origin
git reset --hard origin/main

echo "Building backend..."

docker compose build backend

echo "Starting backend..."

docker compose up -d backend

echo "Cleaning old images..."

docker image prune -f

echo "Checking containers..."

docker compose ps

echo "Backend deployment successful."