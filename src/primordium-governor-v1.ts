import { BigInt, Bytes } from "@graphprotocol/graph-ts";
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
import { CANCELER_ROLE, PROPOSER_ROLE, extractTitleFromDescription, getOrCreateDelegate, getOrCreateProposal } from "./utils";

export function handleProposalCanceled(event: ProposalCanceled): void {}

export function handleProposalCreated(event: ProposalCreated): void {
  let proposal = getOrCreateProposal(event.params.proposalId);

  proposal.proposer = event.params.proposer;
  proposal.targets = changetype<Bytes[]>(event.params.targets);
  proposal.values = event.params.values;
  proposal.calldatas = event.params.calldatas;
  proposal.signatures = event.params.signatures;
  proposal.createdAtBlock = event.block.number;
  proposal.createdAtTimestamp = event.block.timestamp;
  proposal.title = extractTitleFromDescription(event.params.description);
  proposal.description = event.params.description;
  proposal.voteStart = event.params.voteStart;
  proposal.voteEnd = event.params.voteEnd;

  // Infer "blocknumber" or "timestamp" mode based on the event voteStart value
  if (event.params.voteStart >= event.block.timestamp) {
    proposal.clockMode = "timestamp";
  } else {
    proposal.clockMode = "blocknumber";
  }

  proposal.save();
}

export function handleProposalDeadlineExtended(
  event: ProposalDeadlineExtended
): void {}

export function handleProposalExecuted(event: ProposalExecuted): void {}

export function handleProposalQueued(event: ProposalQueued): void {}

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

export function handleVoteCast(event: VoteCast): void {}

export function handleVoteCastWithParams(event: VoteCastWithParams): void {}