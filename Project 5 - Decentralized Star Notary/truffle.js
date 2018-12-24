var HDWalletProvider = require("truffle-hdwallet-provider");

var mneoinic = "vital piece chaos nut join leg orphan length plug valid mercy scrub";

module.exports = {
    networks: {
        development: {
            host: "localhost",
            port: "8545",
            network_id: "*",
            from: ""
        },
        rinkeby: {
            provider: function() {
                return new HDWalletProvider(mneoinic, "https://rinkeby.infura.io/v3/5e61db691204443aaa46396a0a9da49c")
            },
            network_id: 4,
            gas: 5000000
        },
    },
    compilers: {
        solc: {
            version: "0.4.23",    // Fetch exact version from solc-bin (default: truffle's version)
            // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
            // settings: {          // See the solidity docs for advice about optimization and evmVersion
            //  optimizer: {
            //    enabled: false,
            //    runs: 200
            //  },
            //  evmVersion: "byzantium"
            // }
        }
    }
};