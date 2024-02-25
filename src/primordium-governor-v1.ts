import { BigInt, ByteArray, Bytes, ethereum } from "@graphprotocol/graph-ts";
import {
  ProposalCanceled,
  ProposalCreated,
  ProposalDeadlineExtended,
  ProposalExecuted,
  ProposalQueued,
  RoleGranted,
  RoleRevoked,
  VoteCast,
  VoteCastWithParams,
} from "../generated/PrimordiumGovernorV1/PrimordiumGovernorV1";
import { CANCELER_ROLE, PROPOSER_ROLE, extractTitleFromDescription, getCurrentClock, getGovernanceData, getOrCreateDelegate, getOrCreateProposal, getOrCreateProposalVote } from "./utils";
import { Delegate } from "../generated/schema";
import { PROPOSAL_STATE_ACTIVE, PROPOSAL_STATE_PENDING } from "./constants";

export function handleProposalCreated(event: ProposalCreated): void {
  let proposal = getOrCreateProposal(event.params.proposalId);
  let delegate = Delegate.load(event.params.proposer);

  proposal.proposer = event.params.proposer;
  proposal.isProposerRole = !!delegate && delegate.proposerRoleExpiresAt.gt(event.block.timestamp);
  proposal.targets = changetype<Bytes[]>(event.params.targets);
  proposal.values = event.params.values;
  proposal.calldatas = event.params.calldatas;
  proposal.signatures = event.params.signatures;
  proposal.createdAtBlock = event.block.number;
  proposal.createdAtTimestamp = event.block.timestamp;
  proposal.createdTransactionHash = event.transaction.hash;
  proposal.title = extractTitleFromDescription(event.params.description);
  proposal.description = event.params.description;
  proposal.voteStart = event.params.voteStart;
  proposal.voteEnd = event.params.voteEnd;
  proposal.originalVoteEnd = event.params.voteEnd;

  // Infer "blocknumber" or "timestamp" mode based on the event voteStart value
  if (event.params.voteStart >= event.block.timestamp) {
    proposal.clockMode = "timestamp";
  } else {
    proposal.clockMode = "blocknumber";
  }

  const currentClock = getCurrentClock(event, proposal.clockMode);
  if (currentClock < proposal.voteStart) {
    proposal.state = PROPOSAL_STATE_PENDING;
  } else {
    proposal.state = PROPOSAL_STATE_ACTIVE;
  }

  proposal.forVotes = BigInt.zero();
  proposal.againstVotes = BigInt.zero();
  proposal.abstainVotes = BigInt.zero();

  proposal.save();

  let governanceData = getGovernanceData();
  governanceData.proposalCount = governanceData.proposalCount.plus(BigInt.fromI32(1));
  governanceData.save();
}

export function handleProposalDeadlineExtended(
  event: ProposalDeadlineExtended
): void {
  let proposal = getOrCreateProposal(event.params.proposalId);
  proposal.voteEnd = event.params.extendedDeadline;
  proposal.save();
}

export function handleProposalQueued(event: ProposalQueued): void {}

export function handleProposalExecuted(event: ProposalExecuted): void {}

export function handleProposalCanceled(event: ProposalCanceled): void {}

export function handleRoleGranted(event: RoleGranted): void {
  let delegate = getOrCreateDelegate(event.params.account);
  if (event.params.role.equals(PROPOSER_ROLE)) {
    delegate.proposerRoleExpiresAt = event.params.expiresAt;
    delegate.save();
  } else if (event.params.role.equals(CANCELER_ROLE)) {
    delegate.cancelerRoleExpiresAt = event.params.expiresAt;
    delegate.save();
  }
}

export function handleRoleRevoked(event: RoleRevoked): void {
  let delegate = getOrCreateDelegate(event.params.account);
  if (event.params.role.equals(PROPOSER_ROLE)) {
    delegate.proposerRoleExpiresAt = BigInt.zero();
    delegate.save();
  } else if (event.params.role.equals(CANCELER_ROLE)) {
    delegate.cancelerRoleExpiresAt = BigInt.zero();
    delegate.save();
  }
}

export function handleVoteCast(event: VoteCast): void {
  // Simply handle as a VoteCastWithParams event, but where the params are set to zero bytes
  event.parameters.push(new ethereum.EventParam("params", ethereum.Value.fromBytes(new Bytes(0))));
  handleVoteCastWithParams(changetype<VoteCastWithParams>(event));
}

export function handleVoteCastWithParams(event: VoteCastWithParams): void {
  let proposalVote = getOrCreateProposalVote(event.params.voter, event.params.proposalId);
  let proposal = getOrCreateProposal(event.params.proposalId);

  // Ensure that a delegate exists for the voter (in case a vote is cast with zero weight)
  getOrCreateDelegate(event.params.voter);

  // Initialize the ProposalVote
  proposalVote.proposal = Bytes.fromByteArray(ByteArray.fromBigInt(event.params.proposalId));
  proposalVote.delegate = event.params.voter;
  proposalVote.weight = event.params.weight;
  proposalVote.support = event.params.support;
  proposalVote.isForProposal = event.params.support == 1;
  proposalVote.reason = event.params.reason.length > 0 ? event.params.reason : null;
  proposalVote.params = event.params.params.length > 0 ? event.params.params : null;
  proposalVote.blockNumber = event.block.number;
  proposalVote.blockTimestamp = event.block.timestamp;

  proposalVote.save();

  // Update proposal state to active (if necessary)
  if (proposal.state != PROPOSAL_STATE_ACTIVE) {
    proposal.state = PROPOSAL_STATE_ACTIVE;
  }

  // Update the votes on the proposal
  if (event.params.support == 0) {
    proposal.againstVotes = proposal.againstVotes.plus(event.params.weight);
  } else if (event.params.support == 1) {
    proposal.forVotes = proposal.forVotes.plus(event.params.weight);
  } else if (event.params.support == 2) {
    proposal.abstainVotes = proposal.abstainVotes.plus(event.params.weight);
  }

  proposal.save();
}