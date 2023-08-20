server:
	yarn build
	pm2 delete todocalendar || true
	pm2 serve ./build 3000 --name "todocalendar" --spa

dev:
	yarn start

install:
	npm install -g yarn
	npm install -g pm2
	yarn
	yarn build