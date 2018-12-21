/* ===== SHA256 with Crypto-js ===============================
|  Learn more: Crypto-js: https://github.com/brix/crypto-js  |
|  =========================================================*/

const SHA256 = require('crypto-js/sha256');
const level = require('level');
const chainDB = './chaindata';
const db = level(chainDB);


/* ===== Block Class ==============================
|  Class with a constructor for block 			   |
|  ===============================================*/

class Block {
    constructor(data) {
        this.hash = "",
            this.height = 0,
            this.body = data,
            this.time = 0,
            this.previousBlockHash = ""
    }
}

/* ===== Blockchain Class ==========================
|  Class with a constructor for new blockchain 		|
|  ================================================*/

class Blockchain {
    constructor() {
        this.addGenesis();
    }

    //Add Genesis
    async addGenesis() {
        let height = await this.getBlockHeight();
        if (height < 0) {
            this.addBlock(new Block("First block in the chain - Genesis block"));
        }
    }

    // Add new block
    async addBlock(newBlock) {
        // Block height
        let height = await this.getBlockHeight();
        newBlock.height =  height + 1;
        // UTC timestamp
        newBlock.time = new Date().getTime().toString().slice(0, -3);
        // previous block hash
        if (newBlock.height > 0) {
            const result = await this.getBlock(height);
            newBlock.previousBlockHash = result.hash;
        }
        // Block hash with SHA256 using newBlock and converting to a string
        newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
        // Adding block object to chain
        console.log(newBlock);
        this.addLevelDBData(newBlock.height, JSON.stringify(newBlock))
    }

    // Get block height
    async getBlockHeight() {
        return await this.getHeightFromDB();
    }

    // get block
    async getBlock(blockHeight) {
        // return object as a single string
        return await JSON.parse(await this.getLevelDBData(blockHeight));
    }

    async getBlockByHash(blockHash) {
        return await JSON.parse(await this.getLevelDBDataByKey(blockHash));
    }

    async getBlockByAddress(address) {
        return await (await this.getLevelDBDataByAdd(address));
    }

    // validate block
    async validateBlock(blockHeight) {
        // get block object
        let block = await this.getBlock(blockHeight);
        // get block hash
        let blockHash = block.hash;
        // remove block hash to test block integrity
        block.hash = '';
        // generate block hash
        let validBlockHash = SHA256(JSON.stringify(block)).toString();
        // Compare
        if (blockHash === validBlockHash) {
            return true;
        } else {
            console.log('Block #' + blockHeight + ' invalid hash:\n' + blockHash + '<>' + validBlockHash);
            return false;
        }
    }

    // Validate blockchain
    async validateChain() {
        let errorLog = [];
        for (let i = 0; i < await this.getBlockHeight(); i++) {
            // validate block
            let validateBlock = await this.validateBlock(i);
            if (!validateBlock) errorLog.push(i);
            // compare blocks hash link
            let blockHash = await this.getBlock(i).hash;
            let previousHash = await this.getBlock(i+1).previousBlockHash;
            if (blockHash !== previousHash) {
                errorLog.push(i);
            }
        }
        if (errorLog.length > 0) {
            console.log('Block errors = ' + errorLog.length);
            console.log('Blocks: ' + errorLog);
        } else {
            console.log('No errors detected');
        }
    }

    addLevelDBData(key, value) {
        return new Promise(function (resolve, reject) {
            db.put(key, value, function(err) {
                if (err) {
                    reject(console.log('Block ' + key + ' submission failed', err));
                }
                resolve("Added")
            })
        })
    }

    // Get data from levelDB with key
    getLevelDBData(key) {
        return new Promise(function (resolve, reject) {
            db.get(key, function (err, value) {
                if (value) {
                    resolve(value)
                } else {
                    reject(value)
                }
            })
        })
    }

    getLevelDBDataByKey(hash) {
        let block = null;
        return new Promise(function(resolve, reject){
            db.createReadStream().on('data', function (data) {
                if (JSON.parse(data.value).hash === hash) {
                    block = data.value;
                }
                }).on('error', function (err) {
                    reject(err)
                }).on('close', function () {
                    resolve(block);
                });
        });
    }

    getLevelDBDataByAdd(address) {
        let arr = [];
        return new Promise(function(resolve, reject){
            db.createReadStream().on('data', function (data) {
                if (JSON.parse(data.value).body.address === address) {
                    arr.push(data.value);
                }
            }).on('error', function (err) {
                reject(err)
            }).on('close', function () {
                resolve(arr);
            });
        });
    }

    getHeightFromDB() {
        let i = -1;
        return new Promise(function (resolve, reject) {
            db.createReadStream().on('data', function (data) {
                i++;
            }).on('error', function (err) {
                console.log('Error: ' + err);
                reject(err);
            }).on('close', function () {
                resolve(i);
            });
        });
    }
}
module.exports = {
    Block,
    Blockchain
};