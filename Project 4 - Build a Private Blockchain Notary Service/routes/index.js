var express = require('express');
var router = express.Router();
var bitcoinMessage = require('bitcoinjs-message');
const { Block, Blockchain } = require('../simpleChain');

const mempool = {};
const timeoutRequests = [];
const mempoolValid = {};

function removeValidationRequest(address) {
    delete mempool[address];
}

function validateRequestByWallet(message, address, signature) {
    return bitcoinMessage.verify(message, address, signature);
}

function hex2ascii(hexx) {
    var hex = hexx.toString();//force conversion
    var str = '';
    for (var i = 0; (i < hex.length && hex.substr(i, 2) !== '00'); i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
}

/* GET home page. */
router.post('/requestValidation', function(req, res, next) {
    try {
        const address = req.body.address;
        if (address.length !== 0) {
            let returnObject = {};
            const timeoutRequestsWindowTime = 5 * 60 * 1000;
            let time = new Date().getTime().toString().slice(0, -3);

            returnObject.walletAddress = address;
            try {
                let timeElapse = time - mempool[address].requestTimeStamp;
                returnObject.validationWindow = (timeoutRequestsWindowTime / 1000) - timeElapse;
                returnObject.requestTimeStamp = mempool[address].requestTimeStamp;
                returnObject.message = address.toString() + ":" + mempool[address].requestTimeStamp + ":starRegistry";
            } catch (e) {
                returnObject.requestTimeStamp = time.toString();
                returnObject.message = address.toString() + ":" + time.toString() + ":starRegistry";
                returnObject.validationWindow = (timeoutRequestsWindowTime / 1000);
                mempool[address] = returnObject;
            }

            timeoutRequests[address] = setTimeout(function () {
                removeValidationRequest(address)
            }, timeoutRequestsWindowTime);
            res.send(returnObject)
        } else {
            res.send({"error":"Error"})
        }
    } catch (e) {
        res.send({"error":"Error"})
    }
});

router.post('/message-signature/validate', function(req, res, next) {
    try {
        const address = req.body.address;
        const signature = req.body.signature;
        let returnObject = {};
        const messageSignature = validateRequestByWallet(mempool[address].message, address, signature);

        returnObject.registerStar = messageSignature;
        const timeoutRequestsWindowTime = 5 * 60 * 1000;
        let time = new Date().getTime().toString().slice(0, -3);
        let timeElapse = time - mempool[address].requestTimeStamp;
        returnObject.status = {
            "address": address,
            "requestTimeStamp": mempool[address].requestTimeStamp,
            "message": mempool[address].message,
            "validationWindow": (timeoutRequestsWindowTime / 1000) - timeElapse,
            "messageSignature": messageSignature
        };

        if (messageSignature) {
            mempoolValid[address] = returnObject;
        }
        res.send(returnObject);
    } catch (e) {
        res.send({"error": "Error"});
    }
});

router.post('/block', async (req, res, next) => {
    try {
        let bc = new Blockchain();
        let dataObject = req.body;
        const story = dataObject.star.story;
        const valid = mempoolValid[dataObject.address];
        if (valid) {
            dataObject.star.story = Buffer(story).toString('hex');
            let block = new Block(dataObject);
            await bc.addBlock(block);
            let returnObject = await bc.getBlock(await bc.getBlockHeight() + 1);
            delete mempoolValid[dataObject.address];
            res.send(returnObject);
        }
    } catch(e) {
        res.send({"error": "ERROR"});
    }
});

router.get('/block/:height', async (req, res, next) => {
    try {
        let bc = new Blockchain();
        let returnObject = {};
        bc = await bc.getBlock(req.params.height);
        returnObject.hash = bc.hash;
        returnObject.height = bc.height;
        returnObject.time = bc.time;
        returnObject.previousBlockHash = bc.previousBlockHash;
        returnObject.body = bc.body;
        returnObject.body.star.storyDecoded = hex2ascii(returnObject.body.star.story);

        res.send(returnObject);
    } catch (e) {
        res.send({"error": "ERROR"})
    }
});

router.get('/stars/hash:hash', async (req, res, next) => {
    try {
        let bc = new Blockchain();
        let returnObject = {};
        bc = await bc.getBlockByHash(req.params.hash.slice(1));
        returnObject.hash = bc.hash;
        returnObject.height = bc.height;
        returnObject.time = bc.time;
        returnObject.previousBlockHash = bc.previousBlockHash;
        returnObject.body = bc.body;
        returnObject.body.star.storyDecoded = hex2ascii(returnObject.body.star.story);
        res.send(returnObject);
    } catch (e) {
        res.send({"error": "ERROR"})
    }
});

router.get('/stars/address:address', async (req, res, next) => {
    try {
        let bc = new Blockchain();
        let returnObjectArray;
        returnObjectArray = await bc.getBlockByAddress(req.params.address.slice(1));
        for (const i in returnObjectArray) {
            let block = JSON.parse(returnObjectArray[i]);
            block.body.star.storyDecoded = hex2ascii(block.body.star.story);
            returnObjectArray[i] = block;
        }
        res.send(returnObjectArray);
    } catch (e) {
        res.send({"error": "ERROR"})
    }
});

module.exports = router;
