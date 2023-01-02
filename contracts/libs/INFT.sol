// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

interface INFT {
    struct Property {
        string name;
        uint basicCount;
        uint createdTime;
    }
    function balanceOf(address owner) external view returns (uint balance);
    function ownerOf(uint tokenId) external view returns (address owner);
    function safeTransferFrom(address from, address to, uint tokenId) external;
    function transferFrom(address from, address to, uint tokenId) external;
    function approve(address to, uint tokenId) external;
    function getApproved(uint tokenId) external view returns (address operator);
    function setApprovalForAll(address operator, bool _approved) external;
    function isApprovedForAll(address owner, address operator) external view returns (bool);
    function safeTransferFrom(address from, address to, uint tokenId, bytes calldata data) external;
    function totalSupply() external view returns (uint);
    function transfer(address _fromAddress, address _toAddress, uint _nftID) external;
    function nftRename(uint _nftID, string memory _name) external;
    function nftLevelUpgrade(uint _nftID, uint _levels) external;
    function nftSetProperty(uint _nftID, uint _propertyID, uint _value) external;
    function nftHarvestTokenProduct(uint _nftID) external;
    function getTokenProductToHarvest(uint _nftID) external view returns(uint);
    function mint(address _recipient, uint _collectionID, string memory _name, bool _hasParents, uint _parentMaleID, uint _parentFemaleID) external returns (uint);
    function mintMore(address _recipient, uint _collectionID, string memory _name, uint _count) external returns (uint);
    function mintToMarketplace(uint _collectionID, string memory _name, uint _price) external;
    function mintMoreToMarketplace(uint _collectionID, string memory _name, uint _price, uint _count) external;
    function factory(uint _nftMaleID, uint _nftFemaleID, string memory _name) external;
    function getNFTProperty(uint _nftID, uint _propertyID) view external returns (uint);
    function getCollectionProperty(uint _collectionID, uint _propertyID) view external returns (Property memory);
    function collectionAdd(string memory _name, uint _factoryTime, uint _tokenProductEmission, uint _tokenUpgradePriceLevel, uint _tokenUpgradePriceSetProperty, uint _tokenFactoryPrice) external returns (uint);
    function collectionRename(uint _collectionID, string memory _name) external;
    function collectionSetFactoryTime(uint _collectionID, uint _factoryTime) external;
    function collectionSetTokenProductEmission(uint _collectionID, uint _emission) external;
    function collectionSetTokenUpgradePriceLevel(uint _collectionID, uint _price) external;
    function collectionSetTokenUpgradePriceSetProperty(uint _collectionID, uint _price) external;
    function collectionSetTokenFactoryPrice(uint _collectionID, uint _price) external;
    function collectionRemove(uint _collectionID) external;
    function collectionPropertyAdd(uint _collectionID, string memory _name, uint _basicCount) external;
    function collectionPropertyRename(uint _collectionID, uint _propertyID, string memory _name) external;
    function collectionPropertySetBasicCount(uint _collectionID, uint _propertyID, uint _basicCount) external;
    function collectionPropertyRemove(uint _collectionID, uint _propertyID) external;
    function setDevFeeAddress(address _devFeeAddress) external;
    event Transfer(address indexed from, address indexed to, uint indexed tokenId);
    event Approval(address indexed owner, address indexed approved, uint indexed tokenId);
    event ApprovalForAll(address indexed owner, address indexed operator, bool approved);
    event eventTransfer(address indexed _fromAddress, address indexed _toAddress, uint indexed _nftID);
    event eventNFTRename(uint indexed _nftID, string indexed _nameOld, string indexed _nameNew);
    event eventNFTSetNFTProperty(uint indexed _nftID, uint indexed _valueOld, uint indexed _value);
    event eventNFTLevelUpgrade(uint indexed _nftID, uint indexed _levelOld, uint indexed _levelNew);
    event eventNFTHarvestTokenProduct(uint indexed _nftID, address indexed _toAddress, uint indexed _amount);
    event eventFactory(uint indexed _nftMaleID, uint indexed _nftFemaleID, uint indexed _newID);
    event eventCollectionAdd(uint indexed _collectionID, string indexed _name, uint indexed _tokenProductEmission);
    event eventCollectionRename(uint indexed _collectionID, string indexed _nameOld, string indexed _nameNew);
    event eventCollectionSetFactoryTime(uint indexed _collectionID, uint indexed _factoryTimeOld, uint indexed _factoryTimeNew);
    event eventCollectionSetTokenProductEmission(uint _collectionID, uint indexed _emissionOld, uint indexed _emissionNew);
    event eventCollectionSetTokenUpgradePriceLevel(uint indexed _collectionID, uint indexed _priceOld, uint indexed _price);
    event eventCollectionSetTokenUpgradePriceSetProperty(uint indexed _collectionID, uint indexed _priceOld, uint indexed _price);
    event eventCollectionSetTokenFactoryPrice(uint indexed _collectionID, uint indexed _priceOld, uint indexed _price);
    event eventCollectionRemove(uint indexed _collectionID);
    event eventCollectionPropertyAdd(uint indexed _collectionID, uint indexed _propertyID, string indexed _name);
    event eventCollectionPropertyRename(uint indexed _collectionID, uint indexed _propertyID, string indexed _name);
    event eventCollectionPropertySetBasicCount(uint indexed _collectionID, uint _propertyID, uint _basicCount);
    event eventCollectionPropertyRemove(uint indexed _collectionID, uint indexed _propertyID);
    event eventSetDevFeeAddress(address indexed devFeeAddressOld, address indexed _devFeeAddress);
}