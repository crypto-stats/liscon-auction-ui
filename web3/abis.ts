export const AUCTION_ABI = [
  `event NewSponsor(
    bytes32 indexed sponsor,
    bytes16 indexed campaign,
    address indexed owner,
    address token,
    uint128 paymentPerBlock,
    string metadata
  )`,
  `event PaymentProcessed(
    bytes16 indexed campaign,
    bytes32 indexed sponsor,
    address indexed paymentToken,
    uint256 paymentAmount
  )`,
  'event SponsorActivated(bytes16 indexed campaign, bytes32 indexed sponsor)',
  'event SponsorDeactivated(bytes16 indexed campaign, bytes32 indexed sponsor)',
  `event SponsorSwapped(
    bytes16 campaign,
    bytes32 sponsorDeactivated,
    bytes32 sponsorActivated
  )`,
  'event MetadataUpdated(bytes32 indexed sponsor, string metadata)',
  'event SponsorOwnerTransferred(bytes32 indexed sponsor, address newOwner)',
  'event BidUpdated(bytes32 indexed sponsor, address indexed token, uint256 paymentPerBlock)',

  'event Deposit(bytes32 indexed sponsor, address indexed token, uint256 amount)',
  'event Withdrawal(bytes32 indexed sponsor, address indexed token, uint256 amount)',

  'event ApprovalSet(bytes32 indexed sponsor, bool approved)',
  'event NumberOfSlotsChanged(bytes16 indexed campaign, uint8 newNumSlots)',
  'event TreasuryWithdrawal(address indexed token, address indexed recipient, uint256 amount)',

  'function oracle() external view returns (address)',

  `function getSponsor(bytes32 sponsorId) external view returns (
    address owner,
    bool approved,
    bool active,
    address token,
    uint128 paymentPerBlock,
    bytes16 campaign,
    uint32 lastUpdated,
    string memory metadata
  )`,
  'function getCampaign(bytes16 campaignId) external view returns (uint8 slots, uint8 activeSlots)',
  `function sponsorBalance(bytes32 sponsorId) external view returns (
    uint128 balance,
    uint128 storedBalance,
    uint128 pendingPayment
  )`,
  'function getActiveSponsors(bytes16 campaignId) external view returns (bytes32[] memory activeSponsors)',
  `function paymentRate(bytes32 sponsorId) external view returns (
    uint128 paymentPerBlock,
    uint128 paymentPerBlockInETH
  )`,
  'function paymentCollected(address token) external view returns (uint256)',

  // Sponsor functions
  `function createSponsor(
    address _token,
    bytes16 campaign,
    uint256 initialDeposit,
    uint128 paymentPerBlock,
    string calldata metadata
  ) external returns (bytes32 id)`,
  'function deposit(bytes32 sponsorId, uint256 amount) external',
  'function updateBid(bytes32 sponsorId, address token, uint128 paymentPerBlock) external',
  'function updateMetadata(bytes32 sponsorId, string calldata metadata) external',
  `function withdraw(
    bytes32 sponsorId,
    uint256 amountRequested,
    address recipient
  ) external returns (uint256 withdrawAmount)`,
  'function transferSponsorOwnership(bytes32 sponsorId, address newOwner) external',

  // List adjustments
  'function lift(bytes32 sponsorId) external',
  'function drop(bytes32 sponsorId) external',
  'function swap(bytes32 inactiveSponsorId, bytes32 activeSponsorId) external',
  'function processPayment(bytes32 sponsorId) external',

  // Owner functions
  'function setApproved(bytes32 sponsorId, bool approved) external',
  'function setNumSlots(bytes16 campaign, uint8 newNumSlots) external',
  'function withdrawTreasury(address token, address recipient) external returns (uint256 amount)',

  'function owner() external view returns (address)',
]

export const WETH_ADAPTER_ABI = [
  `function createSponsor(
    bytes16 campaign,
    uint128 paymentPerBlock,
    string calldata metadata
  ) external payable returns (bytes32 id)`,
  'function deposit(bytes32 sponsorId) external payable',
]
