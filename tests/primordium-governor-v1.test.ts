import { Address, BigInt, ByteArray, Bytes } from "@graphprotocol/graph-ts";
import {
  assert,
  beforeAll,
  beforeEach,
  clearStore,
  describe,
  log,
  test,
} from "matchstick-as";
import { ADDRESS_1, ADDRESS_2, address1 } from "./test-utils";
import {
  handleProposalCreated,
  handleProposalDeadlineExtended,
  handleRoleGranted,
  handleRoleRevoked,
  handleVoteCast,
} from "../src/primordium-governor-v1";
import {
  createProposalCreatedEvent,
  createProposalDeadlineExtendedEvent,
  createRoleGrantedEvent,
  createRoleRevokedEvent,
  createVoteCastEvent,
} from "./primordium-governor-v1-utils";
import {
  CANCELER_ROLE,
  PROPOSER_ROLE,
  extractTitleFromDescription,
  getGovernanceData,
  getOrCreateDelegate,
  getOrCreateProposal,
  getOrCreateProposalVote,
} from "../src/utils";
import { Delegate, Proposal } from "../generated/schema";
import { PROPOSAL_STATE_PENDING } from "../src/constants";

const account = Address.fromString(ADDRESS_1);
const expiresAt = BigInt.fromI32(2);

describe("handleRoleGranted()", () => {
  beforeAll(clearStore);

  test("proposer role", () => {
    handleRoleGranted(
      createRoleGrantedEvent(PROPOSER_ROLE, account, expiresAt)
    );
    let delegate = Delegate.load(account) as Delegate;
    assert.bigIntEquals(delegate.proposerRoleExpiresAt, expiresAt);
  });

  test("canceler role", () => {
    handleRoleGranted(
      createRoleGrantedEvent(CANCELER_ROLE, account, expiresAt)
    );
    let delegate = Delegate.load(account) as Delegate;
    assert.bigIntEquals(delegate.cancelerRoleExpiresAt, expiresAt);
  });
});

describe("handleRoleRevoked()", () => {
  beforeAll(() => {
    clearStore();

    let delegate = getOrCreateDelegate(account);
    delegate.proposerRoleExpiresAt = expiresAt;
    delegate.cancelerRoleExpiresAt = expiresAt;
    delegate.save();
  });

  test("proposer role", () => {
    handleRoleRevoked(createRoleRevokedEvent(PROPOSER_ROLE, account));
    let delegate = Delegate.load(account) as Delegate;
    assert.bigIntEquals(BigInt.zero(), delegate.proposerRoleExpiresAt);
  });

  test("canceler role", () => {
    handleRoleRevoked(createRoleRevokedEvent(CANCELER_ROLE, account));
    let delegate = Delegate.load(account) as Delegate;
    assert.bigIntEquals(BigInt.zero(), delegate.cancelerRoleExpiresAt);
  });
});

const proposalNumber = BigInt.fromI32(1);
const proposer = Address.fromString(ADDRESS_1);
const targets = [Address.fromString(ADDRESS_2)];
const values = [BigInt.fromI32(100)];
const calldatas = [Bytes.fromUTF8("This is random calldata for testing")];
const signatures = ["randomSignature(uint256)"];
const voteStart = BigInt.fromI32(5);
const voteEnd = BigInt.fromI32(10);
const extendedVoteEnd = voteEnd.plus(BigInt.fromI32(5));
const description = "# Test Proposal\nThis is just a test description.";

function getTestProposal(): Proposal {
  return Proposal.load(
    Bytes.fromByteArray(ByteArray.fromBigInt(proposalNumber))
  ) as Proposal;
}

describe("Proposals...", () => {
  beforeAll(() => {
    clearStore();
    let delegate = getOrCreateDelegate(proposer);
    delegate.proposerRoleExpiresAt = BigInt.fromI32(100);
    delegate.save();
  });

  test("handleProposalCreated()", () => {
    const governanceData = getGovernanceData();
    const proposalCreatedEvent = createProposalCreatedEvent(
      proposalNumber,
      proposer,
      targets,
      values,
      calldatas,
      signatures,
      voteStart,
      voteEnd,
      description
    );

    proposalCreatedEvent.block.timestamp = BigInt.fromI32(99);

    handleProposalCreated(proposalCreatedEvent);

    let proposal = getTestProposal();
    assert.assertNotNull(proposal);
    assert.bigIntEquals(proposalNumber, BigInt.fromByteArray(proposal.id));
    assert.addressEquals(proposer, Address.fromBytes(proposal.proposer));
    assert.booleanEquals(true, proposal.isProposerRole);
    for (let i = 0; i < targets.length; i++) {
      assert.addressEquals(targets[i], Address.fromBytes(proposal.targets[i]));
      assert.bigIntEquals(values[i], proposal.values[i]);
      assert.bytesEquals(calldatas[i], proposal.calldatas[i]);
      assert.stringEquals(signatures[i], proposal.signatures[i]);
    }
    assert.bigIntEquals(
      proposalCreatedEvent.block.number,
      proposal.createdAtBlock
    );
    assert.bigIntEquals(
      proposalCreatedEvent.block.timestamp,
      proposal.createdAtTimestamp
    );
    assert.stringEquals(
      extractTitleFromDescription(description),
      proposal.title
    );
    assert.stringEquals(description, proposal.description);
    assert.bigIntEquals(voteStart, proposal.voteStart);
    assert.bigIntEquals(voteEnd, proposal.voteEnd);
    assert.bigIntEquals(voteEnd, proposal.originalVoteEnd);
    assert.stringEquals("blocknumber", proposal.clockMode);
    assert.stringEquals(PROPOSAL_STATE_PENDING, proposal.state);
    assert.bigIntEquals(BigInt.zero(), proposal.forVotes);
    assert.bigIntEquals(BigInt.zero(), proposal.againstVotes);
    assert.bigIntEquals(BigInt.zero(), proposal.abstainVotes);

    let updatedGovernanceData = getGovernanceData();
    assert.bigIntEquals(
      governanceData.proposalCount.plus(BigInt.fromI32(1)),
      updatedGovernanceData.proposalCount
    );
  });

  describe("casting votes...", () => {
    test("cast vote (against)", () => {
      const voter = address1;
      const weight = BigInt.fromI32(100);
      const reason = "idk, just didn't like it";
      const voteCastEvent = createVoteCastEvent(
        voter,
        proposalNumber,
        0,
        weight,
        reason
      );
      handleVoteCast(voteCastEvent);

      let proposalVote = getOrCreateProposalVote(voter, proposalNumber);
      assert.bytesEquals(
        Bytes.fromByteArray(ByteArray.fromBigInt(proposalNumber)),
        proposalVote.proposal
      );
      log.info("{}", [proposalVote.id.toHex()]);
      log.info("{}", [Bytes.fromByteArray(ByteArray.fromBigInt(proposalNumber)).toHex()]);
      log.info("{}", [BigInt.fromByteArray(Bytes.fromByteArray(ByteArray.fromBigInt(proposalNumber))).toString()])
      log.info("{}", [proposalNumber.toHex()]);
      assert.bytesEquals(voter, proposalVote.delegate);
      assert.bigIntEquals(weight, proposalVote.weight);
      assert.i32Equals(0, proposalVote.support);
      assert.booleanEquals(false, proposalVote.isForProposal);
      assert.stringEquals(reason, proposalVote.reason as string);
      assert.assertTrue(!proposalVote.params);
      assert.bigIntEquals(voteCastEvent.block.number, proposalVote.blockNumber);
      assert.bigIntEquals(
        voteCastEvent.block.timestamp,
        proposalVote.blockTimestamp
      );
    });
  });

  test("handleProposalDeadlineExtended()", () => {
    const proposalDeadlineExtendedEvent = createProposalDeadlineExtendedEvent(
      proposalNumber,
      extendedVoteEnd
    );
    handleProposalDeadlineExtended(proposalDeadlineExtendedEvent);

    let proposal = getOrCreateProposal(proposalNumber);
    assert.bigIntEquals(extendedVoteEnd, proposal.voteEnd);
    assert.bigIntEquals(voteEnd, proposal.originalVoteEnd);
  });
});
