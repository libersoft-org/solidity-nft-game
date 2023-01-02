import { expect } from "chai";
import { ethers } from "hardhat";
import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { DAI, Marketplace, NFT, Sale, TokenFactory, TokenProduct, TokenUpgrade } from "../typechain";

describe("Deploying test", function () {
  let _owner: SignerWithAddress;
  let _burn: SignerWithAddress;

  let _daiContract: DAI;
  let _tokenFactoryContract: TokenFactory;
  let _tokenProductContract: TokenProduct;
  let _tokenUpgradeContract: TokenUpgrade;
  let _saleContract: Sale;
  let _marketplaceContract: Marketplace;
  let _nftContract: NFT;

  beforeEach(async function () {
    [_owner, _burn] = await ethers.getSigners();

    const DAI = await ethers.getContractFactory("DAI");
    _daiContract = await DAI.deploy();
    await _daiContract.deployed();

    const TokenFactory = await ethers.getContractFactory("TokenFactory");
    _tokenFactoryContract = await TokenFactory.deploy("TokenFactory", "TF");
    await _tokenFactoryContract.deployed();

    const TokenProduct = await ethers.getContractFactory("TokenProduct");
    _tokenProductContract = await TokenProduct.deploy("TokenProduct", "TP");
    await _tokenProductContract.deployed();

    const TokenUpgrade = await ethers.getContractFactory("TokenUpgrade");
    _tokenUpgradeContract = await TokenUpgrade.deploy("TokenUpgrade", "TU");
    await _tokenUpgradeContract.deployed();

    const Sale = await ethers.getContractFactory("Sale");
    _saleContract = await Sale.deploy(_daiContract.address);
    await _saleContract.deployed();

    const Marketplace = await ethers.getContractFactory("Marketplace");
    _marketplaceContract = await Marketplace.deploy(_daiContract.address, 1);
    await _marketplaceContract.deployed();

    const NFT = await ethers.getContractFactory("NFT");
    _nftContract = await NFT.deploy(
      "NFT",
      "NFT",
      1,
      _owner.address,
      _burn.address,
      _marketplaceContract.address,
      _tokenFactoryContract.address,
      _tokenProductContract.address,
      _tokenUpgradeContract.address
    );
    await _nftContract.deployed();

    await _tokenProductContract.transferOwnership(_nftContract.address);
    await _tokenUpgradeContract.transferOwnership(_saleContract.address);
    await _tokenFactoryContract.transferOwnership(_saleContract.address);

    await _daiContract.mint(1000 * 1000);

    await _marketplaceContract.addAcceptedContract(_nftContract.address);
  });

  it("Should mint to marketplace", async function () {
    await _nftContract.collectionAdd("test", 1, 1, 1, 1, 1);
    await _nftContract.collectionPropertyAdd(0, "test", 1);
    await _nftContract.mintToMarketplace(0, "test", 1);
  });

  it("Should return properties", async function () {
    await _nftContract.collectionAdd("Piggy", "604800", "1000000000000000", "10000000000000000000", "1000000000000000000", "20000000000000000000");
    await _nftContract.collectionPropertyAdd(0, "Body", 5);
    await _nftContract.collectionPropertyAdd(0, "Ears", 5);
    await _nftContract.collectionPropertyAdd(0, "Eyes", 5);
    await _nftContract.collectionPropertyAdd(0, "Snout", 5);
    await _nftContract.collectionPropertyAdd(0, "Mouth", 5);
    await _nftContract.collectionPropertyAdd(0, "Tail", 5);

    await _nftContract.mint(_owner.address, 0, "Pig", false, 0, 0);

    const minValue = 0;
    const maxValue = 4;

    const body = await _nftContract.getNFTProperty(0, 0);
    expect(body).to.be.within(minValue, maxValue);

    const ears = await _nftContract.getNFTProperty(0, 1);
    expect(ears).to.be.within(minValue, maxValue);

    const eyes = await _nftContract.getNFTProperty(0, 2);
    expect(eyes).to.be.within(minValue, maxValue);

    const snout = await _nftContract.getNFTProperty(0, 3);
    expect(snout).to.be.within(minValue, maxValue);

    const mouth = await _nftContract.getNFTProperty(0, 4);
    expect(mouth).to.be.within(minValue, maxValue);

    const tail = await _nftContract.getNFTProperty(0, 5);
    expect(tail).to.be.within(minValue, maxValue);
  });
});
