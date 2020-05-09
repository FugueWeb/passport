## About

Passport smart contract.

## Setup

1. Install Truffle: `npm install -g truffle` - [Docs](https://www.trufflesuite.com/docs/truffle/quickstart)
2. Clone repo and run `npm install`
3. You will need to connect to a blockchain and Truffle provides different options, such as [Ganache](https://www.trufflesuite.com/docs/ganache/quickstart). **For development on a live testnet** (Goerli, Ropsten, etc.), create an `app.env` file to store private variables (see `truffle-config.js` file).
4. Run `truffle compile`, `truffle migrate` and `truffle test` to compile your contracts, deploy those contracts to the network, and run their associated unit tests. Truffle comes bundled with a local development blockchain server that launches automatically when you invoke the commands  above. You can interact with the contracts with `truffle console`.

## References
* [Ethereum](https://ethereum.org/)
* [Truffle](http://truffleframework.com/docs/)
* [Open Zeppelin](https://docs.openzeppelin.com/openzeppelin/)
