# TODO

## Sale
- half of earned DAI should go to liquidity of Token Product (DAI + mint adequate number of tokens - will not mint directly, because the owner of Product Token is NFT contract)

## NFT
- mintToMarketplace and mintMoreToMarketplace - throws an error - Fail with error 'ERC721: transfer to non ERC721Receiver implementer'
- getNFTProperty returns Property ID error (even it is right one)
- add an option to renounce a collection - cannot do anything with it anymore, not even add / change properties values, manual mint - breeding mint still have to work!
- add an option of properties, that are not basic - will be next IDs
- NFT - add an option of paid accessories (hats, suits, shoes etc.), can be attached and detached from NFT, will go to Marketplace together with it?
- NFT - ERC721MintMore - make it smaller and as a library or abstract contract or something like that
- NFT - split to libraries / abstract contracts a then disable optimizer in hardhat.config.js
- NFT - Breeding - remake it like appearance of child will be 1:3 for each property - by mother, father or random (now it's random only)

## Staking
- use the similar contract as this one: https://github.com/PigInu/PigInu/blob/master/contracts/Pool.sol