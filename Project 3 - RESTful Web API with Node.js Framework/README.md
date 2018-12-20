> NodeJs Framework -> **Express.js**

    npm install
    npm install level
    npm install crypto-js

 
 - Run the **app.js** to start the server
   
 - Path: http://localhost:8000

***Request:***

> GET BLOCK DATA

    curl -X GET \
      http://localhost:8000/block/0 \
      -H 'Postman-Token: 5c62db36-9c47-479c-a856-384314152356' \
      -H 'cache-control: no-cache'

**Change the '0' in '/block/0' with the block number**

***Response:***
*if block is found without error:*

    {
        "hash": "8e1f4708f94e748461ffa4d2ab6080611df7eb50b25aed61b2f9cb5f748bc966",
        "height": 0,
        "body": "First block in the chain - Genesis block",
        "time": "1545534741",
        "previousBlockHash": ""
    }
*if there is some error*

    {
    "error": "ERROR"
    }


***Request:***

> POST NEW BLOCK

    curl -X POST \
      http://localhost:8000/block \
      -H 'Content-Type: application/json' \
      -H 'Postman-Token: 434cb2f4-f008-4e36-b341-4c0b6e134f3e' \
      -H 'cache-control: no-cache' \
      -d '{
          "body": "Testing block with test string data"
    }'

**Change the 'body' with a string of data, don't forget to add the header:** *Content-Type: application/json*

***Response:***
*if block is added without error:*

    {
    "hash": "e502f05e14f72953e5d41d374c7256a2d8969164a88e759b78d20a3760846ada",
    "height": 2,
    "body": "Testing block with test string data",
    "time": "1545535055",
    "previousBlockHash": "ae5aa5975fda461317d8318f2aab8e60c2de14ef39c8430470a2fdf147d36587"
    }
*if there is some error*

    {
    "error": "ERROR"
    }

