/* ===== Blockchain Class ==========================
|  Class with a constructor for new blockchain 		|
|  ================================================*/

const SHA256 = require('crypto-js/sha256');
const LevelSandbox = require('./LevelSandbox.js');
const Block = require('./Block.js');

class Blockchain {

    constructor() {
        this.bd = new LevelSandbox.LevelSandbox();
        this.generateGenesisBlock();
    }

    // Auxiliar method to create a Genesis Block (always with height= 0)
    // You have to options, because the method will always execute when you create your blockchain
    // you will need to set this up statically or instead you can verify if the height !== 0 then you
    // will not create the genesis block
    generateGenesisBlock(){
        this.getBlockHeight().then((height) => {
            if (height === -1) {
                this.addBlock(new Block("Genesis block")).then(() => console.log("Genesis block added!"))
            }
        })
    }

    // Get block height, it is auxiliar method that return the height of the blockchain
    getBlockHeight() {
        return new Promise((resolve, reject) => {
            resolve(this.bd.getBlocksCount());
        })
    }

    // Add new block
    addBlock(block) {
        return new Promise((resolve, reject) => {
            resolve(this.bd.addLevelDBData(block));
        })
    }

    // Get Block By Height
    getBlock(height) {
        return new Promise((resolve, reject) => {
            resolve(this.bd.getLevelDBData(height));
        })        
    }

    // Validate if Block is being tampered by Block Height
    validateBlock(height) {
        return new Promise((resolve, reject) => {
            let block = this.getBlock(height);
            let hash = block.hash;
            if (hash == SHA256(JSON.stringify(block)).toString()) {
                resolve(true)
            }
        })
    }

    // Validate Blockchain
    validateChain() {
        return new Promise((resolve, reject) => {
            let logArray = [];
            var invalid = true;
            let previousHash = "";
            let height = this.getBlockHeight()
            for (var i = 0; i < height; i++) {
                this.getBlock(i).then((block) => {
                    invalid = this.validateBlock(block.height)
                    if (invalid) {
                        logArray.push(i)
                    }
                    if (block.previousBlockHash != previousHash) {
                        logArray.push(i)
                    }

                    previousHash = block.hash
                    if (i == (height-1)) {
                        if (logArray.length > 0) {
                            console.log("Total errors "+logArray.length);
                        } else {
                            console.log("Valid")
                        }
                    }
                }) 
            }
        })
    }

    // Utility Method to Tamper a Block for Test Validation
    // This method is for testing purpose
    _modifyBlock(height, block) {
        let self = this;
        return new Promise( (resolve, reject) => {
            self.bd.addLevelDBData(height, JSON.stringify(block).toString()).then((blockModified) => {
                resolve(blockModified);
            }).catch((err) => { console.log(err); reject(err)});
        });
    }
   
}

module.exports.Blockchain = Blockchain;