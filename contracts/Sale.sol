// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import './libs/IERC20Mint.sol';
import './libs/SafeERC20Mint.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';

contract Sale is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;
    using SafeERC20Mint for IERC20Mint;
    IERC20 public currency;
    address public devAddress;
    Details[] public tokens;
    uint public buyTotal;
    event eventBuy(address indexed tokenAddress, uint indexed amountCurrency, uint indexed amountOur);
    event eventAddToken(uint indexed id, Details indexed details);

    constructor(address _currencyAddress) {
        currency = IERC20(_currencyAddress);
        devAddress = msg.sender;
    }

    struct Details {
        address tokenAddress;
        uint initialPrice;
        uint increaseEvery;
        uint multiplier;
        uint buyAmount;
        uint buyCount;
    }

    function buyToken(uint _id, uint _amount) public nonReentrant {
        require(_id <= tokens.length, 'buy: Token not found');
        require(currency.allowance(msg.sender, address(this)) >= _amount, 'buy: Currency allowance is too low');
        IERC20Mint token = IERC20Mint(tokens[_id].tokenAddress);
        uint amountOur = 0;
        uint segmentNum =  tokens[_id].buyAmount / tokens[_id].increaseEvery;
        uint priceActual = tokens[_id].initialPrice;
        uint priceIncrease = priceActual * tokens[_id].multiplier / 10000;
        priceActual += segmentNum * priceIncrease;
        uint amountActual = _amount;
        uint segmentCount = tokens[_id].increaseEvery - (tokens[_id].buyAmount % tokens[_id].increaseEvery);
        while (amountActual > 0) {
            uint segmentCost = (segmentCount * priceActual) / 10**token.decimals();
            if (amountActual < segmentCost) {
                amountOur += amountActual * 10**token.decimals() / priceActual;
                amountActual = 0;
            } else {
                amountOur += segmentCount;
                amountActual -= segmentCost;
                segmentCount = tokens[_id].increaseEvery;
                priceActual += priceIncrease;
            }
        }
        currency.safeTransferFrom(msg.sender, address(this), _amount);
        currency.safeTransfer(devAddress, _amount);
        token.mint(amountOur);
        token.safeTransfer(msg.sender, amountOur);
        tokens[_id].buyAmount += amountOur;
        tokens[_id].buyCount++;
        buyTotal++;
        emit eventBuy(address(token), _amount, amountOur);
    }

    function addToken(address _tokenAddress, uint _initialPrice, uint _increaseEvery, uint _multiplier) public onlyOwner {
        Details memory details = Details(_tokenAddress, _initialPrice, _increaseEvery, _multiplier, 0, 0);
        tokens.push(details);
        emit eventAddToken(tokens.length - 1, details);
    }

    function setDevAddress(address _devAddress) public onlyOwner {
        devAddress = _devAddress;
    }
}
