#!/bin/zsh
# build updated files
sudo npm run build
# copy update files to folder
cp dist/bundle.js ../toolbox/src/main/webapp/js
cp dist/vendors.js ../toolbox/src/main/webapp/js
cp dist/style.css ../toolbox/src/main/webapp/css
# package new application
cd ../toolbox
mvn clean package -Dmaven.test.skip
# upload war to server
cd target
scp toolbox-$1.war root@toolbox:/root/toolbox/toolbox.war
