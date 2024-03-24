// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract CrowdFunding {
    mapping(uint256 => address) campaigns;
    mapping(address => uint256) address2campaignId;

    uint256 public numberOfCampaigns = 0;

    // accept info => return campaign id
    function addCampaign(address _campaignAddress) external returns (uint256) {
        uint256 id = address2campaignId[_campaignAddress];

        // handle if the number of campaigns is 0
        if (numberOfCampaigns == 0) {
            campaigns[numberOfCampaigns] = _campaignAddress;
            address2campaignId[_campaignAddress] = numberOfCampaigns;
            numberOfCampaigns++;
        } else {
            // handle if the number of campaigns is not 0
            if (id == 0 && campaigns[0] != _campaignAddress) {
                campaigns[numberOfCampaigns] = _campaignAddress;
                address2campaignId[_campaignAddress] = numberOfCampaigns;
                numberOfCampaigns++;
            }
        }
        return numberOfCampaigns - 1;
    }

    function getCampaigns() external view returns (address[] memory) {
        address[] memory allCampaigns = new address[](numberOfCampaigns);

        for (uint i = 0; i < numberOfCampaigns; i++) {
            address item = campaigns[i];
            allCampaigns[i] = item;
        }
        return allCampaigns;
    }
}