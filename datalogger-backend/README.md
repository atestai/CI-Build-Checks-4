1-Execute the commando :npm i

2-Create .env file from .env.example file

3-Access the config.js file and enter the path to the .env file inside dotenv.config

4-Access the config.js file and set the migration directory on the database object 

4-Access the config.js file enter the ip address of the virtual machine on host within the redis object.

5-Access the config.js file enter the ip address of the virtual machine instead of localhost on the mongo object

6-Access the datalogger database and modify the targetAmsNetId and targetAdsPort fields, inserting the correct addresses of TwinCAT. Additionally, update the host field that refers to the Mosquitto address, inserting the IP of the virtual machine.

7-Run the command “nodemon index.js” to start the core.

8-Run the command “ nodemon api.js ” to start the api.