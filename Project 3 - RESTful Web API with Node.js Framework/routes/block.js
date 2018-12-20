var express = require('express');
var router = express.Router();
const { Block, Blockchain } = require('../simpleChain');

router.post('/', async (req, res, next) => {
    let bc = new Blockchain();
    let block = new Block(req.body.body);
    console.log(req.body.body)
    if (req.body.body && req.body.body.length !== 0) {
        await bc.addBlock(block);
        res.send(await bc.getBlock(await bc.getBlockHeight() + 1));
    } else {
        res.send({"error": "ERROR"});
    }
});

/* GET block page. */
router.get('/:height', async (req, res, next) => {
    try {
        let bc = new Blockchain();
        bc = await bc.getBlock(req.params.height);
        res.send(bc);
    } catch (e) {
        res.send({"error": "ERROR"})
    }
});

module.exports = router;