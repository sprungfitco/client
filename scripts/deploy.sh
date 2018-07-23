#!/bin/bash

echo "Running webpack"
make webpack-prod

cd /var/www
echo "Setting up pm2"
pm2 start server.js
