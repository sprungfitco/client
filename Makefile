BINARY_NAME = "sprung-client"

install:
	yarn install && npm rebuild node-sass

lint:
	@PATH="./node_modules/.bin:$$PATH"; \
	eslint web/src

run-server:
	$(MAKE) compile
	./tmp/${BINARY_NAME}

start:
	node server.js &
	./scripts/start.sh
	&& fg

webpack:
	@PATH="./node_modules/.bin:$$PATH"; \
	webpack-dev-server --progress --colors --content-base ./web/public --config ./webpack.config.js

webpack-prod:
	@PATH="./node_modules/.bin:$$PATH"; \
	webpack --progress --colors ./web/public --config ./webpack.prod.config.js
