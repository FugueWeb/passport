const Passport = artifacts.require("Passport");

module.exports = function(deployer, network) {

    console.log(`${"-".repeat(30)}
    DEPLOYING Passport Contract...\n
    Using ` + network + ` network\n`);

    deployer.deploy(Passport);
};
