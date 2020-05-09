pragma solidity ^ 0.5.0;

import "@openzeppelin/contracts/access/Roles.sol";
import "@openzeppelin/contracts/GSN/Context.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/drafts/Counters.sol";

contract Passport is Context {
    using SafeMath for uint256;
    uint constant VALID_DURATION = 104 weeks;

    // OZ counter and access control
    using Counters for Counters.Counter;
    Counters.Counter private _passportNumbers;
    using Roles for Roles.Role;
    Roles.Role private _admin;

    struct PassportHash {
        bytes32 secureHash;
        uint256 expirationDate;
    }

    mapping(uint256 => PassportHash) SecurePassport;
    event PassportAdded(uint256 passportNumber);

    modifier onlyAdmin() {
        require(_admin.has(_msgSender()), "DOES_NOT_HAVE_ADMIN_ROLE");
        _;
    }

    constructor() public {
        _admin.add(_msgSender());
    }

    /**
     * @dev Existing admin may add new admins for access control
     * @param newAdmin Address of new admin
     */
    function addAdminRole(address newAdmin) public onlyAdmin {
        require(newAdmin != address(0), "Address must not be 0x");
        _admin.add(newAdmin);
    }

    /**
     * @dev Add a new passport
     * @param _lastname Lastname of passport recipient
     * @param _salt Private password known only to admins, salt added to sha256 of _lastname
     */
    function addPassport(string memory _lastname, string memory _salt) public onlyAdmin {
        uint256 _passportNumber = _passportNumbers.current();
        _passportNumbers.increment();
        uint256 _expirationDate = now.add(VALID_DURATION);
        bytes32 _secureHash = sha256(abi.encodePacked(_lastname, _salt));

        SecurePassport[_passportNumber] = PassportHash(_secureHash, _expirationDate);
        emit PassportAdded(_passportNumber);
    }

    /**
     * @dev Check if a given set of data on a passport corresponds to what is stored on chain
     * @param _passportNumber Passport number of given passport to be verified
     * @param _lastname Lastname of passport recipient
     * @param _salt Private password known only to admins, salt added to sha256 of _lastname
     */
    function checkPassportHash(uint256 _passportNumber, string memory _lastname, string memory _salt) public view onlyAdmin returns(bool isValid) {
        if (SecurePassport[_passportNumber].secureHash == sha256(abi.encodePacked(_lastname, _salt))) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * @dev Anyone may check expiration date of passport
     * @param _passportNumber Passport number of given passport to be verified
     */
    function isPassportExpired(uint256 _passportNumber) public view returns(uint256 expirationDate) {
        return SecurePassport[_passportNumber].expirationDate;
    }

    /**
     * @dev Allow admin to get secureHash given proper inputs
     * @param _passportNumber Passport number of given passport to be verified
     */
    function getSecureHash(uint256 _passportNumber) public view onlyAdmin returns(bytes32 secureHash) {
        return SecurePassport[_passportNumber].secureHash;
    }
}