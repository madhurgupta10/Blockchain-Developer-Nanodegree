pragma solidity ^0.4.23;

import './ERC721Token.sol';

contract StarNotary is ERC721Token { 

    struct Star {
        string name;
        string starStory;
        string ra;
        string dec;
        string mag;
    }
    
    mapping(uint256 => Star) public tokenIdToStarInfoMap;

    mapping(uint256 => uint256) public starsForSale;
    
    mapping(bytes32 => bool) public starsMap;

    uint256 count;

    function createStar(string _name, string _starStory, string _ra, string _dec, string _mag, uint256 _tokenId) public { 
        count++;

        // checking start does not exist already
        require(keccak256(abi.encodePacked(tokenIdToStarInfoMap[_tokenId].dec)) == keccak256(""));

        // checking input's are valid
        require(keccak256(abi.encodePacked(_ra)) != keccak256(""));
        require(keccak256(abi.encodePacked(_dec)) != keccak256(""));
        require(keccak256(abi.encodePacked(_mag)) != keccak256(""));
        require(!checkIfStarExists(_ra, _dec, _mag));
        require(_tokenId > 0);


        Star memory newStar = Star(_name, _starStory, _ra, _dec, _mag);

        tokenIdToStarInfoMap[_tokenId] = newStar;

        bytes32 hash = keccak256(abi.encodePacked(_ra, _dec, _mag));
        starsMap[hash] = true;

        ERC721Token.mint(_tokenId);
    }

    function putStarUpForSale(uint256 _tokenId, uint256 _price) public { 
        require(this.ownerOf(_tokenId) == msg.sender);

        starsForSale[_tokenId] = _price;
    }

    function buyStar(uint256 _tokenId) public payable { 
        require(starsForSale[_tokenId] > 0);

        uint256 starCost = starsForSale[_tokenId];
        address starOwner = this.ownerOf(_tokenId);

        require(msg.value >= starCost);

        clearPreviousStarState(_tokenId);

        transferFromHelper(starOwner, msg.sender, _tokenId);

        if(msg.value > starCost) { 
            msg.sender.transfer(msg.value - starCost);
        }

        starOwner.transfer(starCost);
    }

    function checkIfStarExists(string _ra, string _dec, string _mag) public view returns(bool) {    
        return starsMap[keccak256(abi.encodePacked(_ra, _dec, _mag))];
    }

    function clearPreviousStarState(uint256 _tokenId) private {
        //clear approvals 
        tokenToApproved[_tokenId] = address(0);

        //clear being on sale 
        starsForSale[_tokenId] = 0;
    }

    function tokenIdToStarInfo(uint256 _tokenId) public view returns(string, string, string, string, string) {
        return (tokenIdToStarInfoMap[_tokenId].name, tokenIdToStarInfoMap[_tokenId].starStory, tokenIdToStarInfoMap[_tokenId].ra, tokenIdToStarInfoMap[_tokenId].dec, tokenIdToStarInfoMap[_tokenId].mag);
    }

    function mint(uint256 _tokenId) public {
        ERC721Token.mint(_tokenId);
    }
}