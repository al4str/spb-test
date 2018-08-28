#!/bin/bash

rm -rf ./docs/*
cp -r ./src/* ./docs
rm -rf ./docs/styles/*
npx sass --no-source-map -s compressed -c ./docs/scss:./docs/styles
npx postcss ./docs/styles/*.css -u autoprefixer -r --verbose --no-map
rm -rf ./docs/scss
