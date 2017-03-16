WeMedia01 (HK) Limited
=============

Offsite Test for Backend


System Requirements
-------

* [Node.js](https://nodejs.org/en/)
* [MongoDB](https://www.mongodb.com/download-center?jmp=nav)
* [Redis](https://redis.io/)


Installation
-----------

Installing Node.js

1. Go to https://nodejs.org and click the Download button. 
2. Download the appropriate installation package depending on your computer operation system (Windows, MacOS or Linux).
3. Execute the installation package.
4. After the installation is finished, you may check if your Node.js is working correctly by opening the Command Prompt and typing the following:
```
node -v
```

Installing MongoDB

1. Go to https://www.mongodb.com/download-center?jmp=nav and select the appropriate version to download.
2. Execute the installation package.
3. MongoDB requires a data directory to store all data. MongoDB’s default data directory path is the absolute path \data\db on the drive from where you start MongoDB. Create this folder by typing the following command in the Command Prompt:
```
md \data\db
```
For example C:\data\db

4. You can specify an alternate path for data files using the --dbpath option to mongod.exe, for example:
```
"<YOUR_MONGODB_PATH>\bin\mongod.exe" --dbpath <YOUR_DATA_FOLDER_PATH>\data
```
For example "C:\Program Files\MongoDB\Server\3.4\bin\mongod.exe" --dbpath C:\data

5. Execute "<YOUR_MONGODB_PATH>\bin\mongo.exe" to open client command prompt.  

6. Create a database "offsite_test" and a collection "Transaction".
```
use offsite_test

db.createCollection("Transaction")
```

Installing Redis

1. Go to https://redis.io/download and download the stable version.
2. For Windows users, please go to https://github.com/MSOpenTech/redis/releases and download the .msi file.
2. Execute the installation package.

Run
-----------

1. Clone the project into your local machine.
2. Run the MongoDB by typing the following command in the Command Prompt:
```
"<YOUR_MONGODB_PATH>\bin\mongod.exe"
```
3. Run the Redis Server by clicking on redis-server.exe.
4. Go to the project folder and type the following command:
```
npm install
npm start
```
5. Open a web browser, and go to "http://localhost:3000".
6. For payment checking, go to "http://localhost:3000/check_payment".

Data Structure
-----------

Transaction Schema:
```
_id: String
customer_name: String
customer_phone_number: String
currency: String
price: String
cc_holder_name: String
cc_number: String
cc_expiration_month: String
cc_expiration_year: String
ccv: String
response_id: String
response_created_time: Date
response_updated_time: Date
response_intent: String
response_status: String
response_gateway: String
created_time: Date
```

Tested Credit Cards
-----------
* American Express : 378734493671000
* MasterCard : 5555555555554444
* Visa : 4111111111111111
