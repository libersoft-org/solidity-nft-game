// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';

contract DAI is ERC20 {
  using SafeERC20 for IERC20;

  constructor() ERC20('DAI', 'DAI') {}

  function mint(uint256 _amount) external {
    _mint(msg.sender, _amount);
  }
}