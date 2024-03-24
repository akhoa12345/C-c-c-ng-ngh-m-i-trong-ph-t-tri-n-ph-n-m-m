// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
//import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
//import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/Address.sol";

contract Campaign is Ownable {
    //using SafeERC20 for IERC20;
    using Address for address payable;

    struct Donator {
        address donator;
        uint256 totalDonated;
    }

    struct Description {
        string title;  // Campaign title
        string description; // Campaign description
        uint256 target; // raise ammount
        uint256 deadline; 
        string image;
    }

    Description _description;
    uint256 _numberOfDonators;
    uint256 _amountCollected;
    mapping (uint256=>address) _id2donator;
    mapping (address => Donator) _donators;

    constructor (
        string memory title,
        string memory campaignDescription,
        uint256 target,
        uint256 deadline,
        string memory image
    ) {
        //require(deadline > block.timestamp, "The deadline should be a date in future.");
        _description.title = title;
        _description.description = campaignDescription;
        _description.target = target;
        _description.deadline = deadline;
        _description.image = image;
        _amountCollected = 0;
    }

    receive() external payable {
        // This function is called when ETH is sent to the contract address
        // Additional logic can be added here if needed
    }

    function donate(uint256 amount) external payable returns (uint256) {
        require(amount > 0, "You need to send some ether");
        require(msg.value == amount, "Incorrect donation amount");

        Donator storage dnt = _donators[msg.sender];

        if (dnt.totalDonated == 0) {
            _id2donator[_numberOfDonators] = msg.sender;
            dnt.donator = msg.sender;
            dnt.totalDonated = 0;
            _numberOfDonators++;
        }

        dnt.totalDonated += amount;
        _amountCollected += amount;
        return amount;
    }

    function withdraw(uint256 amount) external returns (uint256) {
        Donator storage dnt = _donators[msg.sender];
        require(dnt.totalDonated >= amount, "You don't have enough tokens to withdraw");

        payable(msg.sender).transfer(amount);

        dnt.totalDonated -= amount;
        _amountCollected -= amount;

        return amount;
    }

    function withdrawCampaign() external onlyOwner {
        address _owner = owner();
        uint256 balance = address(this).balance;
        (bool sent, ) = _owner.call{value: balance}("");
        require(sent, "Failed to send Ether");
    }

    function donators() external view returns (Donator[] memory) {
        Donator[] memory result = new Donator[](_numberOfDonators);
        for (uint256 i = 0; i < _numberOfDonators; i++) {
            result[i] = _donators[_id2donator[i]];
        }
        return result;
    }

    function donator(address donatorAddress) external view returns (Donator memory) {
        return _donators[donatorAddress];
    }

    function amountCollected() external view returns (uint256) {
        return _amountCollected;
    }

    function description() external view returns (Description memory) {
        return _description;
    }
}