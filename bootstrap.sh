#!/usr/bin/env bash

apt-get update
apt-get install -y nodejs npm

ln -s /usr/bin/nodejs /usr/bin/node

npm install npm -g