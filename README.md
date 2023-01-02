# Solidity - NFT game

An example of NFT game smart contracts written in Solidity.

## Smart contracts

- NFT - different animals, different attributes (level, name, sex, head, body, mouth, eyes, nose, tail - different attributes for each animal (collection)
- Staking - for staking Token Product and LP token
- Token Upgrade - for upgrading animal's level or changing appearance
- Token Factory - every animal can breed with other (same collection, different sex, same generation)
- Token Product - this is minted by every animal, animal's level speeds up the production of this token
- Sale - contract, where people can buy Token Upgrade and Token Factory - it increases incrementally price of both tokens
- Marketplace - users can put their NFTs to this contract to sell it for stable coin, developers get the commision of each sale

## Installation

These are installation instructions for Debian Linux 11.x:

```console
apt update
apt -y upgrade
apt -y install git yarn
git clone https://github.com/libersoft-org/solidity-nft-game.git
cd solidity-nft-game
yarn install
```

1. Edit a new file called ".secret" and put there a wallet mnemonic phrase (24 words) - you need to have some gas on this wallet to be able to deploy the smart contract.
2. Register on etherscan.io / bscscan.com / polygonscan.com or other etherscan-compatible block explorer and create your new API keys. This needs to be done to have your smart contract verified and made public on block explorer.
3. Edit .apikey_* files and add your API keys on the first line of each file (* means block explorer name, e.g.: etherscan, polygonscan, bscscan ...)
4. Edit the ./scripts/deploy.js file and set your smart contract variables
5. Run the deploy script:

```console
yarn install
./deploy.sh
```

## Unit tests

- You can run unit tests using:

```console
npx hardhat clean
npx hardhat compile
npx hardhat test
```

## License

- This software is open source released under [**Unlicense**](./LICENSE)

## Links to similar projects:

Building an NFT game:
- Part 1:         https://www.youtube.com/watch?v=_VVqa7zWSxA
- Part 2:         https://www.youtube.com/watch?v=y519kGkAQd8

Crypto Zombies:
- https://cryptozombies.io

Simple NFT:
- https://github.com/PatrickAlphaC/nft-mix/blob/main/contracts/SimpleCollectible.sol
