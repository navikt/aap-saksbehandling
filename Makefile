.PHONY: all build test

all: build test

build:
	yarn build &

test:
	yarn test &

wait:
	wait

all: build test wait