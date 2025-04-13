// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MedicalRecords {
    // Structures
    struct Patient {
        bool exists;
        address patientAddress;
        string patientName;
        string patientId; // e.g., SSN or custom ID
        uint256 recordCount;
        // Removed mapping from struct
    }

    struct Record {
        uint256 id;
        string recordType; // e.g., "Prescription", "Lab Report", "Diagnosis"
        string recordHash; // IPFS hash of the encrypted record
        uint256 timestamp;
        address doctorAddress;
        string doctorName;
        string metadata; // Additional information in JSON format
    }

    // State variables
    mapping(address => Patient) private patients;
    // Two level mapping instead of nested mapping in struct
    mapping(address => mapping(uint256 => Record)) private patientRecords;
    mapping(address => bool) private doctors;
    address private admin;

    // Events
    event PatientRegistered(address indexed patientAddress, string patientId);
    event DoctorRegistered(address indexed doctorAddress);
    event RecordAdded(
        address indexed patientAddress,
        uint256 recordId,
        string recordType
    );
    event ConsentGiven(
        address indexed patientAddress,
        address indexed accessAddress,
        uint256 expiryTime
    );

    // Access modifiers
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    modifier onlyDoctor() {
        require(
            doctors[msg.sender],
            "Only registered doctors can perform this action"
        );
        _;
    }

    modifier onlyPatient() {
        require(
            patients[msg.sender].exists,
            "Only registered patients can perform this action"
        );
        _;
    }

    // Consent system
    mapping(address => mapping(address => uint256)) private consents; // patient -> accessor -> expiry timestamp

    constructor() {
        admin = msg.sender;
    }

    // Admin functions
    function registerDoctor(address _doctorAddress) public onlyAdmin {
        doctors[_doctorAddress] = true;
        emit DoctorRegistered(_doctorAddress);
    }

    // Patient functions
    function registerPatient(string memory _name, string memory _id) public {
        require(!patients[msg.sender].exists, "Patient already registered");

        patients[msg.sender] = Patient({
            exists: true,
            patientAddress: msg.sender,
            patientName: _name,
            patientId: _id,
            recordCount: 0
        });

        emit PatientRegistered(msg.sender, _id);
    }

    function addRecord(
        address _patientAddress,
        string memory _recordType,
        string memory _recordHash,
        string memory _doctorName,
        string memory _metadata
    ) public onlyDoctor {
        require(patients[_patientAddress].exists, "Patient does not exist");

        uint256 newRecordId = patients[_patientAddress].recordCount;

        patientRecords[_patientAddress][newRecordId] = Record({
            id: newRecordId,
            recordType: _recordType,
            recordHash: _recordHash,
            timestamp: block.timestamp,
            doctorAddress: msg.sender,
            doctorName: _doctorName,
            metadata: _metadata
        });

        patients[_patientAddress].recordCount++;

        emit RecordAdded(_patientAddress, newRecordId, _recordType);
    }

    function grantConsent(
        address _accessor,
        uint256 _durationInDays
    ) public onlyPatient {
        uint256 expiryTime = block.timestamp + (_durationInDays * 1 days);
        consents[msg.sender][_accessor] = expiryTime;
        emit ConsentGiven(msg.sender, _accessor, expiryTime);
    }

    function revokeConsent(address _accessor) public onlyPatient {
        consents[msg.sender][_accessor] = 0;
    }

    // View functions
    function getPatientDetails()
        public
        view
        returns (string memory, string memory, uint256)
    {
        require(patients[msg.sender].exists, "Patient does not exist");
        Patient storage patient = patients[msg.sender];
        return (patient.patientName, patient.patientId, patient.recordCount);
    }

    function getRecordDetails(
        uint256 _recordId
    )
        public
        view
        returns (
            string memory,
            string memory,
            uint256,
            address,
            string memory,
            string memory
        )
    {
        require(patients[msg.sender].exists, "Patient does not exist");
        require(
            _recordId < patients[msg.sender].recordCount,
            "Record does not exist"
        );

        Record storage record = patientRecords[msg.sender][_recordId];
        return (
            record.recordType,
            record.recordHash,
            record.timestamp,
            record.doctorAddress,
            record.doctorName,
            record.metadata
        );
    }

    function checkConsent(
        address _patientAddress,
        address _accessor
    ) public view returns (bool) {
        uint256 expiryTime = consents[_patientAddress][_accessor];
        return (expiryTime > block.timestamp);
    }

    function isDoctor(address _address) public view returns (bool) {
        return doctors[_address];
    }

    function isAdmin(address _address) public view returns (bool) {
        return _address == admin;
    }
}
