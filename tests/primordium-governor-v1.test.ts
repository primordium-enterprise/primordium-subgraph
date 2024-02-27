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
import {
  ADDRESS_1,
  ADDRESS_2,
  address1,
  address2,
  address3,
} from "./test-utils";
import {
  handleBaseDeadlineExtensionUpdate,
  handleExtensionDecayPeriodUpdate,
  handleExtensionPercentDecayUpdate,
  handleGovernorBaseInitialized,
  handleGovernorFounded,
  handleMaxDeadlineExtensionUpdate,
  handlePercentMajorityUpdate,
  handleProposalCanceled,
  handleProposalCreated,
  handleProposalDeadlineExtended,
  handleProposalExecuted,
  handleProposalGracePeriodUpdate,
  handleProposalQueued,
  handleProposalThresholdBPSUpdate,
  handleQuorumBPSUpdate,
  handleRoleGranted,
  handleRoleRevoked,
  handleVoteCast,
  handleVoteCastWithParams,
  handleVotingDelayUpdate,
  handleVotingPeriodUpdate,
} from "../src/primordium-governor-v1";
import {
  createBaseDeadlineExtensionUpdateEvent,
  createExtensionDecayPeriodUpdateEvent,
  createExtensionPercentDecayUpdateEvent,
  createGovernorBaseInitializedEvent,
  createGovernorFoundedEvent,
  createMaxDeadlineExtensionUpdateEvent,
  createPercentMajorityUpdateEvent,
  createProposalCanceledEvent,
  createProposalCreatedEvent,
  createProposalDeadlineExtendedEvent,
  createProposalExecutedEvent,
  createProposalGracePeriodUpdateEvent,
  createProposalQueuedEvent,
  createProposalThresholdBPSUpdateEvent,
  createQuorumBPSUpdateEvent,
  createRoleGrantedEvent,
  createRoleRevokedEvent,
  createVoteCastEvent,
  createVoteCastWithParamsEvent,
  createVotingDelayUpdateEvent,
  createVotingPeriodUpdateEvent,
} from "./primordium-governor-v1-utils";
import {
  CANCELER_ROLE,
  PROPOSER_ROLE,
  extractTitleFromDescription,
  formatBigIntAsId,
  unformatBigIntAsId,
  getGovernanceData,
  getOrCreateDelegate,
  getOrCreateProposal,
  getOrCreateProposalVote,
} from "../src/utils";
import { Delegate, Proposal } from "../generated/schema";
import {
  PROPOSAL_STATE_ACTIVE,
  PROPOSAL_STATE_CANCELED,
  PROPOSAL_STATE_EXECUTED,
  PROPOSAL_STATE_PENDING,
  PROPOSAL_STATE_QUEUED,
} from "../src/constants";

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
const againstVotesWeight = BigInt.fromI32(100);
const forVotesWeight = BigInt.fromI32(1000);
const abstainVotesWeight = BigInt.fromI32(10000);

function getTestProposal(): Proposal {
  return Proposal.load(formatBigIntAsId(proposalNumber)) as Proposal;
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
    assert.bigIntEquals(proposalNumber, unformatBigIntAsId(proposal.id));
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
      const event = createVoteCastEvent(
        address1,
        proposalNumber,
        0,
        againstVotesWeight,
        "idk, just didn't like it"
      );
      handleVoteCast(event);

      let proposalVote = getOrCreateProposalVote(
        proposalNumber,
        event.params.voter
      );
      assert.bytesEquals(
        formatBigIntAsId(proposalNumber),
        proposalVote.proposal
      );
      assert.bytesEquals(event.params.voter, proposalVote.delegate);
      assert.bigIntEquals(event.params.weight, proposalVote.weight);
      assert.i32Equals(0, proposalVote.support);
      assert.booleanEquals(false, proposalVote.isForProposal);
      assert.stringEquals(event.params.reason, proposalVote.reason as string);
      assert.assertTrue(!proposalVote.params);
      assert.bigIntEquals(event.block.number, proposalVote.blockNumber);
      assert.bigIntEquals(event.block.timestamp, proposalVote.blockTimestamp);

      let proposal = getTestProposal();
      assert.stringEquals(PROPOSAL_STATE_ACTIVE, proposal.state);
      assert.bigIntEquals(againstVotesWeight, proposal.againstVotes);
      assert.bigIntEquals(BigInt.zero(), proposal.forVotes);
      assert.bigIntEquals(BigInt.zero(), proposal.abstainVotes);
    });

    test("cast vote (for)", () => {
      const event = createVoteCastWithParamsEvent(
        address2,
        proposalNumber,
        1,
        forVotesWeight,
        "so for it, never liked a proposal so much in my entire life",
        Bytes.fromUTF8("some bytes or whatever")
      );
      handleVoteCastWithParams(event);

      let proposalVote = getOrCreateProposalVote(
        proposalNumber,
        event.params.voter
      );
      assert.bytesEquals(
        formatBigIntAsId(proposalNumber),
        proposalVote.proposal
      );
      assert.bytesEquals(event.params.voter, proposalVote.delegate);
      assert.bigIntEquals(event.params.weight, proposalVote.weight);
      assert.i32Equals(1, proposalVote.support);
      assert.booleanEquals(true, proposalVote.isForProposal);
      assert.stringEquals(event.params.reason, proposalVote.reason as string);
      assert.bytesEquals(event.params.params, proposalVote.params as Bytes);
      assert.bigIntEquals(event.block.number, proposalVote.blockNumber);
      assert.bigIntEquals(event.block.timestamp, proposalVote.blockTimestamp);

      let proposal = getTestProposal();
      assert.stringEquals(PROPOSAL_STATE_ACTIVE, proposal.state);
      assert.bigIntEquals(againstVotesWeight, proposal.againstVotes);
      assert.bigIntEquals(forVotesWeight, proposal.forVotes);
      assert.bigIntEquals(BigInt.zero(), proposal.abstainVotes);
    });

    test("cast vote (abstain)", () => {
      const event = createVoteCastWithParamsEvent(
        address3,
        proposalNumber,
        2,
        abstainVotesWeight,
        "i could go either way",
        new Bytes(0)
      );
      handleVoteCastWithParams(event);

      let proposalVote = getOrCreateProposalVote(
        proposalNumber,
        event.params.voter
      );
      assert.bytesEquals(
        formatBigIntAsId(proposalNumber),
        proposalVote.proposal
      );
      assert.bytesEquals(event.params.voter, proposalVote.delegate);
      assert.bigIntEquals(event.params.weight, proposalVote.weight);
      assert.i32Equals(2, proposalVote.support);
      assert.booleanEquals(false, proposalVote.isForProposal);
      assert.stringEquals(event.params.reason, proposalVote.reason as string);
      assert.assertTrue(!proposalVote.params); // Params should be null for zero-length Bytes
      assert.bigIntEquals(event.block.number, proposalVote.blockNumber);
      assert.bigIntEquals(event.block.timestamp, proposalVote.blockTimestamp);

      let proposal = getTestProposal();
      assert.stringEquals(PROPOSAL_STATE_ACTIVE, proposal.state);
      assert.bigIntEquals(againstVotesWeight, proposal.againstVotes);
      assert.bigIntEquals(forVotesWeight, proposal.forVotes);
      assert.bigIntEquals(abstainVotesWeight, proposal.abstainVotes);
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

  test("handleProposalQueued()", () => {
    const event = createProposalQueuedEvent(
      proposalNumber,
      BigInt.fromI32(1000)
    );
    handleProposalQueued(event);

    let proposal = getTestProposal();
    assert.stringEquals(PROPOSAL_STATE_QUEUED, proposal.state);
    assert.bigIntEquals(event.params.eta, proposal.eta as BigInt);
    assert.bigIntEquals(event.block.number, proposal.queuedAtBlock as BigInt);
    assert.bigIntEquals(
      event.block.timestamp,
      proposal.queuedAtTimestamp as BigInt
    );
  });

  test("handleProposalExecuted()", () => {
    const event = createProposalExecutedEvent(proposalNumber);
    handleProposalExecuted(event);

    let proposal = getTestProposal();
    assert.stringEquals(PROPOSAL_STATE_EXECUTED, proposal.state);
    assert.bigIntEquals(event.block.number, proposal.executedAtBlock as BigInt);
    assert.bigIntEquals(
      event.block.timestamp,
      proposal.executedAtTimestamp as BigInt
    );
    assert.bytesEquals(
      event.transaction.hash,
      proposal.executedTransactionHash as Bytes
    );
  });

  test("handleProposalCanceled()", () => {
    handleRoleGranted(
      createRoleGrantedEvent(CANCELER_ROLE, address3, BigInt.fromI32(10000000))
    );
    const event = createProposalCanceledEvent(proposalNumber, address3);
    handleProposalCanceled(event);

    let proposal = getTestProposal();
    assert.stringEquals(PROPOSAL_STATE_CANCELED, proposal.state);
    assert.bigIntEquals(event.block.number, proposal.canceledAtBlock as BigInt);
    assert.bigIntEquals(
      event.block.timestamp,
      proposal.canceledAtTimestamp as BigInt
    );
    assert.addressEquals(
      event.params.canceler,
      Address.fromBytes(proposal.canceler as Bytes)
    );
    assert.booleanEquals(true, proposal.isCancelerRole);
  });
});

describe("governance data updates...", () => {
  beforeEach(clearStore);

  test("handleProposalThresholdBPSUpdate()", () => {
    const event = createProposalThresholdBPSUpdateEvent(
      BigInt.zero(),
      BigInt.fromU32(100)
    );
    handleProposalThresholdBPSUpdate(event);

    let governanceData = getGovernanceData();
    assert.i32Equals(
      event.params.newProposalThresholdBps.toI32(),
      governanceData.proposalThresholdBps
    );
  });

  test("handleQuorumBPSUpdate()", () => {
    const event = createQuorumBPSUpdateEvent(
      BigInt.zero(),
      BigInt.fromU32(100)
    );
    handleQuorumBPSUpdate(event);

    let governanceData = getGovernanceData();
    assert.i32Equals(
      event.params.newQuorumBps.toI32(),
      governanceData.quorumBps
    );
  });

  test("handleProposalGracePeriodUpdate()", () => {
    const event = createProposalGracePeriodUpdateEvent(
      BigInt.zero(),
      BigInt.fromU32(1000)
    );
    handleProposalGracePeriodUpdate(event);

    let governanceData = getGovernanceData();
    assert.bigIntEquals(
      event.params.newGracePeriod,
      governanceData.proposalGracePeriod
    );
  });

  test("handleGovernorBaseInitialized()", () => {
    const event = createGovernorBaseInitializedEvent(
      Address.zero(),
      Address.zero(),
      BigInt.fromI32(10),
      BigInt.fromI32(100),
      false
    );
    handleGovernorBaseInitialized(event);

    let governanceData = getGovernanceData();
    assert.bigIntEquals(
      event.params.governanceCanBeginAt,
      governanceData.governanceCanBeginAt
    );
    assert.i32Equals(
      event.params.governanceThresholdBps.toI32(),
      governanceData.governanceThresholdBps
    );
    assert.booleanEquals(event.params.isFounded, governanceData.isFounded);
  });

  test("handleGovernorFounded()", () => {
    const event = createGovernorFoundedEvent(proposalNumber);
    handleGovernorFounded(event);

    let governanceData = getGovernanceData();
    assert.booleanEquals(true, governanceData.isFounded);
    assert.bigIntEquals(
      event.block.number,
      governanceData.foundedAtBlock as BigInt
    );
    assert.bigIntEquals(
      event.block.timestamp,
      governanceData.foundedAtTimestamp as BigInt
    );
  });

  test("handleVotingDelayUpdate()", () => {
    const event = createVotingDelayUpdateEvent(
      BigInt.zero(),
      BigInt.fromI32(200)
    );
    handleVotingDelayUpdate(event);

    let governanceData = getGovernanceData();
    assert.bigIntEquals(
      event.params.newVotingDelay,
      governanceData.votingDelay
    );
  });

  test("handleVotingPeriodUpdate()", () => {
    const event = createVotingPeriodUpdateEvent(
      BigInt.zero(),
      BigInt.fromI32(200)
    );
    handleVotingPeriodUpdate(event);

    let governanceData = getGovernanceData();
    assert.bigIntEquals(
      event.params.newVotingPeriod,
      governanceData.votingPeriod
    );
  });

  test("handlePercentMajorityUpdate()", () => {
    const event = createPercentMajorityUpdateEvent(
      BigInt.zero(),
      BigInt.fromI32(60)
    );
    handlePercentMajorityUpdate(event);

    let governanceData = getGovernanceData();
    assert.i32Equals(
      event.params.newPercentMajority.toI32(),
      governanceData.percentMajority
    );
  });

  test("handleMaxDeadlineExtensionUpdate()", () => {
    const event = createMaxDeadlineExtensionUpdateEvent(
      BigInt.zero(),
      BigInt.fromI32(100)
    );
    handleMaxDeadlineExtensionUpdate(event);

    let governanceData = getGovernanceData();
    assert.bigIntEquals(
      event.params.newMaxDeadlineExtension,
      governanceData.maxDeadlineExtension
    );
  });

  test("handleBaseDeadlineExtensionUpdate()", () => {
    const event = createBaseDeadlineExtensionUpdateEvent(
      BigInt.zero(),
      BigInt.fromI32(100)
    );
    handleBaseDeadlineExtensionUpdate(event);

    let governanceData = getGovernanceData();
    assert.bigIntEquals(
      event.params.newBaseDeadlineExtension,
      governanceData.baseDeadlineExtension
    );
  });

  test("handleExtensionDecayPeriodUpdate()", () => {
    const event = createExtensionDecayPeriodUpdateEvent(
      BigInt.zero(),
      BigInt.fromI32(100)
    );
    handleExtensionDecayPeriodUpdate(event);

    let governanceData = getGovernanceData();
    assert.bigIntEquals(
      event.params.newDecayPeriod,
      governanceData.extensionDecayPeriod
    );
  });

  test("handleExtensionPercentDecayUpdate()", () => {
    const event = createExtensionPercentDecayUpdateEvent(
      BigInt.zero(),
      BigInt.fromI32(2)
    );
    handleExtensionPercentDecayUpdate(event);

    let governanceData = getGovernanceData();
    assert.i32Equals(
      event.params.newPercentDecay.toI32(),
      governanceData.extensionPercentDecay
    );
  });
});
