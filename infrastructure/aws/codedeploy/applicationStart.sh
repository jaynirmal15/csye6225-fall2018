#!/bin/bash
cd var
pwd
ls -a
echo "#CSYE6225: start application pwd and move into nodeapp dir"
pwd
cd ./webapp/WebApp
echo "PWD AND FILES"
pwd
ls -lrt
pm2 start ./index.js

