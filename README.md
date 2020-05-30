## About

Simple passport smart contract deployed to the `Goerli` test net. The contract is able to:  

- use access control (admin role) to enable or limit functionality
- allow admins to add passports, consisting of a `lastName` property and a `salt` to obfuscate the stored hash value
- read or verify the secure hash values stored on chain. Those without the admin role will not be able to read or verify these values, even if they enter the correct data as parameters into the functions.
- read the expiration date of a passport given a `passportNumber`. This property can be read by anyone on the network.
- add other admins

## Interacting with the Smart Contract

1. Install the [Metamask](https://metamask.io/) browser extension and follow steps to setup and backup your wallet.
2. After installation, you should see a fox icon (i.e., the Metamask extension) in the top right of your browser. Click the icon and change the network (drop down menu, top center) to `Goerli`.
3. To make state changes on the Ethereum blockchain you need to pay transaction fees, and for that you need `ether`. If you do not have any `Goerli` test ether, you can go to [this faucet](https://goerli-faucet.slock.it/) and paste in your address to request some for free. Note, to simply read from the contract, no test ether is required.
4. Go to [MyEtherWallet](https://www.myetherwallet.com/) and click the `Access My Wallet` button
5. On the next screen select the `MEW CX -OR- Metamask; Dapper` option and accept the terms and conditions. This will trigger a Metamask pop-up where you authorize Metamask to connect to your wallet. Click the `Connect` button.
6. You now have a number of options available to interact with the Ethereum network. On the left hand side navigation, choose `Contract - Interact with Contract`. 
    - In the `Contract Address` field enter `0x555d300E412E4B3B51a92E50be23E7484CcA00d1`
    - In the `ABI/JSON Interface` field, copy and paste in the contents of [this file](https://raw.githubusercontent.com/FugueWeb/passport/master/misc/abi.json) 
    - Click the `Continue` button
7. You can now interact with the smart contract. Select functions from the drop down menu marked `Select an Item`. Options include:
    - `addAdminRole` - Add an admin at a given address. Only admins may use this function.
    - `addPassport` - Add a passport by providing a `lastName` and a `salt`, which functions as a type of unique password for the hash value stored on the blockchain. Only admins may add passports.
    - `checkPassportHash` - Returns `true` if the correct `passportNumber`, `lastName`, and `salt` are entered. Note, unless you are an admin this function will return `true` for any value you enter.
    - `getSecureHash` - Returns the hash of the passport lastname and salt at a given `passportNumber`. Note, this function will return a meaningless value unless you are an admin.
    - `isPassportExpired` - Returns a [UNIX timestamp](https://www.unixtimestamp.com/) of a given `passportNumber`. This is a read only function and can be called by anyone.  

## Dev Setup

1. Install Truffle: `npm install -g truffle` - [Docs](https://www.trufflesuite.com/docs/truffle/quickstart)
2. Clone repo and run `npm install`
3. You will need to connect to a blockchain and Truffle provides different options, such as [Ganache](https://www.trufflesuite.com/docs/ganache/quickstart). **For development on a live testnet** (Goerli, Ropsten, etc.), create an `app.env` file to store private variables (see `truffle-config.js` file).
4. Run `truffle compile`, `truffle migrate` and `truffle test` to compile your contracts, deploy those contracts to the network, and run their associated unit tests. Truffle comes bundled with a local development blockchain server that launches automatically when you invoke the commands  above. You can interact with the contracts with `truffle console`.

## References
* [Ethereum](https://ethereum.org/)
* [Truffle](http://truffleframework.com/docs/)
* [Open Zeppelin](https://docs.openzeppelin.com/openzeppelin/)
