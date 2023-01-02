const fetch = require('node-fetch');

var netInfo;
var contracts = [];
var totalCost = ethers.BigNumber.from('0');
var verifyScript = '';
const confirmNum = 1;

async function main() {
 const maxint = '115792089237316195423570985008687907853269984665640564039457584007913129639935';
 var devFeeAddress = '0x650E5c6071f31065d7d5Bf6CaD5173819cA72c41';
 var burnAddress = '0x000000000000000000000000000000000000dEaD';
 var nftName = 'Animals.town';
 var nftSymbol = 'ATOWN';
 var nftDevFeePercent = '500'; // 5%
 var tokenFactoryName = 'Animals.town - Love';
 var tokenFactorySymbol = 'LOVE';
 var tokenProductName = 'Animals.town - Gold';
 var tokenProductSymbol = 'GOLD';
 var tokenUpgradeName = 'Animals.town - Upgrade';
 var tokenUpgradeSymbol = 'UPG';
 var marketplaceCurrencyAddress = '0xF42a4429F107bD120C5E42E069FDad0AC625F615'; // XUSD
 var marketplaceDevFeePercent = '100'; // 1%
 var saleCurrencyAddress = '0xF42a4429F107bD120C5E42E069FDad0AC625F615'; // XUSD
 var saleTokenUpgradeInitialPrice = '1000000000000000000'; // 1 XUSD / UPG
 var saleTokenUpgradeIncreaseEvery = '100000000000000000000'; // 100 UPG
 var saleTokenUpgradeMultiplier = '1000'; // 10%
 var saleTokenFactoryInitialPrice = '2000000000000000000'; // 2 XUSD / tokenUpgrade
 var saleTokenFactoryIncreaseEvery = '100000000000000000000'; // 100 UPG
 var saleTokenFactoryMultiplier = '100'; // 1%
 
 /*
 // TEST ONLY - POLYGON MUMBAI:
 var Sale = await ethers.getContractFactory('Sale');
 var sale = await Sale.attach('0x80403b7Bf6421761b21B105E421ba9580C305359');
 var TokenUpgrade = await ethers.getContractFactory('TokenUpgrade');
 var tokenUpgrade = await TokenUpgrade.attach('0x954BB7134EdDdC5541E39385F51084e602238f95');
 var TokenFactory = await ethers.getContractFactory('TokenFactory');
 var tokenFactory = await TokenFactory.attach('0x099E2b225F04c9C0e07CA6eD39d3234Dcdb88d33');
 var TokenProduct = await ethers.getContractFactory('TokenProduct');
 var tokenProduct = await TokenProduct.attach('0x3F80F71c54f2a83947e9e206DAe114C873d74d94');
 var Marketplace = await ethers.getContractFactory('Marketplace');
 var marketplace = await Marketplace.attach('0x2ab7866C275e8Be9362fbc7C2817a7a6988e2769');
 */


// TEST ONLY - AVAX TESTNET:
var Sale = await ethers.getContractFactory('Sale');
var sale = await Sale.attach('0x34FDb0e9cd2D767E6dB8c2030b57a34A1feC5dba');
var TokenUpgrade = await ethers.getContractFactory('TokenUpgrade');
var tokenUpgrade = await TokenUpgrade.attach('0xd843856E8F3bD582A683C2f91555754254BA4783');
var TokenFactory = await ethers.getContractFactory('TokenFactory');
var tokenFactory = await TokenFactory.attach('0x96C1331c1cC8657a78850FD61DF345D27141bFC3');
var TokenProduct = await ethers.getContractFactory('TokenProduct');
var tokenProduct = await TokenProduct.attach('0x1556Ecb8404b4bc87254F390DF50f81cC2346689');
var Marketplace = await ethers.getContractFactory('Marketplace');
var marketplace = await Marketplace.attach('0x15556dB95C89d3f384a750359c15258f162c039e');

// TEST ONLY - FANTOM TESTNET:
var Marketplace = await ethers.getContractFactory('Marketplace');
var marketplace = await Marketplace.attach('0xAD531A13b61E6Caf50caCdcEebEbFA8E6F5Cbc4D');

 /*
 var NFT = await ethers.getContractFactory('NFT');
 var nft = await NFT.attach('');
 */

 getWelcomeMessage('NFT');
 netInfo = await getNetworkInfo();
 getNetworkMessage();
 console.log();
 console.log('Deploying smart contracts ...');
 console.log();
 //var sale = await deploy('Sale', saleCurrencyAddress);
 //var tokenUpgrade = await deploy('TokenUpgrade', tokenUpgradeName, tokenUpgradeSymbol);
 //var tokenFactory = await deploy('TokenFactory', tokenFactoryName, tokenFactorySymbol);
 //var tokenProduct = await deploy('TokenProduct', tokenProductName, tokenProductSymbol);
 var marketplace = await deploy('Marketplace', marketplaceCurrencyAddress, marketplaceDevFeePercent);
 var nft = await deploy('NFT', nftName, nftSymbol, nftDevFeePercent, devFeeAddress, burnAddress, marketplace.address, tokenFactory.address, tokenProduct.address, tokenUpgrade.address);
 createVerifyScript();
 getTotalCost();

 // ADD COLLECTIONS AND PROPERTIES:
 
 // collectionAdd: name, factoryTime, tokenProductEmission, tokenUpgradePriceLevel, tokenUpgradePriceSetProperty, tokenFactoryPrice
 var piggy = await collectionAdd(nft, 'Piggy', '604800', '1000000000000000', '10000000000000000000', '1000000000000000000', '20000000000000000000');
 //var duck = await collectionAdd(nft, 'Duck', '604800', '500000000000000', '5000000000000000000', '500000000000000000', '10000000000000000000');
 
 // collectionPropertyAdd: collectionID, name, basicCount
 await collectionPropertyAdd(nft, piggy, 'Body', '3');
 /*
 await collectionPropertyAdd(nft, piggy, 'Ears', '5');
 await collectionPropertyAdd(nft, piggy, 'Eyes', '5');
 await collectionPropertyAdd(nft, piggy, 'Snout', '5');
 await collectionPropertyAdd(nft, piggy, 'Mouth', '5');
 await collectionPropertyAdd(nft, piggy, 'Tail', '5');
 await collectionPropertyAdd(nft, duck, 'Body', '5');
 await collectionPropertyAdd(nft, duck, 'Eyes', '5');
 await collectionPropertyAdd(nft, duck, 'Beak', '5');
 await collectionPropertyAdd(nft, duck, 'Wings', '6');
*/

 // TEST - mint 10 NFT
 await runFunction(nft, 'mintMore', await nft.owner(), 0, 'Piggy', 10);

 // TEST - approve Token Upgrade to NFT contract
 await runFunction(tokenUpgrade, 'approve', nft.address, maxint);

 /*
 // TEST - TOKEN UPGRADE AND TOKEN FACTORY TO DEV WALLET
 await runFunction(tokenUpgrade, 'mint', '10000000000000000000000');
 await runFunction(tokenFactory, 'mint', '10000000000000000000000');
 */
 // SETTINGS:
 await runFunction(marketplace, 'addAcceptedContract', nft.address);
 
 await runFunction(nft, 'setApprovalForAll', marketplace.address, 'true');
 //await runFunction(nft, 'setApprovalForAll', nft.address, 'true');
 //await runFunction(nft, 'setApprovalForAll', await nft.owner(), 'true');
 //await runFunction(tokenProduct, 'transferOwnership', nft.address);
 /*
 await runFunction(tokenUpgrade, 'transferOwnership', sale.address);
 await runFunction(tokenFactory, 'transferOwnership', sale.address);
 await runFunction(sale, 'addToken', tokenFactory.address, saleTokenFactoryInitialPrice, saleTokenFactoryIncreaseEvery, saleTokenFactoryMultiplier);
 await runFunction(sale, 'addToken', tokenUpgrade.address, saleTokenUpgradeInitialPrice, saleTokenUpgradeIncreaseEvery, saleTokenUpgradeMultiplier); 
 */
/*
 // TEST - SALE - APPROVE
 var XUSD = await ethers.getContractFactory('TokenProduct');
 var xusd = await XUSD.attach('0xF42a4429F107bD120C5E42E069FDad0AC625F615');
 await runFunction(xusd, 'approve', sale.address, maxint);
*/

 // SUMMARY:
 getTotalCost();
 await getSummary();
}

async function getNetworkInfo() {
 var arr = [];
 const account = (await ethers.getSigners())[0];
 arr['chainID'] = (await ethers.provider.getNetwork()).chainId;
 arr['name'] = 'Unknown';
 arr['rpc'] = 'Unknown';
 arr['currency'] = 'Unknown';
 arr['symbol'] = 'ETH';
 arr['explorer'] = 'https://etherscan.io';
 arr['walletAddress'] = account.address;
 arr['walletBalance'] = ethers.utils.formatEther(await account.getBalance());
 var response = await fetch('https://chainid.network/chains.json');
 var json = await response.json();
 json = JSON.stringify(json);
 var arrJSON = JSON.parse(json);
 for (var i = 0; i < arrJSON.length; i++) {
  if (arrJSON[i].chainId == arr['chainID']) {
   if (!!arrJSON[i].name) arr['name'] = arrJSON[i].name;
   if (!!arrJSON[i].nativeCurrency.name) arr['currency'] = arrJSON[i].nativeCurrency.name;
   if (!!arrJSON[i].nativeCurrency.symbol) arr['symbol'] = arrJSON[i].nativeCurrency.symbol;
   if (!!arrJSON[i].explorers[0].url) arr['explorer'] = arrJSON[i].explorers[0].url;
  }
 }
 return arr;
}

function getWelcomeMessage(name) {
 const eq = '='.repeat(arguments[0].length + 16);
 console.log();
 console.log(eq);
 console.log(name + ' - deploy script');
 console.log(eq);
 console.log();
 console.log('Start time: ' + new Date(Date.now()).toLocaleString());
 console.log();
}

function getNetworkMessage() {
 console.log('Network info:');
 console.log();
 console.log('Chain name:      ' + netInfo['name']);
 console.log('Chain ID:        ' + netInfo['chainID']);
 console.log('Currency:        ' + netInfo['currency'] + ' (' + netInfo['symbol'] + ')');
 console.log('Block explorer:  ' + netInfo['explorer']);
 console.log('Wallet address:  ' + netInfo['walletAddress']);
 console.log('Wallet balance:  ' + netInfo['walletBalance'] + ' ' + netInfo['symbol']);
 console.log();
}

async function deploy() {
 if (arguments.length == 0) {
  console.log('Error: Missing smart contract name');
  console.log();
  return;
 }
 var params = [];
 if (arguments.length > 1) for (var i = 1; i < arguments.length; i++) params.push(arguments[i]);
  const dash = '-'.repeat(arguments[0].length + 10);
 console.log(dash);
 console.log('Contract: ' + arguments[0]);
 console.log(dash);
 console.log();
 const Contract = await ethers.getContractFactory(arguments[0]);
 const contract = await Contract.deploy(...params);
 console.log('Contract TX ID:   ' + contract.deployTransaction.hash);
 console.log('Contract address: ' + contract.address);
 var balance = ethers.utils.formatEther(await (await ethers.getSigners())[0].getBalance()) + ' ' + netInfo['symbol'];
 console.log('Wallet balance:   ' + balance);
 var result = await contract.deployed();
 var receipt = await ethers.provider.getTransactionReceipt(contract.deployTransaction.hash);
 var blockTimestamp = (await ethers.provider.getBlock(receipt.blockNumber)).timestamp;
 console.log('Block number:     ' + receipt.blockNumber.toString());
 console.log('Block timestamp:  ' + blockTimestamp.toString());
 console.log('Gas limit:        ' + result.deployTransaction.gasLimit.toString());
 console.log('Gas used:         ' + receipt.gasUsed);
 console.log('Gas price:        ' + ethers.utils.formatUnits(result.deployTransaction.gasPrice.toString(), 'gwei') + ' gwei');
 console.log('Value sent:       ' + ethers.utils.formatEther(result.deployTransaction.value.toString()) + ' ' + netInfo['symbol']);
 var cost = contract.deployTransaction.gasPrice.mul(receipt.gasUsed);
 totalCost = totalCost.add(cost);
 console.log('Deploy cost:      ' + ethers.utils.formatEther(cost.toString()) + ' ' + netInfo['symbol']);
 console.log();
 var cont = [];
 cont['name'] = arguments[0];
 cont['address'] = contract.address;
 contracts.push(cont);
 console.log('Waiting for ' + confirmNum + ' confirmations...');
 console.log();
 var confirmations = 0;
 var lastConfirmation = -1;
 while (confirmations < confirmNum) {
  confirmations = (await contract.deployTransaction.wait(1)).confirmations;
  if (lastConfirmation != confirmations) console.log('Confirmation: ' + confirmations);
  lastConfirmation = confirmations;
 }
 console.log();
 verifyScript += 'npx hardhat verify --network $1 --contract contracts/' + arguments[0] + '.sol:' + arguments[0] + ' ' + contract.address;
 if (arguments.length > 1) for (var i = 1; i < arguments.length; i++) verifyScript += ' "' + arguments[i] + '"';
 verifyScript += "\n";
 return result;
}

function getTotalCost() {
 var total = 'Total cost: ' + ethers.utils.formatEther(totalCost.toString()) + ' ' + netInfo['symbol'];
 const eq = '='.repeat(total.length);
 console.log(eq);
 console.log(total);
 console.log(eq);
 console.log();
}

function createVerifyScript() {
 const fs = require('fs');
 var verifyFile = './verify.sh';
 if (fs.existsSync(verifyFile)) fs.unlinkSync(verifyFile);
 fs.writeFileSync(verifyFile, '#!/bin/sh' + "\n\n" + verifyScript);
 fs.chmodSync(verifyFile, 0o755);
}

async function getSummary() {
 console.log('===================');
 console.log('Deployed contracts:');
 console.log('===================');
 console.log();
 for (var i = 0; i < contracts.length; i++) console.log(contracts[i]['name'] + ': ' + netInfo['explorer'] + '/address/' + contracts[i]['address']);
 console.log();
 console.log('End time: ' + new Date(Date.now()).toLocaleString());
 console.log();
}

async function runFunction() {
 if (arguments.length < 2) {
  console.log('Error: Missing parameters');
  console.log();
  return;
 }
 var params = [];
 if (arguments.length > 2) for (var i = 2; i < arguments.length; i++) params.push(arguments[i]);
 var res = await arguments[0][arguments[1]](...params);
 if (typeof res === 'object') {
  console.log('Waiting for 1 confirmation...');
  await res.wait(1);
  console.log('Done.');
  var receipt = await ethers.provider.getTransactionReceipt(res.hash);
  var cost = res.gasPrice.mul(receipt.gasUsed);
  console.log('Transaction cost: ' + ethers.utils.formatEther(cost.toString()) + ' ' + netInfo['symbol']);
  totalCost = totalCost.add(cost);
  console.log();
 } else return res;
}

async function collectionAdd(contract, name, factoryTime, tokenProductEmission, tokenUpgradePriceLevel, tokenUpgradePriceSetProperty, tokenFactoryPrice) {
 console.log('Adding collection: \"' + name + '\"');
 await runFunction(contract, 'collectionAdd', name, factoryTime, tokenProductEmission, tokenUpgradePriceLevel, tokenUpgradePriceSetProperty, tokenFactoryPrice);
 return (await contract.collectionsCount() - 1).toString();
}

async function collectionPropertyAdd(contract, collectionID, name, basicCount) {
 console.log('Adding property: \"' + name + '\" to collection ID: ' + collectionID);
 await runFunction(contract, 'collectionPropertyAdd', collectionID, name, basicCount);
}

main()
 .then(() => process.exit(0))
 .catch((error) => {
  console.error(error);
  process.exit(1);
 });
