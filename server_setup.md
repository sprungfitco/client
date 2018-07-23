# Server config
Server is running NGNX re-routing all 80 port nevigation to 443, all the 443 traffic is proxy passed to the port 5000 which the front end app is running 

There’s a file at /var/www/deploy/hook that is called from the GitHub web hooks action, this file stops the server, pull all the new code, make install and make start all the files using screen. Probably what is happening right now is that my SSH key doesn’t have access to the repo anymore and thats why its unable to continue after stop the service

One thing to notice is that it only gets called with pushes or merges to master

My best guess is you have to create a new SSH key an re-configure that key on the repo, with that everything will start working again, it might be possible you have to start the first time manually, 

# Commands for refreshing code and starting server

- $ cd /var/www/client
- $ sudo git pull
- Enter your git credentials
- $ sudo make install
- $ screen
- $ sudo make start
- $ sudo pm2 restart server.js


sudo above commands if required
In case make start command fails because port 8080 or 5000 are in use, then do the following

- $ sudo pm2 stop server.js
- $ sudo ps ax | grep node
- pid(s) will be listed
- $ sudo kill -9 pid
- $ sudo make start
