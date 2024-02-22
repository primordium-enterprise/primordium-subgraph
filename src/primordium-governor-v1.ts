import { Bytes } from "@graphprotocol/graph-ts";
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
} from "./types/PrimordiumGovernorV1/PrimordiumGovernorV1"
import { extractTitleFromDescription, getOrCreateProposal } from "./utils/primordium-governor-v1-utils"

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

export function handleRoleGranted(event: RoleGranted): void {}

export function handleRoleRevoked(event: RoleRevoked): void {}

export function handleVoteCast(event: VoteCast): void {}

export function handleVoteCastWithParams(event: VoteCastWithParams): void {}