#!/bin/sh
echo "Starting project-phosphorus development enviroment..."

# MongoDB Server
echo "...MongoDB Server"
sudo systemctl start mongod.service

# Node Express API
echo "...Backend API"
cd /home/steven/workspace/project-phosphorus-api
git pull origin master
npm start

