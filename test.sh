#!/bin/zsh
# build updated files
npm run build
# copy update files to folder
cp dist/bundle.js ../toolbox/src/main/webapp/js
cp dist/vendors.js ../toolbox/src/main/webapp/js
cp dist/style.css ../toolbox/src/main/webapp/css
