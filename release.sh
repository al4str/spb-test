#!/bin/bash

if [[ `git status --porcelain --untracked-files=no` ]]; then
	echo "You have uncommitted changes"
else
	/bin/bash ./generate.sh
	git commit --amend
	git pull
	git push
fi
