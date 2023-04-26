server: install
	pm2 delete todocalendar
	pm2 serve ./build 3000 --name "todocalendar" --spa

install:
	npm install -g yarn
	npm install -g pm2
	yarn
	yarn run build