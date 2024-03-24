# crowd-funding
simple crowd-funding app using web3 smart-contract, meta mask

## References
### - [Build and Deploy a Web3 Blockchain Crowdfunding Platform (Kickstarter)](https://github.com/adrianhajdin/project_crowdfunding)
### - [Atoll IDO](https://github.com/carlbarrdahl/atoll-ido)
### - Subject's slides and documents

## Meaning of this Project
1. Building an simple IDO dApp, with necessary function like donate, withdraw, and transfer balance to IDO owner.
2. Deep working and knowlege about how the blockchain and smart contract work. Explore the applications of Blockchain in Finacial by developing DeFi app.
3. Building an applicaiton that connect between web2 and web3 application.

## Working processes
- Searching for resources, e.g: how to write an smart contract, web3 tutorials,...
- Start from an small application in tutorial. Building, and deploying smart contract successfully.
- Deep diving into IDO terms. Start applying, modifying and developing the source code.
- Recurrent developing on each feature in dApp, then reflect into the client web2 application.

## How to use

## How to run
### Crowdfunding
Edit the .env. Replace the `PRIVATE_KEY` with your wallet private key for ThirdWeb deployment.

Run `npm i` to install the dependencies.

Edit your willing working network in file `hardhat.config.js`. In my case, is the Sepolia testnet.

Run `npm run deploy` to deploy your smart contract to network
### Client
Run `npm i` to install the dependencies.

Edit the .env. Replace the `VITE_CROWDFUNDING_CONTRACT_ADDRESS` with your Crowdfunding smart contract.

Then run `npm dev run` for running app in development mode.

The application is running on port `5173`.