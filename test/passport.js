const Passport = artifacts.require("Passport");
const salt = "strongRandomStringKeptPrivate";
const lastname = "Smith";
const futureTimestamp = 1651953453; //May 7, 2022, about two years from now

contract("FFPaymentSplit", async (accounts) => {
  let passportInstance;

  beforeEach(async () => {
    passportInstance = await Passport.new();
  });

  it("should add a new passport with a number of 0", async () => {
    let pn;
    await passportInstance.addPassport(lastname, salt).then(result =>{
        pn = result.logs[0].args.passportNumber.toString();
    });
    assert.equal(Number(pn), 0);
  });

  it("should increment the passport number", async () => {
    let pn1, pn2;
    await passportInstance.addPassport(lastname, salt).then(result =>{
        pn1 = result.logs[0].args.passportNumber.toString();
    });
    await passportInstance.addPassport(lastname, salt).then(result =>{
        pn2 = result.logs[0].args.passportNumber.toString();
    });
    assert.isAbove(Number(pn2), Number(pn1));
  });

  it("should allow anyone to get the passport expiration, with the date set about two years in the future", async () => {
    let pn;
    let [,from] = accounts;
    await passportInstance.addPassport(lastname, salt).then(result =>{
        pn = result.logs[0].args.passportNumber.toString();
    });
    let expirationDate = await passportInstance.isPassportExpired(Number(pn), {from});
    console.log(timeConverter(expirationDate.toString()));
    assert.isAbove(Number(expirationDate.toString()), futureTimestamp);
  });

  it("should allow admin to get secureHash given a passport number", async () => {
    let pn;
    await passportInstance.addPassport(lastname, salt).then(result =>{
        pn = result.logs[0].args.passportNumber.toString();
    });
    let secureHash = await passportInstance.getSecureHash(Number(pn));
    console.log(secureHash);
    assert.isNotNull(secureHash);
  });  

  it("should check the passport hash given correct inputs", async () => {
    let pn;
    await passportInstance.addPassport(lastname, salt).then(result =>{
        pn = result.logs[0].args.passportNumber.toString();
    });
    let isCorrectHash = await passportInstance.checkPassportHash(Number(pn), lastname, salt);
    assert.isBoolean(isCorrectHash);
    assert.strictEqual(isCorrectHash, true);
  });

  it("should add newAdmin and allow newAdmin to add passport and check hash", async () => {
    let pn;
    let [,newAdmin] = accounts;
    await passportInstance.addAdminRole(newAdmin);
    await passportInstance.addPassport(lastname, salt, {from: newAdmin}).then(result =>{
        pn = result.logs[0].args.passportNumber.toString();
    });
    let isCorrectHash = await passportInstance.checkPassportHash(Number(pn), lastname, salt, {from: newAdmin});
    assert.isBoolean(isCorrectHash);
    assert.strictEqual(isCorrectHash, true);
  });

  /* Uncomment to confirm failure, add {from} at the end of function call
  it("should only allow admins to add a passport or check hash", async () => {
    let pn;
    let [,from] = accounts;
    await passportInstance.addPassport(lastname, salt).then(result =>{
        pn = result.logs[0].args.passportNumber.toString();
    });
    let isCorrectHash = await passportInstance.checkPassportHash(Number(pn), lastname, salt, {from});
    assert.isBoolean(isCorrectHash);
    assert.strictEqual(isCorrectHash, true);
  });
  */

  function timeConverter(UNIX_timestamp){
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes() < 10 ? '0' + a.getMinutes() : a.getMinutes();
    var sec = a.getSeconds() < 10 ? '0' + a.getSeconds() : a.getSeconds();
    var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
    return time;
  }
});
