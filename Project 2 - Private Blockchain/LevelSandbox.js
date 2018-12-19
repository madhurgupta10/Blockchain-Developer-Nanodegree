/* ===== Persist data with LevelDB ==================
|  Learn more: level: https://github.com/Level/level |
/===================================================*/

const level = require('level');
const chainDB = './chaindata';

class LevelSandbox {

    constructor() {
        this.db = level(chainDB);
    }

    // Get data from levelDB with key (Promise)
    getLevelDBData(key){
        let self = this;
        return new Promise(function(resolve, reject) {
            self.db.get(key, (error, value) => {
                if (error) {
                    reject(error);
                }
                resolve(value);
            })
        })
    }

    // Add data to levelDB with key and value (Promise)
    addLevelDBData(key, value) {
        let self = this;
        return new Promise(function(resolve, reject) {
            self.db.put(key, value, (error) => {
                if (error) {
                    reject(error)
                }
            })
        });
    }

    // Method that return the height
    getBlocksCount() {
        let self = this;
        let height = -1;
        return new Promise(function(resolve, reject){
            self.db.createReadStream().on('data', (data) => {
                height = height + 1;
            }).on('error', (error) => {
                reject(error)
            }).on('close', () => {
                resolve(height)
            })
        });
    }
        

}

module.exports.LevelSandbox = LevelSandbox;