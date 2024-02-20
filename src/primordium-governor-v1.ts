import {
  PrimordiumGovernorV1,
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

export function handleProposalCanceled(event: ProposalCanceled): void {}

export function handleProposalCreated(event: ProposalCreated): void {}

export function handleProposalDeadlineExtended(
  event: ProposalDeadlineExtended
): void {}

export function handleProposalExecuted(event: ProposalExecuted): void {}

export function handleProposalQueued(event: ProposalQueued): void {}

export function handleRoleGranted(event: RoleGranted): void {}

export function handleRoleRevoked(event: RoleRevoked): void {}

export function handleVoteCast(event: VoteCast): void {}

export function handleVoteCastWithParams(event: VoteCastWithParams): void {}