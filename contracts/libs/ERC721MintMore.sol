// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC721/IERC721.sol';
import '@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol';
import '@openzeppelin/contracts/utils/Address.sol';
import '@openzeppelin/contracts/utils/Context.sol';
import '@openzeppelin/contracts/utils/Strings.sol';
import '@openzeppelin/contracts/utils/introspection/ERC165.sol';

contract ERC721MintMore is Context, ERC165, IERC721, IERC721Metadata {
    using Address for address;
    using Strings for uint;
    string private _name;
    string private _symbol;
    mapping(uint => address) private _owners;
    mapping(address => uint) private _balances;
    mapping(uint => address) private _tokenApprovals;
    mapping(address => mapping(address => bool)) private _operatorApprovals;
    
    constructor(string memory name_, string memory symbol_) {
        _name = name_;
        _symbol = symbol_;
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC165, IERC165) returns (bool) {
        return interfaceId == type(IERC721).interfaceId || interfaceId == type(IERC721Metadata).interfaceId || super.supportsInterface(interfaceId);
    }

    function balanceOf(address owner) public view virtual override returns (uint) {
        require(owner != address(0), 'ERC721: balance query for the zero address');
        return _balances[owner];
    }

    function ownerOf(uint tokenId) public view virtual override returns (address) {
        address owner = _owners[tokenId];
        require(owner != address(0), 'ERC721: owner query for nonexistent token');
        return owner;
    }

    function name() public view virtual override returns (string memory) {
        return _name;
    }

    function symbol() public view virtual override returns (string memory) {
        return _symbol;
    }

    function tokenURI(uint tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), 'ERC721Metadata: URI query for nonexistent token');
        string memory baseURI = _baseURI();
        return bytes(baseURI).length > 0 ? string(abi.encodePacked(baseURI, tokenId.toString())) : '';
    }

    function _baseURI() internal view virtual returns (string memory) {
        return '';
    }

    function approve(address to, uint tokenId) public virtual override {
        address owner = ERC721MintMore.ownerOf(tokenId);
        require(to != owner, 'ERC721: approval to current owner');
        require(_msgSender() == owner || isApprovedForAll(owner, _msgSender()), 'ERC721: approve caller is not owner nor approved for all');
        _approve(to, tokenId);
    }

    function getApproved(uint tokenId) public view virtual override returns (address) {
        require(_exists(tokenId), 'ERC721: approved query for nonexistent token');
        return _tokenApprovals[tokenId];
    }

    function setApprovalForAll(address operator, bool approved) public virtual override {
        _setApprovalForAll(_msgSender(), operator, approved);
    }

    function isApprovedForAll(address owner, address operator) public view virtual override returns (bool) {
        return _operatorApprovals[owner][operator];
    }

    function transferFrom(address from, address to, uint tokenId) public virtual override {
        require(_isApprovedOrOwner(_msgSender(), tokenId), 'ERC721: transfer caller is not owner nor approved');
        _transfer(from, to, tokenId);
    }

    function safeTransferFrom(address from,address to, uint tokenId) public virtual override {
        safeTransferFrom(from, to, tokenId, '');
    }

    function safeTransferFrom(address from, address to, uint tokenId, bytes memory _data) public virtual override {
        require(_isApprovedOrOwner(_msgSender(), tokenId), 'ERC721: transfer caller is not owner nor approved');
        _safeTransfer(from, to, tokenId, _data);
    }

    function _safeTransfer(address from, address to, uint tokenId, bytes memory _data) internal virtual {
        _transfer(from, to, tokenId);
        require(_checkOnERC721Received(from, to, tokenId, _data), 'ERC721: transfer to non ERC721Receiver implementer');
    }

    function _exists(uint tokenId) internal view virtual returns (bool) {
        return _owners[tokenId] != address(0);
    }

    function _isApprovedOrOwner(address spender, uint tokenId) internal view virtual returns (bool) {
        require(_exists(tokenId), 'ERC721: operator query for nonexistent token');
        address owner = ERC721MintMore.ownerOf(tokenId);
        return (spender == owner || getApproved(tokenId) == spender || isApprovedForAll(owner, spender));
    }

    function _safeMint(address to, uint tokenId) internal virtual {
        _safeMint(to, tokenId, '');
    }

    function _safeMint(address to, uint tokenId, bytes memory _data) internal virtual {
        _mint(to, tokenId);
        require(_checkOnERC721Received(address(0), to, tokenId, _data), 'ERC721: transfer to non ERC721Receiver implementer');
    }

    function _mint(address to, uint tokenId) internal virtual {
        require(to != address(0), 'ERC721: mint to the zero address');
        require(!_exists(tokenId), 'ERC721: token already minted');
        _beforeTokenTransfer(address(0), to, tokenId);
        _balances[to] += 1;
        _owners[tokenId] = to;
        emit Transfer(address(0), to, tokenId);
        _afterTokenTransfer(address(0), to, tokenId);
    }

    function _burn(uint tokenId) internal virtual {
        address owner = ERC721MintMore.ownerOf(tokenId);
        _beforeTokenTransfer(owner, address(0), tokenId);
        _approve(address(0), tokenId);
        _balances[owner] -= 1;
        delete _owners[tokenId];
        emit Transfer(owner, address(0), tokenId);
        _afterTokenTransfer(owner, address(0), tokenId);
    }

    function _transfer(address from, address to, uint tokenId) internal virtual {
        require(ERC721MintMore.ownerOf(tokenId) == from, 'ERC721: transfer from incorrect owner');
        require(to != address(0), 'ERC721: transfer to the zero address');
        _beforeTokenTransfer(from, to, tokenId);
        _approve(address(0), tokenId);
        _balances[from] -= 1;
        _balances[to] += 1;
        _owners[tokenId] = to;
        emit Transfer(from, to, tokenId);
        _afterTokenTransfer(from, to, tokenId);
    }

    function _approve(address to, uint tokenId) internal virtual {
        _tokenApprovals[tokenId] = to;
        emit Approval(ERC721MintMore.ownerOf(tokenId), to, tokenId);
    }

    function _setApprovalForAll(address owner, address operator, bool approved) internal virtual {
        require(owner != operator, 'ERC721: approve to caller');
        _operatorApprovals[owner][operator] = approved;
        emit ApprovalForAll(owner, operator, approved);
    }

    function _checkOnERC721Received(address from, address to, uint tokenId, bytes memory _data) private returns (bool) {
        if (to.isContract()) {
            try IERC721Receiver(to).onERC721Received(_msgSender(), from, tokenId, _data) returns (bytes4 retval) {
                return retval == IERC721Receiver.onERC721Received.selector;
            } catch (bytes memory reason) {
                if (reason.length == 0) revert('ERC721: transfer to non ERC721Receiver implementer');
                else {
                    assembly {
                        revert(add(32, reason), mload(reason))
                    }
                }
            }
        } else return true;
    }

    function _beforeTokenTransfer(address from, address to, uint tokenId) internal virtual {}

    function _afterTokenTransfer(address from, address to, uint tokenId) internal virtual {}

    function _mintMore(address to, uint startTokenID, uint count) internal virtual {
        require(to != address(0), 'ERC721: mint to the zero address');
        require(!_exists(startTokenID), 'ERC721: token already minted');
        for (uint i = startTokenID; i < startTokenID + count; i++) {
            _beforeTokenTransfer(address(0), to, i);
            _owners[i] = to;
            _afterTokenTransfer(address(0), to, i);
        }
        _balances[to] += count;
    }
}
