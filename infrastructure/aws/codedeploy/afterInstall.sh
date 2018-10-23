#!/bin/bash

# update the permission and ownership of WAR file in the tomcat webapps directory
echo "#CSYE6225: doing after install"
cd /var
pwd
ls -lrt
echo "#CSYE6225: doing after install: remove webapp if already exist"
sudo rm -rf myapp
echo "#CSYE6225: doing after install: make dir myapp"
sudo mkdir -p myapp
pwd
ls -lrt
echo "#CSYE6225: doing after install: move zip to myapp dir"
sudo mv csye6225-fall2018.zip myapp/
cd myapp/
echo "#CSYE6225: doing after install: go in webapp"
pwd
ls -lrt
echo "#CSYE6225: doing after install: unzip nodeapp"
sudo unzip csye6225-fall2018.zip
echo "#CSYE6225: doing after install: remove zip from webapp folder"
sudo rm -rf csye6225-fall2018.zip
echo "#CSYE6225: doing after install: end"
pwd
ls -lrt
cd ..
sudo cp .env myapp/webapp/WebApp
cd myapp/webapp/WebApp
sudo chmod 666 .env
pwd
ls -lrt
cd ../..
pwd
ls -lrt

