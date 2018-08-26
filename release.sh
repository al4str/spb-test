#!/bin/bash

#for filename in "$@"; do
#done
npx sass --no-source-map -s compressed -c ./src/scss:./dist/styles
npx postcss ./dist/styles/*.css -u autoprefixer -r --verbose --no-map
