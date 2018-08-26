#!/bin/bash

if [[ `git status --porcelain --untracked-files=no` ]]; then
	echo "You have uncommitted changes"
else
	rm -rf ./dist/*
	cp -r ./src/* ./dist
	rm -rf ./dist/styles/*
	npx sass --no-source-map -s compressed -c ./dist/scss:./dist/styles
	npx postcss ./dist/styles/*.css -u autoprefixer -r --verbose --no-map
	rm -rf ./dist/scss
	git commit --amend
	git pull
	git push
fi
