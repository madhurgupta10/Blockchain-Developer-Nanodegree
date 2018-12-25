const StarNotary = artifacts.require('StarNotary')

contract('StarNotary', accounts => { 

    let user1 = accounts[1]
    let user2 = accounts[2]
    let randomMaliciousUser = accounts[3]

    let starPrice = web3.toWei(.01.toString(), "ether")

    let name = "Awesome Star"
    let starStory = "this star was bought for birthday"
    let ra = "1"
    let dec = "1"
    let mag = "1"

    let tokenId = 1

    beforeEach(async function() { 
        this.contract = await StarNotary.new({from: accounts[0]})
    })
    
    describe('can create a star', () => { 
        it('can create a star and get its name', async function () { 

            await this.contract.createStar(name, starStory, ra, dec, mag, tokenId, {from: accounts[0]})

            let starInfo = await this.contract.tokenIdToStarInfo(tokenId)
            assert.equal(starInfo[0], name)
            assert.equal(starInfo[1], starStory)
            assert.equal(starInfo[2], ra)
            assert.equal(starInfo[3], dec)
            assert.equal(starInfo[4], mag)
            
        })
    })

    describe('star uniqueness', () => {
        it('only stars unique stars can be minted', async function () {
            // first we mint our first star
            // then we try to mint the same star, and we expect an error
            try {
                // This code should throw error
                await this.contract.createStar(name, starStory, ra, dec, mag, tokenId, { from: user1 })
                await this.contract.createStar(name, starStory, ra, dec, mag, tokenId, { from: user1 })
                assert.equal("1", "2")
            } catch (e) {  
                assert.equal("1", "1")              
            }
        })

        it('only stars unique stars can be minted even if their ID is different', async function () {
            // first we mint our first star
            // then we try to mint the same star, and we expect an error
            try {
                // This code should throw error
                await this.contract.createStar(name, starStory, ra, dec, mag, tokenId, { from: user1 })
                await this.contract.createStar(name, starStory, ra, dec, mag, 2, { from: user1 })
                assert.equal("1", "2")
            } catch (e) {
                assert.equal("1", "1")
            }
        })

        it('minting unique stars does not fail', async function () {
            for (let i = 1; i < 10; i++) {
                let id = i
                let newRa = i.toString()
                let newDec = i.toString()
                let newMag = i.toString()

                await this.contract.createStar(name, starStory, newRa, newDec, newMag, id, { from: user1 })

                let starInfo = await this.contract.tokenIdToStarInfo(id)
                assert.equal(starInfo[0], name)
                assert.equal(starInfo[1], starStory)
                assert.equal(starInfo[2], newRa)
                assert.equal(starInfo[3], newDec)
                assert.equal(starInfo[4], newMag)
            }
        })
    })

    describe('buying and selling stars', () => { 

        beforeEach(async function () {
            await this.contract.createStar(name, starStory, ra, dec, mag, tokenId, {from: user1})
        })

        describe('user1 can sell a star', () => { 
            it('user1 can put up their star for sale', async function () { 
                await this.contract.putStarUpForSale(tokenId, starPrice, {from: user1})
            
                assert.equal(await this.contract.starsForSale(tokenId), starPrice)
            })

            it('user1 gets the funds after selling a star', async function () { 
                
                await this.contract.putStarUpForSale(tokenId, starPrice, {from: user1})

                let balanceOfUser1BeforeTransaction = web3.eth.getBalance(user1)
                await this.contract.buyStar(tokenId, {from: user2, value: starPrice})
                let balanceOfUser1AfterTransaction = await web3.eth.getBalance(user1)

                let a = await balanceOfUser1BeforeTransaction; 
                let b = await balanceOfUser1AfterTransaction;

                assert.equal(parseInt(a) + parseInt(starPrice), b)
            })
        })

        describe('user2 can buy a star that was put up for sale', () => { 
            beforeEach(async function () { 
                await this.contract.putStarUpForSale(tokenId, starPrice, {from: user1})
            })

            it('user2 is the owner of the star after they buy it', async function () { 
                await this.contract.buyStar(tokenId, {from: user2, value: starPrice})

                assert.equal(await this.contract.ownerOf(tokenId), user2)
            })

            it('user2 correctly has their balance changed', async function () { 
                let overpaidAmount = web3.toWei(.05.toString(), 'ether')

                const balanceOfUser2BeforeTransaction = await web3.eth.getBalance(user2)
                await this.contract.buyStar(tokenId, {from: user2, value: overpaidAmount, gasPrice:0})
                const balanceAfterUser2BuysStar = await web3.eth.getBalance(user2)

                let a = await balanceOfUser2BeforeTransaction;
                let b = await balanceAfterUser2BuysStar;

                assert.equal(parseInt(a) - parseInt(b), starPrice)
            })
        })
    })
})

var expectThrow = async function (promise) {
    try {
        await promise
    } catch (error) {
        assert.exists(error)
        return
    }

    assert.fail('expected an error, but none was found')
}