#!/bin/bash
echo "#CSYE6225: start application pwd and move into nodeapp dir"
pwd
cd /var/myapp/webapp/WebApp
echo "PWD AND FILES"
pwd
ls -lrt
pm2 start index.js

