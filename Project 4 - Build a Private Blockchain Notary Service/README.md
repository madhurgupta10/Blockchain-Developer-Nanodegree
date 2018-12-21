> NodeJs Framework -> **Express.js**

    npm install
    npm install level
    npm install crypto-js

 
 - Run the **app.js** to start the server
   
 - Path: http://localhost:8000

***Request:***

> POST Blockchain ID Validation Request

    curl -X POST \
        http://localhost:8000/requestValidation \
        -H 'Postman-Token: 780792dd-8e52-461d-9282-7b1f933b9c25' \
        -H 'cache-control: no-cache' \
        -d '{ "address":"19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL" }'

**don't forget to add the header:** *Content-Type: application/json*

***Response:***
```
    {
        "walletAddress": "19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL",
        "requestTimeStamp": "1544451269",
        "message": "19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL:1544451269:starRegistry",
        "validationWindow": 300
    }
```

***Request:***

> POST Blockchain ID Message Signature Validation

    curl -X POST \
        http://localhost:8000/message-signature/validate \
        -H 'Postman-Token: 3dcbd0fc-d4c2-4774-8459-37d0e1b96112' \
        -H 'cache-control: no-cache' \
        -d '{
            "address":"19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL",
            "signature":"H8K4+1MvyJo9tcr2YN2KejwvX1oqneyCH+fsUL1z1WBdWmswB9bijeFfOfMqK68kQ5RO6ZxhomoXQG3fkLaBl+Q=" }'

**Verify that the time window of 5 minutes didn't expired. Don't forget to add the header:** *Content-Type: application/json*

***Response:***
```
    {
        "registerStar": true,
        "status": {
            "address": "19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL",
            "requestTimeStamp": "1544454641",
            "message": "19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL:1544454641:starRegistry",
            "validationWindow": 193,
            "messageSignature": true
        }
    }
```

***Request:***

> POST Star Registration
```
    curl -X POST \
        http://localhost:8000/block \
        -H 'Postman-Token: b42d319b-b664-4b88-acdb-6c15fd5877ed' \
        -H 'cache-control: no-cache' \
        -d '{
            "address": "19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL",
        "star": {
                "dec": "68° 52'\'' 56.9",
                "ra": "16h 29m 1.0s",
                "story": "Found star using https://www.google.com/sky/"
            }
        }'
```

**The Star object and properties are stored within the body of the block of your Blockchain Dataset. Verify that the "address" that send the Star was validated in the previous steps, if not respond back with an error. The response will look like. Don't forget to add the header:** *Content-Type: application/json*

***Response:***
```
    {
        "hash": "8098c1d7f44f4513ba1e7e8ba9965e013520e3652e2db5a7d88e51d7b99c3cc8",
        "height": 1,
        "body": {
            "address": "19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL",
            "star": {
                "ra": "16h 29m 1.0s",
                "dec": "68° 52' 56.9",
            "story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f"
        }
    },
        "time": "1544455399",
        "previousBlockHash": "639f8e4c4519759f489fc7da607054f50b212b7d8171e7717df244da2f7f2394"
    }
```

***Request:***

> GET Get Star by Hash
```
    curl -X GET \
    'http://localhost:8000/stars/hash:[HASH]' \
    -H 'Postman-Token: 4284d300-53a3-42d1-9bb9-51334437818c' \
    -H 'cache-control: no-cache'
```

**Don't forget to add the header:** *Content-Type: application/json*

***Response:***
```
    {
        "hash": "a59e9e399bc17c2db32a7a87379a8012f2c8e08dd661d7c0a6a4845d4f3ffb9f",
        "height": 1,
        "body": {
        "address": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ",
        "star": {
            "ra": "16h 29m 1.0s",
            "dec": "-26° 29' 24.9",
            "story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f",
            "storyDecoded": "Found star using https://www.google.com/sky/"
            }
        },
        "time": "1532296234",
        "previousBlockHash": "49cce61ec3e6ae664514d5fa5722d86069cf981318fc303750ce66032d0acff3"
    }
```

***Request:***

> GET Get Star by Address
```
    curl -X GET \
    'http://localhost:8000/stars/address:[ADDRESS]' \
    -H 'Postman-Token: 4284d300-53a3-42d1-9bb9-51334437818c' \
    -H 'cache-control: no-cache'
```

**Don't forget to add the header:** *Content-Type: application/json*

***Response:***
```
[
  {
    "hash": "a59e9e399bc17c2db32a7a87379a8012f2c8e08dd661d7c0a6a4845d4f3ffb9f",
    "height": 1,
    "body": {
      "address": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ",
      "star": {
        "ra": "16h 29m 1.0s",
        "dec": "-26° 29' 24.9",
        "story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f",
        "storyDecoded": "Found star using https://www.google.com/sky/"
      }
    },
    "time": "1532296234",
    "previousBlockHash": "49cce61ec3e6ae664514d5fa5722d86069cf981318fc303750ce66032d0acff3"
  },
  {
    "hash": "6ef99fc533b9725bf194c18bdf79065d64a971fa41b25f098ff4dff29ee531d0",
    "height": 2,
    "body": {
      "address": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ",
      "star": {
        "ra": "17h 22m 13.1s",
        "dec": "-27° 14' 8.2",
        "story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f",
        "storyDecoded": "Found star using https://www.google.com/sky/"
      }
    },
    "time": "1532330848",
    "previousBlockHash": "a59e9e399bc17c2db32a7a87379a8012f2c8e08dd661d7c0a6a4845d4f3ffb9f"
  }
]
```

***Request:***

> GET Get Star by Height
```
    curl -X GET \
    'http://localhost:8000/block/[HEIGHT]' \
    -H 'Postman-Token: 4284d300-53a3-42d1-9bb9-51334437818c' \
    -H 'cache-control: no-cache'
```

**Don't forget to add the header:** *Content-Type: application/json*

***Response:***
```
{
    "hash": "a59e9e399bc17c2db32a7a87379a8012f2c8e08dd661d7c0a6a4845d4f3ffb9f",
    "height": 1,
    "body": {
        "address": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ",
        "star": {
            "ra": "16h 29m 1.0s",
            "dec": "-26° 29' 24.9",
            "story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f",
            "storyDecoded": "Found star using https://www.google.com/sky/"
        }
    },
    "time": "1532296234",
    "previousBlockHash": "49cce61ec3e6ae664514d5fa5722d86069cf981318fc303750ce66032d0acff3"
}
```
