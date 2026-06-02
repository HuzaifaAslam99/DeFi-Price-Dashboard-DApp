// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

contract PriceTracker {
    AggregatorV3Interface internal ethUsdFeed;
    AggregatorV3Interface internal btcUsdFeed;
    AggregatorV3Interface internal linkUsdFeed;

    // State mappings for live direct reads
    mapping(string => int256) private prices;
    
    event PriceLogged(string token, uint256 price, uint256 timestamp);

    constructor() {
        // Core Feeds from Base Sepolia Directory
        ethUsdFeed = AggregatorV3Interface(0x4aDC67696bA383F43DD60A9e78F2C97Fbbfc7cb1);
        btcUsdFeed = AggregatorV3Interface(0x0FB99723Aee6f420beAD13e6bBB79b7E6F034298);
        linkUsdFeed = AggregatorV3Interface(0xb113F5A928BCfF189C998ab20d753a47F9dE5A61);
    }

    // Individual standard dynamic fetch functions for wagmi read hooks
    function getLatestETH() public view returns (int256) {
        (, int256 price, , , ) = ethUsdFeed.latestRoundData();
        return price;
    }

    function getLatestBTC() public view returns (int256) {
        (, int256 price, , , ) = btcUsdFeed.latestRoundData();
        return price;
    }

    function getLatestLINK() public view returns (int256) {
        (, int256 price, , , ) = linkUsdFeed.latestRoundData();
        return price;
    }

    // Your main execution button logic can write the status changes to logs
    function logLatestPrice() public {
        (, int256 ethPrice, , uint256 ethTime, ) = ethUsdFeed.latestRoundData();
        (, int256 btcPrice, , uint256 btcTime, ) = btcUsdFeed.latestRoundData();
        (, int256 linkPrice, , uint256 linkTime, ) = linkUsdFeed.latestRoundData();

        // Emit all three events
        emit PriceLogged("ETH", uint256(ethPrice), ethTime);
        emit PriceLogged("BTC", uint256(btcPrice), btcTime);
        emit PriceLogged("LINK", uint256(linkPrice), linkTime);
    }
}