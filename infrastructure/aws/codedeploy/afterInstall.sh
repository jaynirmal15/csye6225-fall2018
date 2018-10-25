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
echo "#CSYE6225: doing after install: go in webapp"
pwd
ls -lrt
pwd
ls -lrt
cd ..
sudo cp var/.env var/webapp/WebApp
cd myapp/webapp/WebApp
sudo chmod 666 .env
pwd
ls -lrt
cd ../..
pwd
ls -lrt

